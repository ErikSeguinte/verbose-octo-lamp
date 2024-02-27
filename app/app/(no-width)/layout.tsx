import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "../globals.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

import Navbar from "@/components/navbar/component";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  description: "Yet Another Group Scheduling App",
  title: "Verbose Octo Lamp",
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
            <div className="flex justify-center">{children}</div>{" "}
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
