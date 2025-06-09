"use client"

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface FocoContextType {
  focar: boolean;
  setFocar: Dispatch<SetStateAction<boolean>>;
}

export const FocoContext = createContext<FocoContextType | null>(null);

export function FocoProvider({ children }: { children: ReactNode }) {
  const [focar, setFocar] = useState<boolean>(false);

  return (
    <FocoContext.Provider value={{ focar, setFocar }}>
      {children}
    </FocoContext.Provider>
  );
}

export function useFocoContext() {
  const context = useContext(FocoContext);
  if (!context) {
    throw new Error("useFocoContext deve ser usado dentro de um FocoProvider");
  }
  return context;
}