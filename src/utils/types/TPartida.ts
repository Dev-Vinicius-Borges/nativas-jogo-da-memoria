import { TJogador } from "./TJogador";

export type TPartida = {
  id: string;
  jogadores: TJogador[];
  cartasViradas: number[];
  cartasEncontradas: number[];
  turnoAtual: number;
  configuracao: {
    colunas: number;
    linhas: number;
    cartas: { id: string; [key: string]: any }[];
  };
  status: string;
  espectadores: string[];
};