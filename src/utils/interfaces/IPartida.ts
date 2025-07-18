import IJogador from "./IJogador";

export default interface IPartida {
    id: string;
    jogadores: IJogador[];
    cartasViradas: number[];
    turnoAtual: number;
    configuracao: {
        colunas: number;
        linhas: number;
        cartas: any[];
    };
    status: "aguardando" | "jogando" | "finalizada";
    espectadores: string[];
}