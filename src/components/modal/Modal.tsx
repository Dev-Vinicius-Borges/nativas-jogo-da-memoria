import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect } from "react";
import * as Ariakit from "@ariakit/react";
import { useModal } from "@/context/ModalContext";

interface ModalProps {
  conteudo: ReactNode;
}

export function Modal({ conteudo }: ModalProps): ReactNode {
  const {setAbrirModal, setConteudoModal} = useModal();
  const dialog = Ariakit.useDialogStore();

  useEffect(() => dialog.show(), [dialog]);
  const mounted = Ariakit.useStoreState(dialog, "mounted");

  return (
    <AnimatePresence>
      {mounted && (
        <Ariakit.Dialog
          store={dialog}
          alwaysVisible
          onClose={() => {
            setAbrirModal(false);
            setConteudoModal(null);
            dialog.hide();
          }}
          className="fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-1.5rem)] overflow-auto rounded-xl bg-white p-4 text-black shadow-black items-start flex-col shadow-xl sm:max-h-[80vh] sm:w-[420px] sm:rounded-2xl sm:p-6"
          backdrop={
            <motion.div
              className="bg-black/[0.1] backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          }
          render={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            />
          }
        >
          <span>{conteudo}</span>
        </Ariakit.Dialog>
      )}
    </AnimatePresence>
  );
}
