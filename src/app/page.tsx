"use client";

import DificuldadeSlider from "@/components/home/DificuldadeSlider";
import { useFocoContext } from "@/context/FocoContext";
import BlurText from "@/lib/BlurText";
import { useEffect } from "react";

export default function Home() {
  const {setFocar} = useFocoContext();

  useEffect(()=>{
    setFocar(false);
  },[setFocar])
  return (
    <>
      <section className="m-auto [&]:text-center flex flex-col items-center mt-8">
        <BlurText
          text="Seja bem-vindo ao jogo da memória do"
          delay={100}
          animateBy="words"
          direction="bottom"
          className="text-2xl mb-4 mt-8"
        />
        <BlurText
          text="Nativas"
          delay={150}
          animateBy="letters"
          direction="bottom"
          className="text-[100px] mb-4"
        />
      </section>

      <section className="w-[500px] m-auto flex flex-col items-center">
        <label htmlFor="dificuldade" className="text-center">
          <BlurText
          text="Escolha a dificuldade"
          delay={100}
          animateBy="words"
          direction="bottom"
          className="text-2xl"
        />
        </label>
        <DificuldadeSlider />
      </section>
    </>
  );
}
