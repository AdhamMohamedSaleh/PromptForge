import { Inter } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import Nav from "@/components/Nav";
import Provider from "@/components/Provider";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "PromptForge",
  description: "A prompt engineering tool for AI models.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Provider>
          <div className="main">
            <div className="gradient" />
          </div>

          <main className="app">
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
