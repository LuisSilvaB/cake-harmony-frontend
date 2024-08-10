import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import cx from "@/libs/cx";
import Navbar from "@/Components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cake Harmony",
  description: "Cake Harmony",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={cx(
          "border-1 flex flex-1 justify-center border min-h-screen  bg-gray-100 font-bold text-black",
          inter.className,
        )}
      >
        {children}
      </body>
    </html>
  );
}
