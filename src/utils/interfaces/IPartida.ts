import ICarta from "./ICarta";
import IJogador from "./IJogador";
export default interface IPartida {
    id: string;
    jogadores: IJogador[];
    cartasViradas: number[];
    cartasEncontradas: number[];
    turnoAtual: number;
    configuracao: {
        colunas: number;
        linhas: number;
        cartas: ICarta[];
    };
    status: { execucao: string, bloqueado: boolean };
    espectadores: { nome: string }[];
    reservas?: string[];
}