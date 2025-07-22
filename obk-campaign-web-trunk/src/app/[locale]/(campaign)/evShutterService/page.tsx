import Image from "next/image";
import HeadCoverBg from "@/assets/head_cover_bg.jpg";
import OneBangkokLogoFullWhite from "@/assets/oneBangkokLogoFullWhite.png";
import dynamic from "next/dynamic";

export default function evShutterServiceHome({
  params: { locale },
}: {
  params: { locale: string };
}) {
  let stage = "";

  function findStage() {
    const now = Date.now();
    console.log({ now });
    const dates = [
      {
        stage: "1",
        timeStart: "2024-09-01T16:00:00+0700",
        timeEnd: "2024-10-20T09:59:59+0700",
      },
      {
        stage: "2",
        timeStart: "2024-10-20T10:00:00+0700",
        timeEnd: "2024-11-01T00:00:00+0700",
      },
    ];

    const result = dates.find(({ stage, timeStart, timeEnd }) => {
      const start = +new Date(timeStart);
      const end = +new Date(timeEnd);
      console.log("find:", stage, start, end);
      return start <= now && end > now;
    });

    stage = result?.stage || "";
  }

  findStage();

  type TermConProps = {
    stage: string;
  };

  const TermsCon = dynamic<TermConProps>(
    () => import("@/components/evShutterService/TermsCon_" + locale)
  );

  return (
    <div className="bg-[#E5E5E5]">
      <div
        className="relative h-[200px] mx-auto max-w-xl w-full bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: `url('${HeadCoverBg.src}')`,
        }}
      >
        <div className="absolute left-0 top-0 w-full h-full flex justify-center p-5">
          <div className="mx-auto mt-5 w-full max-w-[220px]">
            <Image
              src={OneBangkokLogoFullWhite}
              alt="OBK Logo"
              className="h-auto"
              priority
            />
          </div>
        </div>
      </div>

      <div className="p-2">
        <div className="max-w-xl mx-auto bg-white px-5">
          <TermsCon stage={stage} />
        </div>
      </div>
    </div>
  );
}
