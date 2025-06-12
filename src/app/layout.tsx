import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FocoProvider } from "@/context/FocoContext";
import FundoFolhas from "@/components/fundo-folhas/fundo-folhas";
import { ModalProvider } from "@/context/ModalContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nativas - Jogo da memória",
  description: "Jogo da memória feito para o Nativas!",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModalProvider>
      <FocoProvider>
        <html lang="pt-br">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
            <FundoFolhas />
          </body>
        </html>
      </FocoProvider>
    </ModalProvider>
  );
}
