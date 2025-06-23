"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import Link from "next/link";

export default function GerarQrCode() {
  const [urlPartida, setUrlPartida] = useState("");
  const { partida } = useSocket();
  const [jogadoresEntraram, setJogadoresEntraram] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin;

      if (partida && partida?.jogadores.length > 2) {
        setJogadoresEntraram(true);
        setUrlPartida(`${baseUrl}/partida?room=${partida?.id}&espectador=true`);
      } else {
        setJogadoresEntraram(false);
        setUrlPartida(`${baseUrl}/partida?room=${partida?.id}`);
      }
    }
  }, [partida, setJogadoresEntraram]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-xl font-semibold text-center">
        Escaneie o QR Code para entrar na partida
      </h3>

      <Link href={urlPartida}>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          {!jogadoresEntraram ? (
            <QRCodeSVG value={urlPartida} size={200} level="M" />
          ) : (
            <div className="size-full bg-green-600"></div>
          )}
        </div>
      </Link>

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
