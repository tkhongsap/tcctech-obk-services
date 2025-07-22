import ThumbsUpLight from "@/assets/ph--thumbs-up-light-white.svg";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Success({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  const t = useTranslations("EvShutterService.survey");

  return (
    <div className="h-screen flex justify-center items-center text-center">
      <div className="flex justify-center items-center flex-col bg-[#1d2d51] text-white px-2 w-full max-w-xs mx-2 py-10 rounded-lg">
        <div className="flex justify-center items-center rounded-full bg-[#394662] shadow-[0px_1px_5px_#171717] w-20 h-20 p-3">
          <Image src={ThumbsUpLight} className="w-full" alt={"thumbs up"} />
        </div>
        <div className="font-medium text-2xl mt-4">{t("successTitle")}</div>
        <div
          className="mt-2"
          dangerouslySetInnerHTML={{ __html: t.raw("successMessage") }}
        />
      </div>
    </div>
  );
}
