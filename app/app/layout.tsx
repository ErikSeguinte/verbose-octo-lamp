import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/component";
// import PrelineScript from "@/components/PrelineScript";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";

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
          {children}
        </MantineProvider>
      </body>
      {/* <PrelineScript /> */}
    </html>
  );
}
