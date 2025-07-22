import CrossCircle from "@/assets/system-uicons--cross-circle-white.svg";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Fail({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  const t = useTranslations("EvShutterService.survey");

  return (
    <div className="h-screen flex justify-center items-center text-center">
      <div className="flex justify-center items-center flex-col bg-[#757575] text-white px-2 w-full max-w-xs mx-2 py-10 rounded-lg">
        <div className="flex justify-center items-center rounded-full bg-[#5a5c60] shadow-[0px_1px_5px_#171717] w-20 h-20 p-1">
          <Image src={CrossCircle} className="w-full" alt={"thumbs up"} />
        </div>
        <div className="font-medium text-2xl mt-4">{t("failTitle")}</div>
        <div
          className="mt-2"
          dangerouslySetInnerHTML={{ __html: t.raw("failMessage") }}
        />
      </div>
    </div>
  );
}
