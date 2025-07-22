import SplitText from "@/lib/SplitText";
import { Suspense } from "react";
import PartidaClient from "./partidaClient";

export default function PartidaPage() {
  return (
    <Suspense
      fallback={
        <div className="absolute size-full top-0 left-0 flex justify-center items-center">
          {" "}
          <SplitText
            text="Partida não encontrada"
            duration={100}
            className="text-xl"
            textAlign="center"
          />
        </div>
      }
    >
      <PartidaClient />
    </Suspense>
  );
}
