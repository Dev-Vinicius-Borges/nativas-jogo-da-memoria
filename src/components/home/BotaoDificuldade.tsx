import { useFocoContext } from "@/context/FocoContext";
import Link from "next/link";

interface BotaoDificuldadeProp {
  bg: string;
  label: string;
  link: string;
}

export default function BotaoDificuldade({
  bg,
  label,
  link,
}: BotaoDificuldadeProp) {
  const { setFocar } = useFocoContext();

  return (
    <Link
      href={{ pathname: "/grade", query: { grid: link } }}
      className={`${bg} p-[1rem_2rem] rounded-xl shadow-gray-500 shadow text-2xl text-[var(--background)]`}
      onClick={() => setFocar(true)}
    >
      {label}
    </Link>
  );
}
