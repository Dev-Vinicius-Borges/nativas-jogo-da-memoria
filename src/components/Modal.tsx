import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect } from "react";
import * as Ariakit from "@ariakit/react";

interface ModalProps {
  titulo: string;
  texto?: string;
  conteudo: ReactNode;
}

export function Modal({ titulo, texto, conteudo }: ModalProps): ReactNode {
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
            dialog.hide();
          }}
          className="fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-1.5rem)] flex-col gap-4 overflow-auto rounded-xl bg-white p-4 text-black shadow-2xl shadow-black items-start"
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
          <Ariakit.DialogHeading className="m-0 text-xl font-bold w-full">
            <h1 className="text-center">{titulo}</h1>
            <p className="text-center">Lorem ipsum dolor sit amet.</p>
          </Ariakit.DialogHeading>
          <div>{conteudo}</div>
        </Ariakit.Dialog>
      )}
    </AnimatePresence>
  );
}
