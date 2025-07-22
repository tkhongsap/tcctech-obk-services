import Image from "next/image";
import CheckMarkIcon from "@/assets/CheckMark-green.svg";
import WrongIcon from "@/assets/Wrong.svg";

export type ShowDialog = {
  title: string;
  type: string;
  message?: string;
} | null;

export default function UseCouponResultDialog({
  show,
  close = () => {},
}: {
  show: ShowDialog;
  close: Function;
}) {
  function getTextClassName(type: string) {
    switch (type) {
      case "success":
        return "text-[#22973F]";
      case "error":
        return "text-[(244,41,41)]";
      default:
        return "";
    }
  }

  return (
    show && (
      <div className="flex justify-center items-center fixed bg-[#d8d8d8aa] z-10 w-full h-screen text-center">
        <div className="flex justify-between flex-col shadow-md rounded-sm pt-6 p-4 min-h-40 w-full mx-4 max-w-sm bg-white">
          <div className="font-medium mt-2 text-lg">
            {show.type == "success" && (
              <Image
                className="mx-auto"
                src={CheckMarkIcon}
                width={35}
                alt=""
              />
            )}
            {show.type == "error" && (
              <Image className="mx-auto" src={WrongIcon} width={30} alt="" />
            )}
            <div className={getTextClassName(show.type) + " mt-4"}>
              {show.title}
            </div>
          </div>
          <div className="my-2">{show.message}</div>
          <div
            onClick={() => close()}
            className="w-full mt-6 font-medium text-center bg-primary hover:bg-primary/90 text-white px-5 py-3 outline-none rounded cursor-pointer mx-auto"
          >
            OK
          </div>
        </div>
      </div>
    )
  );
}
