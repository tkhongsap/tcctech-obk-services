"use client";

import Image from "next/image";
import ObkLogo from "@/assets/obk-logo.svg";
// import BottomAction from "@/components/BottomAction";
import WrongIcon from "@/assets/Wrong.svg";

export default function PayMethod({}: {}) {
  return (
    <>
      <main className="flex min-h-screen flex-col text-[#292929]">
        <div className="flex justify-center p-5 border-t border-b">
          <Image src={ObkLogo} alt="OBK Logo" width={140} priority />
        </div>

        <div className="relative mt-16">
          <div className="p-4">
            <div>
              <Image src={WrongIcon} width={35} alt="" />
            </div>
            <div className="font-medium text-2xl mt-5">Ticket invalid</div>
            <div className="text-[#292929] mt-2">
              <div>
                Ticket is invalid or you have already paid for this ticket.{" "}
              </div>
            </div>
          </div>
          {/* <BottomAction
            text="Go back"
            textPos="center"
            showIcon={false}
            onClick={() => history.back()}
          /> */}
        </div>
      </main>
    </>
  );
}
