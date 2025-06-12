"use client";

import { Modal } from "@/components/Modal";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ModalContextType {
  abrirModal: boolean;
  setAbrirModal: Dispatch<SetStateAction<boolean>>;
  conteudoModal: ReactNode;
  setConteudoModal: Dispatch<SetStateAction<ReactNode>>;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [abrirModal, setAbrirModal] = useState<boolean>(false);
  const [conteudoModal, setConteudoModal] = useState<ReactNode | null>(null);

  return (
    <ModalContext.Provider
      value={{ abrirModal, setAbrirModal, conteudoModal, setConteudoModal }}
    >
      {abrirModal && <Modal conteudo={conteudoModal} />}
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useFocoContext deve ser usado dentro de um FocoProvider");
  }
  return context;
}
