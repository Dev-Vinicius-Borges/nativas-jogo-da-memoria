"use client";

import DificuldadeSlider from "@/components/home/DificuldadeSlider";
import EfeitoFolhas from "@/components/jogo/efeito_folhas";
import { useFocoContext } from "@/context/FocoContext";
import { useSocket } from "@/context/SocketContext";
import BlurText from "@/lib/BlurText";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const { setFocar } = useFocoContext();
  const { conectado } = useSocket();

  useEffect(() => {
    setFocar(false);
  }, [setFocar]);
  return (
    <>
      <section className="m-auto [&]:text-center flex flex-col items-center mt-8">
        <BlurText
          text="Seja bem-vindo ao jogo da memória do"
          delay={100}
          animateBy="words"
          direction="bottom"
          className="text-2xl mb-4 mt-8 max-lg:text-xl"
        />
        <BlurText
          text="Nativas"
          delay={150}
          animateBy="letters"
          direction="bottom"
          className="text-[100px] mb-4"
        />
      </section>

      <section className="w-[500px] m-auto flex flex-col items-center max-lg:w-full">
        <label htmlFor="dificuldade" className="text-center">
          <BlurText
            text="Escolha a dificuldade"
            delay={100}
            animateBy="words"
            direction="bottom"
            className="text-2xl"
          />
        </label>
        {conectado ? <DificuldadeSlider /> : "Aguarde..."}
      </section>
    </>
  );
}
