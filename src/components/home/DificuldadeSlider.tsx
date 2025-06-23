import {
  ChangeEvent,
  ReactNode,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import BotaoDificuldade from "./BotaoDificuldade";

interface EstadosSlider {
  label: string;
  descricao: ReactNode;
}

const estadosSlider: Record<number, EstadosSlider> = {
  1: {
    label: "Fácil",
    descricao: (
      <BotaoDificuldade label="Fácil" bg="bg-green-500" dificuldade="fácil" />
    ),
  },
  2: {
    label: "Normal",
    descricao: (
      <BotaoDificuldade
        label="Normal"
        bg="bg-yellow-500"
        dificuldade="normal"
      />
    ),
  },
  3: {
    label: "Difícil",
    descricao: (
      <BotaoDificuldade label="Difícil" bg="bg-red-600" dificuldade="difícil" />
    ),
  },
};

export default function DificuldadeSlider() {
  const defaultPositions = useMemo<Record<number, number>>(
    () => ({ 1: 0, 2: 50, 3: 100 }),
    []
  );

  const [value, setValue] = useState<number>(2);
  const [position, setPosition] = useState<number>(defaultPositions[value]);
  const [dragging, setDragging] = useState<boolean>(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  const eventoHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(e.target.value, 10);
    setValue(newValue);
    setPosition(defaultPositions[newValue]);
  };

  let thumbBorderColor = "";
  if (value === 1) thumbBorderColor = "border-green-500";
  else if (value === 2) thumbBorderColor = "border-yellow-500";
  else if (value === 3) thumbBorderColor = "border-red-600";

  const handleDrag = useCallback((e: MouseEvent) => {
    if (!sliderRef.current) return;
    const { left, width } = sliderRef.current.getBoundingClientRect();
    let offsetX = e.clientX - left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > width) offsetX = width;
    const newPos = (offsetX / width) * 100;
    setPosition(newPos);
  }, []);

  const handleDragEnd = useCallback(() => {
    
    let newValue = 2;
    if (position < 25) {
      newValue = 1;
    } else if (position < 75) {
      newValue = 2;
    } else {
      newValue = 3;
    }
    setValue(newValue);
    setPosition(defaultPositions[newValue]);
    setDragging(false);
    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", handleDragEnd);
  }, [position, defaultPositions, handleDrag]);

  const handleDragStart = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setDragging(true);
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", handleDragEnd);
  };

  const currentState: EstadosSlider = estadosSlider[value];

  return (
    <div ref={sliderRef} className="relative my-8 max-lg:w-[50%] w-full">
      <input
        type="range"
        id="dificuldade"
        name="dificuldade"
        min={1}
        max={3}
        step={1}
        value={value}
        onChange={eventoHandler}
        className="w-full appearance-none rounded-full h-[20px]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #4bc67d 0%, #f1c40f 50%, #b94a48 100%)",
        }}
      />

      <div
        className="absolute top-[-10px] transform -translate-x-1/2"
        style={{ left: `${position}%` }}
      >
        <span
          onMouseDown={handleDragStart}
          className={`w-20 h-10 flex items-center justify-center border-4 ${thumbBorderColor} rounded-full bg-[var(--background)] text-sm ${
            !dragging ? "transition-all duration-500" : ""
          } cursor-grab select-none`}
        >
          {currentState.label}
        </span>
      </div>

      <div className="mt-10 text-center text-sm text-gray-500">
        {currentState.descricao}
      </div>
    </div>
  );
}
