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
    cartas: { id: string; nome?: string; imagemUrl?: string; [key: string]: string | number | undefined }[];
  };
  status: string;
  espectadores: { nome: string; }[];
};