import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MIA - CRM Inteligente | Mais organização para o seu negócio",
  description:
    "Sistema completo de gestão empresarial com CRM e secretária inteligente por inteligência artificial para autônomos e empresas.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans selection:bg-[#FFC107] selection:text-black">
        {children}
      </body>
    </html>
  );
}
