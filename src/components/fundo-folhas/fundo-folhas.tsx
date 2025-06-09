"use client";

import { useFocoContext } from "@/context/FocoContext";
import GrupoFolhas from "./grupo-folhas";


export default function FundoFolhas() {
  const {focar} = useFocoContext();

  return (
    <section className="w-full h-screen absolute bottom-0 overflow-hidden -z-10">
      <GrupoFolhas inverter={false} focar={focar}/>
      <GrupoFolhas inverter={true} focar={focar}/>
    </section>
  );
}
