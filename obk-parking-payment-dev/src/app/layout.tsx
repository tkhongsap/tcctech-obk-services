import type { Metadata } from "next";
// import { Inter, Noto_Sans_Thai } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

// Font files can be colocated inside of `app`
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

// const inter = Inter({ subsets: ["latin"] });
// const NotoSansThai = Noto_Sans_Thai({
//   subsets: ["latin", "thai"],
//   weight: ["400", "500", "600"],
// });

export const metadata: Metadata = {
  title: "One Bangkok",
  description: "One Bangkok Parking Payment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={myFont.className}>{children}</body>
    </html>
  );
}
