import { cn } from "@/lib/CardFlip";
import Image, { StaticImageData } from "next/image";
import logo from "@/assets/imagens/logo_nativas.webp"

interface CardPlantaProps {
  imagem: StaticImageData | string;
  valorImagem: number;
  nomePlanta: string;
  onClick?: () => void;
  virada?: boolean;
  encontrada?: boolean;
  desabilitada?: boolean;
}

export default function CardPlanta({
  imagem,
  nomePlanta,
  onClick,
  virada = false,
  encontrada = false,
  desabilitada = false,
}: CardPlantaProps) {
  const handleClick = () => {
    if (!desabilitada && !encontrada && onClick) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={desabilitada || encontrada}
      className={cn(
        "outline-none perspective-[100rem] transition-opacity",
        (desabilitada || encontrada) && "cursor-not-allowed",
        encontrada && "opacity-75"
      )}
    >
      <div
        className={cn(
          "relative aspect-square flex items-center justify-center transition duration-500 transform-3d rounded-lg select-none",
          virada && "transform-[rotateY(180deg)]",
          encontrada && "transform-[rotateY(180deg)]"
        )}
      >
        <div className="absolute inset-0 w-full h-full backface-hidden flex items-center justify-center rounded-lg text-white text-3xl font-bold shadow-xl shadow-gray-600">
          <div className="text-center">
            <Image src={logo} alt="Logo Nativas" className="rounded-lg"/>
          </div>
        </div>

        <div className="size-full backface-hidden transform-[rotateY(180deg)] flex items-center justify-center rounded-lg bg-white shadow-xl shadow-gray-600">
          <div className="relative w-full h-full">
            <Image
              src={imagem}
              alt={`Card ${nomePlanta}`}
              className="rounded-lg object-cover"
              fill
              draggable={false}
            />
          <p className="absolute bottom-0 w-full text-center max-lg:text-[10px] text-white bg-gray-700/25 p-2 rounded-b-lg">{nomePlanta}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

