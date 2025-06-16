import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

interface ModalProps {
  jogoId: string;
  jogadores: { player1: string; player2: string };
}

interface LinksJogadoresI {
  jogador1: string;
  jogador2: string;
}

export default function ModalJogo({ jogoId, jogadores }: ModalProps) {
  const [urlAtual, setUrlAtual] = useState<string>("");
  const [linksJogadores, setLinksJogadores] = useState<LinksJogadoresI>({
    jogador1: "",
    jogador2: "",
  });

  useEffect(() => {
    setUrlAtual(window.location.href);
    setLinksJogadores({
      jogador1: `${urlAtual}partida?room=${jogoId}&jogador_1&id=${jogadores.player1}`,
      jogador2: `${urlAtual}partida?room=${jogoId}&jogador_2&id=${jogadores.player2}`,
    });
  }, [jogadores.player1, jogadores.player2, jogoId, urlAtual]);

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-center">Partida gerada</h2>
      <div className="w-[calc(420px-3rem)] flex justify-between">
        <div className="flex flex-col items-center ">
          <h3 className="text-lg">Jogador 1</h3>
          <Link href={linksJogadores.jogador1}>
            <QRCodeSVG value={linksJogadores.jogador1} size={128} />
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-lg">Jogador 2</h3>
          <Link href={linksJogadores.jogador2}>
            <QRCodeSVG value={linksJogadores.jogador2} size={128} />
          </Link>
        </div>
      </div>
    </>
  );
}
