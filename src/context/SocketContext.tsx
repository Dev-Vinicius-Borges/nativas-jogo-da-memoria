"use client";

import IJogador from "@/utils/interfaces/IJogador";
import IPartida from "@/utils/interfaces/IPartida";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  partida: IPartida | null;
  conectado: boolean;
  cartasViradas: number[];
  cartasEncontradas: number[];
  criarPartida: (colunas: number, linhas: number, cartas: unknown[]) => void;
  entrarPartida: (partidaId: string, nomeJogador: string) => void;
  virarCarta: (indiceCarta: number) => void;
  buscarPartida: (partidaId: string) => void;
  entrarComoEspectador: (partidaId: string, nomeEspectador: string) => void;
  erro: string | null;
  fimPartida: {
    status: boolean;
    ganhador: string | null;
  };
}

interface SocketProviderProps {
  children: ReactNode;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [partida, setPartida] = useState<IPartida | null>(null);
  const [conectado, setConectado] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);
  const [cartasViradas, setCartasViradas] = useState<number[]>([]);
  const [cartasEncontradas, setCartasEncontradas] = useState<number[]>([]);
  const [fimPartida, setFimPartida] = useState<{
    status: boolean;
    ganhador: string | null;
  }>({ status: false, ganhador: null });

  const criarPartida = (colunas: number, linhas: number, cartas: unknown[]) => {
    if (socket) {
      console.log(`Cartas: ${cartas}`);
      socket.emit("criarPartida", { colunas, linhas, cartas });
    }
  };

  const entrarPartida = (partidaId: string, nomeJogador: string) => {
    if (socket) {
      socket.emit("entrarPartida", { partidaId, nomeJogador });
    }
  };

  const entrarComoEspectador = (partidaId: string, nomeEspectador: string) => {
    if (socket && partida) {
      socket.emit("entrarComoEspectador", { partidaId, nomeEspectador });
    }
  };

  const buscarPartida = (partidaId: string) => {
    if (socket) {
      socket.emit("buscarPartida", { partidaId });
    }
  };

  const virarCarta = (indiceCarta: number) => {
    if (
      socket &&
      partida &&
      cartasViradas.length < 3 &&
      !cartasViradas.includes(indiceCarta) &&
      !cartasEncontradas.includes(indiceCarta)
    ) {
      socket.emit("virarCarta", { partidaId: partida.id, indiceCarta });
    }
  };

  useEffect(() => {
    const socketInstance = io({ path: "/api/socket" });

    socketInstance.on("connect", () => {
      setConectado(true);
    });

    socketInstance.on("disconnect", () => {
      setConectado(false);
    });

    socketInstance.on(
      "partidaCriada",
      (dados: { partidaId: string; partida: IPartida }) => {
        setPartida(dados.partida);
      }
    );

    socketInstance.on("partidaAtualizada", (partidaAtualizada: IPartida) => {
      setPartida(partidaAtualizada);
    });

    socketInstance.on("partidaEncontrada", (partidaEncontrada: IPartida) => {
      setPartida(partidaEncontrada);
    });

    socketInstance.on(
      "cartaVirada",
      (dados: { indiceCarta: number; jogadorId: string }) => {
        setCartasViradas((prev) => {
          if (!prev.includes(dados.indiceCarta)) {
            return [...prev, dados.indiceCarta];
          }
          return prev;
        });
      }
    );

    socketInstance.on(
      "parEncontrado",
      (dados: { cartas: number[]; jogadorId: string }) => {
        setCartasEncontradas((prev) => [...prev, ...dados.cartas]);
        setCartasViradas((prev) =>
          prev.filter((carta) => !dados.cartas.includes(carta))
        );
      }
    );

    socketInstance.on("cartasVirarDeVolta", (cartas: number[]) => {
      setCartasViradas((prev) =>
        prev.filter((carta) => !cartas.includes(carta))
      );
    });

    socketInstance.on("fimDeJogo", (jogador: IJogador) => {
      setFimPartida({
        status: true,
        ganhador: jogador.nome,
      });
    });

    socketInstance.on("erro", (dados: { mensagem: string }) => {
      setErro(dados.mensagem);
      setTimeout(() => {
        setErro(null);
        
      }, 3000);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        partida,
        conectado,
        cartasViradas,
        cartasEncontradas,
        criarPartida,
        entrarPartida,
        entrarComoEspectador,
        buscarPartida,
        virarCarta,
        erro,
        fimPartida,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket deve ser usado dentro de um provider");
  }
  return context;
};
