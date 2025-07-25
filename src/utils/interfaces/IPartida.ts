import ICarta from "./ICarta";
import IJogador from "./IJogador";
export default interface IPartida {
    id: string;
    jogadores: IJogador[];
    cartasViradas: number[];
    turnoAtual: number;
    configuracao: {
        colunas: number;
        linhas: number;
        cartas: ICarta[];
    };
    status: { execucao: string, bloqueado: boolean };
    espectadores: string[];
}