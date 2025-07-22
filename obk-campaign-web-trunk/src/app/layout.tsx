import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });
const myFont = localFont({
  src: [
    {
      path: "../assets/fonts/OB-font/OneBangkok-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/OB-font/OneBangkok-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "One Bangkok",
  description: "One Bangkok",
};

export default async function DefaultLayout({
  children,
  params: {},
}: Readonly<{
  children: React.ReactNode;
  params: {};
}>) {
  return (
    <html lang="en">
      {/* <head>
        <script src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js"></script>
        <Script>
          {`
          
          vConsole = new window.VConsole();
          
          `}</Script>
      </head> */}
      <body className={myFont.className}>{children}</body>
    </html>
  );
}
