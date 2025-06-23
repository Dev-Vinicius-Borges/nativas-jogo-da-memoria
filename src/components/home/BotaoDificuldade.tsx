"use client";

import { useState } from "react";
import imagens from "@/assets/imagens/cards/cards";
import { useSocket } from "@/context/SocketContext";
import { useModal } from "@/context/ModalContext";
import GerarQrCode from "../partida/GerarQrCode";

interface BotaoDificuldadeProp {
  bg: string;
  label: string;
  dificuldade: string;
}

export default function BotaoDificuldade({
  bg,
  label,
  dificuldade,
}: BotaoDificuldadeProp) {
  const { setAbrirModal, setConteudoModal } = useModal();
  const { criarPartida } = useSocket();
  const [carregando, setCarregando] = useState<boolean>(false);

  async function eventoClick() {
    setCarregando(true);
    let grade: string;
    if (dificuldade === "fácil") {
      grade = "4x4";
    } else if (dificuldade === "normal") {
      grade = "5x4";
    } else if (dificuldade === "difícil") {
      grade = "6x5";
    } else {
      grade = "4x4";
    }

    const [colunas, linhas] = grade.split("x").map(Number);
    const celulasTotais = colunas * linhas;
    const qtdImagens = celulasTotais / 2;

    const imagensDisponiveis = [...imagens];
    for (let i = imagensDisponiveis.length - 1; i > 0; i--) {
      const valorAleatorio = Math.floor(Math.random() * (i + 1));
      [imagensDisponiveis[i], imagensDisponiveis[valorAleatorio]] = [
        imagensDisponiveis[valorAleatorio],
        imagensDisponiveis[i],
      ];
    }

    const imagensSelecionadas = imagensDisponiveis.slice(0, qtdImagens);
    const paresImagens = imagensSelecionadas.flatMap((img, index) => [
      { id: index, src: img },
      { id: index, src: img },
    ]);

    const cartasEmbaralhadas = [...paresImagens];
    for (let i = cartasEmbaralhadas.length - 1; i > 0; i--) {
      const valorAleatorio = Math.floor(Math.random() * (i + 1));
      [cartasEmbaralhadas[i], cartasEmbaralhadas[valorAleatorio]] = [
        cartasEmbaralhadas[valorAleatorio],
        cartasEmbaralhadas[i],
      ];
    }

    criarPartida(colunas, linhas, cartasEmbaralhadas);
    setConteudoModal(<GerarQrCode/>)
    setAbrirModal(true);
    setCarregando(false);
  }

  return (
    <button
      className={`${bg} p-4 rounded-xl shadow text-2xl text-white transition-transform hover:scale-105 active:scale-95`}
      onClick={eventoClick}
      disabled={carregando}
    >
      {!carregando ? label : "Carregando..."}
    </button>
  );
}
