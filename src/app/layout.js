// import { Inter } from "next/font/google";
import { Inter, Kufam, MuseoModerno } from "next/font/google";

import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/NavBar";
import { event } from "@/lib/config";
import { formatDateChileDateOnly } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const kufam = Kufam({
  subsets: ["latin"],
  variable: "--font-kufam",
});
const museo_moderno = MuseoModerno({
  subsets: ["latin"],
  variable: "--font-museo-moderno",
});

export const metadata = {
  title: "TechTon | JsChile",
  description:
    `Recaudaremos fondos que serán entregados a Bomberos de Chile para ayudar a mitigar los efectos causados por los incendios que comenzaron a ocurrir el ${formatDateChileDateOnly(event.initialIncident, { day: "2-digit", month: "2-digit", year: "numeric" })} en la ${event.place}`,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${kufam.variable} ${museo_moderno.variable}`}
    >
      <body
        className={`${inter.className} bg-[#232121] text-white h-[100svh] flex flex-col justify-between`}
      >
        <Navbar />
        <main className="flex flex-1 relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
