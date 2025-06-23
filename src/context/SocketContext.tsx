"use client";

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
  criarPartida: (colunas: number, linhas: number, cartas: any[]) => void;
  entrarPartida: (partidaId: string, nomeJogador: string) => void;
  entrarComoEspectador: (partidaId: string) => void;
  virarCarta: (indiceCarta: number) => void;
  buscarPartida: (partidaId: string) => void;
  erro: string | null;
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

  const criarPartida = (colunas: number, linhas: number, cartas: any[]) => {
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

  const entrarComoEspectador = (partidaId: string) => {
    if (socket) {
      socket.emit("entrarComoEspectador", { partidaId });
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

    socketInstance.on("erro", (dados: { mensagem: string }) => {
      setErro(dados.mensagem);
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
