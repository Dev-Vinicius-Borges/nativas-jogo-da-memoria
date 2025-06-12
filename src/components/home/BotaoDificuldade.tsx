import { useModal } from "@/context/ModalContext";
// import Link from "next/link";

interface BotaoDificuldadeProp {
  bg: string;
  label: string;
}

export default function BotaoDificuldade({
  bg,
  label,
}: BotaoDificuldadeProp) {
  // const { setFocar } = useFocoContext();
  const { abrirModal, setAbrirModal } = useModal();

  return (
    // <Link
    //   href={{ pathname: "/grade", query: { grid: link } }}
    //   className={`${bg} p-[1rem_2rem] rounded-xl shadow-gray-500 shadow text-2xl text-[var(--background)]`}
    //   onClick={() => setFocar(true)}
    // >
    //   {label}
    // </Link>^

    <button
      className={`${bg} p-[1rem_2rem] rounded-xl shadow-gray-500 shadow text-2xl text-[var(--background)]`}
      onClick={() => setAbrirModal(!abrirModal)}
    >
      {label}
    </button>
  );
}
