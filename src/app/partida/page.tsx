"use client";

import { useSocket } from "@/context/SocketContext";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CardPlanta from "@/components/jogo/CardPlanta";
import FormEntrada from "@/components/partida/FormEntrada";
import Placar from "@/components/partida/Placar";
import { useFocoContext } from "@/context/FocoContext";
import SplitText from "@/lib/SplitText";

export default function PartidaPage() {
  const {
    partida,
    entrarPartida,
    entrarComoEspectador,
    buscarPartida,
    virarCarta,
    erro,
    cartasViradas,
    cartasEncontradas,
  } = useSocket();
  const parametros = useSearchParams();
  const room = parametros?.get("room");
  const [jogadorEntrou, setJogadorEntrou] = useState<boolean>(false);
  const [nomeJogador, setNomeJogador] = useState<string>("");
  const [modoEspectador, setModoEspectador] = useState<boolean>(false);
  const [tentandoConectar, setTentandoConectar] = useState<boolean>(false);
  const { setFocar } = useFocoContext();

  useEffect(() => {
    setFocar(true);
    if (room && !jogadorEntrou) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("espectador")) {
        entrarComoEspectador(room);
        setModoEspectador(true);
        setJogadorEntrou(true);
      } else {
        buscarPartida(room);
      }
    }
  }, [room, jogadorEntrou, entrarComoEspectador, buscarPartida, setFocar]);

  const handleEntrarPartida = (nome: string) => {
    if (room) {
      setNomeJogador(nome);
      setTentandoConectar(true);
      entrarPartida(room, nome);
      setJogadorEntrou(true);
    }
  };

  useEffect(() => {
    if (partida && tentandoConectar) {
      setTentandoConectar(false);
    }
  }, [partida, tentandoConectar]);

  const handleVirarCarta = (indiceCarta: number) => {
    if (!modoEspectador && partida) {
      const jogadorAtual = partida.jogadores[partida.turnoAtual];
      if (
        jogadorAtual &&
        (jogadorAtual.nome === nomeJogador || modoEspectador)
      ) {
        virarCarta(indiceCarta);
      }
    }
  };

  const isCartaVirada = (index: number) => {
    return cartasViradas.includes(index);
  };

  const isCartaEncontrada = (index: number) => {
    return cartasEncontradas.includes(index);
  };

  const isMinhaVez = () => {
    if (!partida || modoEspectador) return false;
    const jogadorAtual = partida.jogadores[partida.turnoAtual];
    return jogadorAtual && jogadorAtual.nome === nomeJogador;
  };

  if (!room) {
    return (
      <SplitText
        text="Partida não encontrada"
        duration={100}
        className="text-xl"
        textAlign="center"
      />
    );
  }

  if (!jogadorEntrou && !modoEspectador) {
    return <FormEntrada onEntrar={handleEntrarPartida} />;
  }

  if (!partida || tentandoConectar) {
    return (
      <section className="text-center max-w-md w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {erro ? (
          <SplitText
            text={erro}
            className="text-2xl font-semibold text-center text-red-400"
            delay={50}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            textAlign="center"
          />
        ) : (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Conectando à partida</p>
          </>
        )}
      </section>
    );
  }

  if (partida.status === "aguardando") {
    return (
      <div className="text-center max-w-md w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <SplitText
          text="Aguardando jogadores"
          className="text-2xl font-semibold text-center"
          delay={100}
          duration={1}
          ease="elastic.out(1,2)"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
        />
        <p>Jogadores conectados: {partida.jogadores.length}/2</p>
      </div>
    );
  }

  const { colunas, linhas } = partida.configuracao;
  const emTelasMenores = (): number => {
    if (colunas > 4) {
      const novasQtdColunas = Math.round(Math.sqrt(colunas * linhas));
      console.log(novasQtdColunas);
      return novasQtdColunas;
    }
    return colunas;
  };

  return (
    <>
      {erro && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-3 rounded-lg z-50">
          {erro}
        </div>
      )}

      <div>
        <Placar
          jogadores={partida.jogadores}
          turnoAtual={partida.turnoAtual}
          modoMobile={true}
        />
      </div>

      <div className="flex lg:justify-center lg:items-center min-h-screen">
        {partida.jogadores[0] && (
          <div className="hidden lg:block lg:fixed lg:left-4 lg:top-1/2 lg:transform lg:-translate-y-1/2">
            <Placar
              jogadores={[partida.jogadores[0]]}
              turnoAtual={partida.turnoAtual}
              modoMobile={false}
              posicao="esquerda"
            />
          </div>
        )}

        <section className="w-full max-w-[100vh] mx-auto">
          <section
            className="max-lg:hidden grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))`,
            }}
          >
            {partida.configuracao.cartas.map((carta, index) => (
              <CardPlanta
                key={index}
                imagem={carta.src.dadoImagem}
                nomePlanta={carta.src.nome}
                valorImagem={index}
                onClick={() => handleVirarCarta(index)}
                virada={isCartaVirada(index)}
                encontrada={isCartaEncontrada(index)}
                desabilitada={
                  modoEspectador || isCartaEncontrada(index) || !isMinhaVez()
                }
              />
            ))}
          </section>
          <section
            className="lg:hidden grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${emTelasMenores}, minmax(0, 1fr))`,
            }}
          >
            {partida.configuracao.cartas.map((carta, index) => (
              <CardPlanta
                key={index}
                imagem={carta.src.dadoImagem}
                nomePlanta={carta.src.nome}
                valorImagem={index}
                onClick={() => handleVirarCarta(index)}
                virada={isCartaVirada(index)}
                encontrada={isCartaEncontrada(index)}
                desabilitada={
                  modoEspectador || isCartaEncontrada(index) || !isMinhaVez()
                }
              />
            ))}
          </section>
        </section>

        {partida.jogadores[1] && (
          <div className="hidden lg:block lg:fixed lg:right-4 lg:top-1/2 lg:transform lg:-translate-y-1/2">
            <Placar
              jogadores={[partida.jogadores[1]]}
              turnoAtual={partida.turnoAtual}
              modoMobile={false}
              posicao="direita"
            />
          </div>
        )}
      </div>

      <div className="fixed bottom-4 left-4 flex space-x-2">
        {modoEspectador && (
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Modo Espectador
          </div>
        )}
      </div>
    </>
  );
}
