import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navb from "@/components/Navb";
import { UserProvider } from "@/context/qwert";
import Filters from "@/components/Filters";
import { Provider } from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ForSystem",
  description: "Forecasting Website",
  icons: "/pics/qc_logo.png", // Update this path if your favicon has a different name or format

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={inter.className}>
        <UserProvider>
          <>{children}</>
        </UserProvider>
      </body>
    </html>
  );
}
