import { v4 as uuidv4 } from "uuid";

type Jogo = {
  host: string;
  jogadores: {
    player1: string;
    player2: string;
  };
  dificuldade: string;
  estado: "aguardando" | "andamento" | "finalizado";
  createdAt: Date;
};

const jogos = new Map<string, Jogo>();

export function criarJogo(dificuldade: string): { jogoId: string; jogadores: { player1: string; player2: string; } } {
  const jogoId = uuidv4();
  const host = uuidv4();
  const jogadores = {
    player1: uuidv4(),
    player2: uuidv4(),
  };

  const novoJogo: Jogo = {
    host,
    jogadores,
    dificuldade,
    estado: "aguardando",
    createdAt: new Date(),
  };

  jogos.set(jogoId, novoJogo);
  return { jogoId, jogadores };
}

export function getJogo(jogoId: string): Jogo | undefined {
  return jogos.get(jogoId);
}

export function atualizarJogo(jogoId: string, updates: Partial<Jogo>): boolean {
  const jogoExistente = jogos.get(jogoId);
  if (!jogoExistente) return false;

  const jogoAtualizado = { ...jogoExistente, ...updates };
  jogos.set(jogoId, jogoAtualizado);
  return true;
}
