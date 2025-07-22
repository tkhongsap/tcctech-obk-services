"use client";

import Image from "next/image";
import ObkLogo from "@/assets/obk-logo.svg";
import { QRCodeSVG } from "qrcode.react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Logo_Mama_Cafe_Black_700 from "@/assets/evShutterService/Logo_Mama_Cafe_Black_700.jpg";
import ActivityPost from "@/services/ActivityPost";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export default function CouponQr({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const searchParams = useSearchParams();
  const [periodStage, setPeriodStage] = useState("");
  const data = searchParams.get("id") || "";
  const initialized = useRef(false);
  const t = useTranslations("EvShutterService.couponQr");
  const TermsCond = dynamic(() => import("./components/TermsCond_" + locale));

  function findStage() {
    const now = Date.now();
    // console.log({ findStage: now });
    const dates = [
      {
        stage: "expried",
        timeStart: "2024-11-09T00:00:00",
        timeEnd: "2099-11-09T00:00:00",
      },
    ];

    const result = dates.find(({ stage, timeStart, timeEnd }) => {
      const start = +new Date(timeStart);
      const end = +new Date(timeEnd);
      return start <= now && end > now;
    });

    setPeriodStage(result?.stage || "");
  }

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      console.log("init");

      findStage();

      ActivityPost({
        name: "coupon_qr",
        data: {
          account_id: data,
        },
      });
    }
  }, []);

  return (
    <div className="h-screen flex-col justify-center pt-16">
      <div className="absolute top-0 w-full flex justify-center p-5 border-t border-b h-16">
        <Image src={ObkLogo} alt="OBK Logo" priority />
      </div>

      <div className="mx-auto max-w-md bg-black mb-5">
        <Image
          className="w-full max-w-xs mx-auto"
          src={Logo_Mama_Cafe_Black_700}
          alt="Mama logo"
        />
      </div>

      {periodStage == "expried" && (
        <div className="mt-5 text-center text-red-600">{t("expiredMsg")}</div>
      )}

      {data && (
        <div className="z-10 mt-3">
          <div className="w-full h-full max-w-[250px] px-5 py-4 mx-auto bg-white">
            <QRCodeSVG style={{ width: "100%", height: "100%" }} value={data} />
          </div>
          <div className="mt-2 px-2 flex gap-2 justify-center flex-wrap">
            <div className="font-medium">Ref:</div>
            <div className="text-gray-700">{data}</div>
          </div>
          <div className="mt-10 px-4 pb-10 max-w-xl mx-auto">
            <div className="text-xl mb-3">Mama.cafe</div>
            <TermsCond />
          </div>
        </div>
      )}
    </div>
  );
}
