import { useModal } from "@/context/ModalContext";
import { criarJogo } from "@/lib/StoreJogo";
import { useState } from "react";
import ModalJogo from "../modal/ModalJogo";

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
  const [carregando, setCarregando] = useState<boolean>(false);

  async function eventoClick() {
    setCarregando(true);
    const jogo = criarJogo(dificuldade);

    setCarregando(false);
    setConteudoModal(<ModalJogo {...jogo} />);
    setAbrirModal(true);
  }

  return (
    <button
      className={`${bg} p-[1rem_2rem] rounded-xl shadow-gray-500 shadow text-2xl text-[var(--background)]`}
      onClick={eventoClick}
    >
      {!carregando ? label : "Carregando..."}
    </button>
  );
}
