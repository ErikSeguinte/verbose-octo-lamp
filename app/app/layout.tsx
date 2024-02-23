import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import PrelineScript from "@/components/PrelineScript";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Verbose Octo Lamp",
  description: "Yet Another Group Scheduling App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const className = `${inter.className}  bg-white`
  return (
    <html lang="en">
      <body className={className}>
        <nav>
          {" "}
          <Navbar />{" "}
        </nav>
        {children}
      </body>
      <PrelineScript />
    </html>
  );
}
