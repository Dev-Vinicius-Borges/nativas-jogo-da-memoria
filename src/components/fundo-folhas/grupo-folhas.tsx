import {
  folha_1,
  folha_2,
  folha_3,
  folha_4,
  folha_5,
} from "@/assets/imagens/fundo/grupo";
import Image from "next/image";
import { useEffect } from "react";

interface GrupoFolhasProp {
  inverter: boolean;
  focar: boolean;
};

export default function GrupoFolhas({ inverter, focar }: GrupoFolhasProp) {
  useEffect(()=>{
    document.querySelectorAll(".vento").forEach((elemento) =>{
       (elemento as HTMLElement).style.animationDelay = `${Math.floor(Math.random() * (3000 - 100 + 1) + 100)}ms`
    });
  },[])

  return (
    <section
      className={`${
        inverter ? "rotate-y-180" : ""
      } [&>div]:transition-all [&>div]:duration-500`}
    >
      <div
        className={`absolute ${
          inverter
            ? "top-[300px] left-[-150px] 3xl:top-[500px] max-lg:top-[500px]"
            : "left-[-150px] bottom-[-300px]"
        } z-[1] transform origin-center ${
          focar ? "scale-[0.7] translate-x-[-10%] 3xl:translate-x-[-20%] max-lg:translate-x-[-20%]" : ""
        }`}
      >
        <Image
          draggable={false}
          className={`w-[700px] drop-shadow-[45px_15px_0px_rgba(0,0,0,0.35)] vento`}
          alt="folha 1"
          src={folha_1}
          priority={true}
        />
      </div>
      <div
        className={`absolute ${
          inverter
            ? "left-[-200px] top-[300px] 3xl:top-[550px] max-lg:top-[550px]"
            : "left-[-200px] bottom-[-150px]"
        }  transform origin-center ${
          focar ? "scale-[0.7] translate-x-[-10%] translate-y-[10%]" : ""
        }`}
      >
        <Image
          draggable={false}
          className={`w-[500px] drop-shadow-[45px_15px_0px_rgba(0,0,0,0.35)] vento`}
          alt="folha 2"
          src={folha_2}
        />
      </div>
      <div
        className={`absolute ${
          inverter ? "left-[-250px] top-[200px] 3xl:top-[400px] max-lg:top-[400px]" : "left-[-250px] bottom-0"
        } transform origin-center ${
          focar ? "scale-[0.7] translate-x-[-5%] translate-y-[20%]" : ""
        }`}
      >
        <Image
          draggable={false}
          className={`w-[500px] drop-shadow-[45px_15px_0px_rgba(0,0,0,0.35)] vento`}
          alt="folha 3"
          src={folha_3}
        />
      </div>
      <div
        className={`absolute ${
          inverter ? "left-[5px] top-[350px] 3xl:top-[600px] max-lg:top-[600px]" : "left-[10px] bottom-[-200px]"
        } ${focar ? "scale-[0.7] translate-x-[-5%] translate-y-[20%]" : ""}`}
      >
        <Image
          draggable={false}
          className={`w-[500px] drop-shadow-[45px_15px_0px_rgba(0,0,0,0.35)] vento`}
          alt="folha 4"
          src={folha_4}
        />
      </div>
      <div
        className={`absolute ${
          inverter ? "top-[500px] left-[100px] 3xl:top-[700px] max-lg:top-[700px]" : "bottom-[-270px] left-[100px]"
        } ${focar ? "scale-[0.7] translate-x-[-40%] translate-y-[-20%]" : ""}`}
      >
        <Image
          draggable={false}
          className={`w-[500px] drop-shadow-[45px_15px_0px_rgba(0,0,0,0.35)] vento`}
          alt="folha 5"
          src={folha_5}
        />
      </div>
    </section>
  );
}
