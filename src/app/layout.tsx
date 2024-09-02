import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import cx from "@/libs/cx";
import AuthContextProvider from "@/context/auth-context";
import ReduxProvider from "@/redux/redux.provider";
import { ViewTransitions } from 'next-view-transitions'
import { Toaster } from "@/components/ui/toaster"
import 'remixicon/fonts/remixicon.css';


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
    <ViewTransitions>
      <html lang="es">
        <body
          suppressHydrationWarning={true}
          className={cx(
            "flex min-h-screen flex-1 justify-center bg-gray-100 font-bold text-black",
            inter.className,
          )}
        >
          <ReduxProvider>
            <AuthContextProvider>{children}</AuthContextProvider>
          </ReduxProvider>
          <Toaster />
        </body>
      </html>
    </ViewTransitions>
  );
}
