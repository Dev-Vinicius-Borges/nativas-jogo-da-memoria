"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GerarQrCode() {
  const [urlPartida, setUrlPartida] = useState("");
  const { partida } = useSocket();
  const [jogadoresEntraram, setJogadoresEntraram] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin;

      if (partida && partida?.jogadores.length === 2) {
        setJogadoresEntraram(true);
        router.push(`${baseUrl}/partida?sala=${partida.id}&espectador=true`);
      } else {
        setJogadoresEntraram(false);
        setUrlPartida(`${baseUrl}/partida?sala=${partida?.id}`);
      }
    }
  }, [partida, setJogadoresEntraram, router]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-xl font-semibold text-center">
        Escaneie o QR Code para entrar na partida
      </h3>

      {partida && partida?.jogadores.length < 2 ? (
        <Link href={urlPartida}>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            {!jogadoresEntraram ? (
              <QRCodeSVG value={urlPartida} size={200} level="M" />
            ) : (
              <div className="size-full bg-green-600"></div>
            )}
          </div>
        </Link>
      ) : (
        <h1>Todos os jogadores já entraram...</h1>
      )}

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Aguardando jogadores... ({partida?.jogadores.length || 0}/2)
        </p>
        {partida?.jogadores.map((jogador, index) => (
          <p key={index} className="text-green-600 font-medium">
            {jogador.nome} entrou na partida
          </p>
        ))}
      </div>
    </div>
  );
}
