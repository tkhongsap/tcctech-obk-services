"use client";

import Image from "next/image";
import ObkLogo from "@/assets/obk-logo.svg";
import { QRCodeSVG } from "qrcode.react";
import { useSearchParams } from "next/navigation";

export default function GenQr() {
  const searchParams = useSearchParams();
  const data = searchParams.get("d") || "";

  return (
    <div className="h-screen flex justify-center items-center text-center pt-20">
      <div className="absolute top-0 w-full flex justify-center p-5 border-t border-b">
        <Image src={ObkLogo} alt="OBK Logo" width={140} priority />
      </div>
      <div className="-mt-10 w-full h-full max-w-[250px] px-5 py-4 ">
        {data && (
          <QRCodeSVG style={{ width: "100%", height: "100%" }} value={data} />
        )}
      </div>
    </div>
  );
}
