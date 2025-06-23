"use client";

import { useState } from 'react';

interface FormEntradaProps {
  onEntrar: (nome: string) => void;
}

export default function FormEntrada({ onEntrar }: FormEntradaProps) {
  const [nome, setNome] = useState('');
  const [carregando, setCarregando] = useState(false);

  const iniciarJogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim()) {
      setCarregando(true);
      onEntrar(nome.trim());
    }
  };

  return (
    <div className="bg-[#E3CA98] p-8 rounded-lg shadow-lg max-w-md w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#F9F5EA]">Entrar</h2>
      
      <form onSubmit={iniciarJogo} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-[#F9F5EA]">
            Seu nome:
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DCBA7A] focus:border-transparent bg-[#F9F5EA]"
            maxLength={20}
            required
            disabled={carregando}
          />
        </div>

        <button
          type="submit"
          disabled={!nome.trim() || carregando}
          className="w-full py-3 px-4 bg-[#9EBC74] text-white font-medium rounded-lg hover:bg-[#8FAD66] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {carregando ? 'Entrando...' : 'Entrar na Partida'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('espectador', 'true');
            window.location.search = urlParams.toString();
          }}
          className="text-md text-[#F9F5EA] underline"
        >
          Entrar como espectador
        </button>
      </div>
    </div>
  );
}

