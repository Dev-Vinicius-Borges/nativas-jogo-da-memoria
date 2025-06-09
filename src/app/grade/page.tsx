"use client";

import imagens from "@/assets/imagens/cards/cards";
import SplitText from "@/lib/SplitText";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const parametros = useSearchParams();
  const grade = parametros.get("grid");

  let colunas: number | null = null;
  let linhas: number | null = null;

  if (grade) {
    const partes = grade.split("x");
    if (partes.length === 2) {
      colunas = Number(partes[0]);
      linhas = Number(partes[1]);
    }
  }

  if (!grade || !colunas || !linhas || isNaN(colunas) || isNaN(linhas)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SplitText
          text="Nenhuma grade"
          className="text-4xl font-semibold"
          delay={50}
          duration={2}
          ease="elastic.out(1, 0.3)"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
      </div>
    );
  }

  const celulasTotais = colunas * linhas;
  const celulas = Array.from({ length: celulasTotais }, (_, index) => index);
  const qtdImagens = celulasTotais / 2;
  const paresImagens = imagens.slice(0, qtdImagens).flatMap((img, index) => [
    { id: index, src: img },
    { id: index, src: img },
  ]);

  const posicoesDisponiveisAleatórias = [...celulas];

  for (let i = celulas.length - 1; i > 0; i--) {
    const novaPosicao = Math.floor(Math.random() * (i + 1));
    [
      posicoesDisponiveisAleatórias[i],
      posicoesDisponiveisAleatórias[novaPosicao],
    ] = [
      posicoesDisponiveisAleatórias[novaPosicao],
      posicoesDisponiveisAleatórias[i],
    ];
  }

  const cardsEmparalhados = [...paresImagens];

  for (let i = paresImagens.length - 1; i > 0; i--) {
    const novaPosicao = Math.floor(Math.random() * (i + 1));

    [cardsEmparalhados[i], cardsEmparalhados[novaPosicao]] = [
      cardsEmparalhados[novaPosicao],
      cardsEmparalhados[i],
    ];
  }

  const novaListaDeCards = [];
  for (let i = 0; i < posicoesDisponiveisAleatórias.length; i++) {
    novaListaDeCards[i] = cardsEmparalhados[i];
  }

  return (
    <section
      className={`w-full max-w-[100vh] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4`}
    >
      <section
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))`,
        }}
      >
        {novaListaDeCards.map((item, index) => (
          <div
            key={index}
            className="aspect-square flex items-center justify-center"
          >
            <Image src={item.src} alt={`Card ${index}`}/>
          </div>
        ))}
      </section>
    </section>
  );
}
