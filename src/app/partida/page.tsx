"use client";

import { useSearchParams } from "next/navigation";

export default function PartidaPage(){
    const parametros = useSearchParams();
    const room = parametros.get("room");
    const idJogador = parametros.get("id");

    return(
        <>
            <h1>{parametros}</h1>
            <h1>{room}</h1>
            <h1>{idJogador}</h1>
        </>
    );
}