import ArrowRightIcon from "@/assets/ArrowRight-white.svg";
import Link from "next/link";
import Image from "next/image";

type Props = {
  text: string;
  onClick?: () => void;
  href?: Object;
  showIcon?: boolean;
  textPos?: string;
  iconPos?: string;
  prefetch?: null | boolean;
};

export default function BottomAction({
  text = "",
  onClick = () => {},
  href = {},
  showIcon = true,
  textPos = "left",
  iconPos = "right",
  prefetch = null,
}: Props) {
  return (
    <div className="fixed bottom-0 w-full" onClick={onClick}>
      <Link
        href={href}
        prefetch={prefetch || undefined}
        className={
          "font-medium border-black flex items-center w-full bg-[#162C51] text-white p-3.5 text-left" +
          (textPos == "center" && " justify-center")
        }
      >
        <div>{text}</div>
        {showIcon && (
          <div
            className={"absolute " + (iconPos == "left" ? "left-5" : "right-5")}
          >
            <Image src={ArrowRightIcon} width={20} alt="" />
          </div>
        )}
      </Link>
    </div>
  );
}
