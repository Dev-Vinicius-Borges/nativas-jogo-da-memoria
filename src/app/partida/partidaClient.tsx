"use client";

import { useSocket } from "@/context/SocketContext";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CardPlanta from "@/components/jogo/CardPlanta";
import FormEntrada from "@/components/partida/FormEntrada";
import Placar from "@/components/partida/Placar";
import { useFocoContext } from "@/context/FocoContext";
import SplitText from "@/lib/SplitText";
import { useModal } from "@/context/ModalContext";
import EfeitoFolhas from "@/components/jogo/efeito_folhas";
import Link from "next/link";
import BlurText from "@/lib/BlurText";

export default function PartidaClient() {
  const {
    partida,
    entrarPartida,
    buscarPartida,
    virarCarta,
    erro,
    cartasViradas,
    cartasEncontradas,
    fimPartida,
  } = useSocket();

  const parametros = useSearchParams();
  const sala = parametros?.get("sala");
  const modoEspectador = parametros?.has("espectador");

  const [jogadorEntrou, setJogadorEntrou] = useState<boolean>(false);
  const [nomeJogador, setNomeJogador] = useState<string>("");
  const [grade, setGrade] = useState<React.ReactNode | null>(null);

  const { setFocar } = useFocoContext();
  const { setAbrirModal, setConteudoModal } = useModal();

  useEffect(() => {
    setFocar(true);
    setAbrirModal(false);
    setConteudoModal(null);

    if (sala && !jogadorEntrou) {
      if (modoEspectador) {
        setJogadorEntrou(true);
      } else {
        buscarPartida(sala);
      }
    }
  }, [
    sala,
    jogadorEntrou,
    modoEspectador,
    buscarPartida,
    setFocar,
    setAbrirModal,
    setConteudoModal,
  ]);

  const handleEntrarPartida = (nome: string) => {
    if (sala) {
      setNomeJogador(nome);
      entrarPartida(sala, nome);
      setJogadorEntrou(true);
    }
  };

  useEffect(() => {
    const handleVirarCarta = (indice: number) => {
      if (!modoEspectador && partida) {
        const jogadorAtual = partida.jogadores[partida.turnoAtual];
        if (jogadorAtual?.nome === nomeJogador) {
          virarCarta(indice);
        }
      }
    };

    const isMinhaVez = () => {
      if (!partida || modoEspectador) return false;
      const jogadorAtual = partida.jogadores[partida.turnoAtual];
      return jogadorAtual?.nome === nomeJogador;
    };

    if (!partida) return;

    const atualizarGrade = () => {
      const larguraTela = window.innerWidth;
      const colunasOriginais = partida.configuracao.colunas;
      let colunas = colunasOriginais;

      if (larguraTela <= 1024) {
        colunas = Math.min(colunasOriginais, 5);
      }
      

      setGrade(
        <section
          className="grid gap-2"
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
              virada={cartasViradas.includes(index)}
              encontrada={cartasEncontradas.includes(index)}
              desabilitada={
                modoEspectador ||
                cartasEncontradas.includes(index) ||
                !isMinhaVez()
              }
            />
          ))}
        </section>
      );
    };

    atualizarGrade();

    window.addEventListener("resize", atualizarGrade);
    return () => window.removeEventListener("resize", atualizarGrade);
  }, [partida, cartasViradas, cartasEncontradas, modoEspectador, nomeJogador, virarCarta  ]);

  if (!sala) {
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

  if (!partida) {
    return (
      <section className="text-center max-w-md w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <SplitText
          text="Partida não encontrada..."
          className="text-2xl font-semibold text-red-400"
          delay={50}
          duration={0.6}
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
        />
      </section>
    );
  }

  if (partida.status === "aguardando") {
    return (
      <div className="text-center max-w-md w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <SplitText
          text="Aguardando jogadores"
          className="text-2xl font-semibold"
          delay={100}
          duration={1}
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
        />
        <p>Jogadores conectados: {partida.jogadores.length}/2</p>
      </div>
    );
  }

  return (
    <>
      {erro && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-3 rounded-lg z-50">
          {erro}
        </div>
      )}

      {fimPartida.status && (
        <section className="absolute top-0 left-0 size-full bg-white/75 z-[100]">
          <EfeitoFolhas />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full text-center flex flex-col items-center gap-4 px-8 py-2">
            <div className="p-10 max-w-[300px] aspect-square bg-[#D4A95B] shadow-xl rounded-full flex justify-center items-center animate-bounce">
              <BlurText
                text={fimPartida.ganhador!}
                delay={100}
                animateBy="letters"
                direction="bottom"
                className="text-[2rem] font-bold mb-4 text-white pt-5"
              />
            </div>
            <BlurText
              text="Parabéns"
              delay={150}
              animateBy="letters"
              direction="bottom"
              className="text-[3rem] font-bold mb-4"
            />
            <Link
              href="/"
              className="bg-orange-400 text-2xl text-white px-4 py-2 rounded-lg shadow-md"
            >
              Voltar
            </Link>
          </div>
        </section>
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

        <section className="w-full max-w-[100vh] mx-auto">{grade}</section>

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

      {modoEspectador && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg">
          Modo Espectador
        </div>
      )}
    </>
  );
}
