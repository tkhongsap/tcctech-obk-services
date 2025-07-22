import { Button } from "@/components/ui/button";
import CheckMark from "@/assets/CheckMark-green.svg";
import Image from "next/image";
import Link from "next/link";

export default function useCouponSuccess() {
  return (
    <div className="h-screen p-4 flex text-center flex-col gap-4 justify-around">
      <div>
        <Image className="mx-auto" src={CheckMark} width={35} alt="" />
        <div className="font-medium text-xl mt-5 text-[#22973F]">
          Coupon successfully used
        </div>
      </div>
      <div className="flex justify-center">
        <Button variant={"outline"} className="px-20" size={"lg"} asChild>
          <Link href={"/cms/home"}>Back</Link>
        </Button>
      </div>
    </div>
  );
}
