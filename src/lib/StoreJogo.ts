import { v4 as uuidv4 } from "uuid";

type Jogo = {
    jogadores: string[];
    dificuldade: string;
};

const jogos = new Map<string, Jogo>();

export function criarJogo(dificuldade: string) {
    const JogoId = uuidv4();
    const jogadores = [uuidv4(), uuidv4()];
    jogos.set(JogoId, { jogadores, dificuldade });
    return { JogoId, jogadores };
}

export function getJogo(JogoId: string) {
    return jogos.get(JogoId);
}
