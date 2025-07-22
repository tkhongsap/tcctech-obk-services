import Image from "next/image";
import ObkLogo from "@/assets/obk-logo.svg";

export default function Loading() {
  return (
    <main className="flex min-h-screen justify-center items-center text-[#292929]">
      <div className="flex justify-center items-center">
        <Image
          className="animate-flicker"
          src={ObkLogo}
          alt="OBK Logo"
          // className="dark:invert"
          width={140}
          priority
        />
      </div>
    </main>
  );
}
