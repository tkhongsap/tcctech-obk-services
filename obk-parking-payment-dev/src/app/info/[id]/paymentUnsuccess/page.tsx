"use client";

import Image from "next/image";
import ObkLogo from "@/assets/obk-logo.svg";
import BottomAction from "@/components/BottomAction";
import WrongIcon from "@/assets/Wrong.svg";

export default function PayMethod({
  params: { id },
  searchParams: { receiptNo, hideHeader, hideTryAgainUnsuccess, type},
}: {
  params: { id: string };
  searchParams: {
    receiptNo: string;
    hideHeader: boolean;
    hideTryAgainUnsuccess: boolean;
    type?: string | undefined;
  };
}) {
  return (
    <>
      <main className="flex min-h-screen flex-col text-[#292929]">
        {!hideHeader && (
          <div className="flex justify-center p-5 border-t border-b">
            <Image src={ObkLogo} alt="OBK Logo" width={140} priority />
          </div>
        )}

        <div className="relative mt-16">
          <div className="p-4">
            <div>
              <Image src={WrongIcon} width={35} alt="" />
            </div>
            <div className="font-medium text-2xl mt-5">
              Payment Unsuccessful
            </div>
            <div className="text-[#292929] mt-2">
              <div>
                Please contact{" "}
                {type === "Residential"
                  ? "concierge services"
                  : "our support"}
              </div>
              <div>
                <a
                  className="text-[#068EFF]"
                  href={`tel:${type === "Residential" ? "024835589" : "023456789"}`}
                >
                  {type === "Residential" ? "02 483 5589" : "023 456 789"}
                </a>{" "}
                or{" "}
                <a
                  className="text-[#068EFF]"
                  href={`email:${
                    type === "Residential"
                      ? "concierge@frasersproperty.com"
                      : "support@onebangkok.com"
                  }`}
                >
                  {type === "Residential"
                    ? "concierge@frasersproperty.com"
                    : "support@onebangkok.com"}
                </a>
              </div>
            </div>
          </div>
          {!hideTryAgainUnsuccess && (
            <BottomAction
              text="Try Again"
              href={{
                pathname: `/info/${id}`,
              }}
            />
          )}
        </div>
      </main>
    </>
  );
}
