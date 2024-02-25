import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Navbar from "@/components/navbar/component";
import React from "react";

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
  const className = `${inter.className}  bg-white`;
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={className}>
        <MantineProvider>
          <nav>
            {" "}
            <Navbar />{" "}
          </nav>
          <div className="flex w-auto justify-center">
            <div className="flex justify-center max-w-prose">{children}</div>{" "}
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
