"use client";

interface Jogador {
  id: string;
  nome: string;
  pontuacao: number;
  conectado: boolean;
}

interface PlacarProps {
  jogadores: Jogador[];
  turnoAtual: number;
  modoMobile: boolean;
  posicao?: "esquerda" | "direita";
}

export default function Placar({
  jogadores,
  turnoAtual,
  modoMobile,
  posicao,
}: PlacarProps) {
  if (modoMobile) {
    return (
      <div className="lg:hidden">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {jogadores.map((jogador, index) => (
            <div
              key={jogador.id}
              className={`flex flex-col items-center p-3 rounded-lg transition-all text-center`}
            >
              <div className="flex flex-col items-center space-x-2 mb-2">
                <h3 className="text-lg font-bold text-gray-800">
                  Jogador {index + 1}
                </h3>
                <p className="text-md text-gray-500">{jogador.nome}</p>
              </div>
              <div
                className={`${
                  turnoAtual === index ? "bg-[#D4A95B]" : "bg-[#F1D6A4]"
                } text-white rounded-full p-4 transition-colors duration-500 aspect-square shadow-lg`}
              >
                <div className="text-3xl font-bold">{jogador.pontuacao}</div>
                <div className="text-sm opacity-90">
                  {jogador.pontuacao === 1 ? "ponto" : "pontos"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const jogador = jogadores[0];
  if (!jogador) return null;

  const isJogadorAtual = turnoAtual === (posicao === "esquerda" ? 0 : 1);

  return (
    <div>
      <div className={`p-6`}>
        <div className="text-center space-y-4">
          <div className={`${!isJogadorAtual ? 'opacity-40' : ''}`}>
            <h3 className="text-lg font-bold text-gray-800">
              Jogador {posicao === "esquerda" ? "1" : "2"}
            </h3>
            <p className="text-md text-gray-500">{jogador.nome}</p>
          </div>

          <div
            className={`${
              isJogadorAtual ? "bg-[#D4A95B]" : "bg-[#F1D6A4]"
            } text-white rounded-full p-4 transition-colors duration-500 shadow-lg`}
          >
            <h3 className="text-3xl font-bold">{jogador.pontuacao}</h3>
            <p className="text-sm opacity-90">
              {jogador.pontuacao === 1 ? "ponto" : "pontos"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
