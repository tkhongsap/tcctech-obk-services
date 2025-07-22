"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import ObkLogo from "@/assets/obk-logo.svg";
import { useEffect, useState } from "react";
import type { GetParkingDetailResponse } from "@/types/Service";
import LoadingDefaultPage from "@/components/LoadingDefaultPage";
import ArrowLeft from "@/assets/ArrowLeft.svg";
import PromptpayIcon from "@/assets/promptpay.svg";
import TruemoneyWalletIcon from "@/assets/truemoney-wallet.png";
import CheckMarkIcon from "@/assets/CheckMark.svg";

import "./style.css";
import BottomAction from "@/components/BottomAction";
import ContentEvent from "@/components/ContentEvent";
export default function PayMethod({
  params: { id },
  searchParams: {
    total,
    type,
    hideHeader,
    hideBack,
    hideDoneSuccess,
    hideTryAgainUnsuccess,
    subCode,
  },
}: {
  params: { id: string };
  searchParams: {
    logId: string;
    total: number;
    type: string;
    hideHeader: boolean;
    hideBack: boolean;
    hideDoneSuccess: boolean;
    hideTryAgainUnsuccess: boolean;
    subCode?: string | undefined;
  };
}) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventDialog, setEventDialog] = useState(false);
  const [selectMethod, setSelectMethod] = useState("");

  const now = Date.now();
  const eventDialogStart = "2025-03-28T23:00:00+0700";
  const eventDialogEnd = "2025-03-30T23:59:00+0700";

  useEffect(() => {
    console.log({ now });
    if (+new Date(eventDialogStart) <= now && +new Date(eventDialogEnd) > now) {
      console.log("in range event");
      setEventDialog(true)
    }
  }, [])

  function continuePay() {
    switch (selectMethod) {
      case "promptpay":
        () => { };
        break;
    }
  }

  interface itemInput {
    logo: StaticImageData;
    name: string;
    slug: string;
  }

  const Item = ({ logo, name, slug }: itemInput) => (
    <div
      onClick={() => setSelectMethod(slug)}
      className={`
                  ${selectMethod == slug && "selected"}
                  item`}
    >
      <div className="flex gap-3 items-center">
        <Image width={30} src={logo} alt={""}></Image>
        {name}
      </div>
      <div className={`checkMark pr-2 hidden`}>
        <Image width={20} src={CheckMarkIcon} alt={""}></Image>
      </div>
    </div>
  );

  return (
    <>
      {error && (
        <div className="grid place-items-center w-full h-screen">
          <h2>Something went wrong!</h2>
        </div>
      )}

      {/* {loading && <LoadingDefaultPage />} */}

      {/* dialog event */}
      {eventDialog && (
        <div className={`fixed z-10 inset-0 overflow-y-auto bg-white bg-opacity-70 w-full`}>
          <div className="mx-auto p-5 max-w-lg bg-white w-[95%] shadow-md mt-16">
            <ContentEvent />
            <div className="border-t border-[#DCDCDC] mt-10 pt-4 flex justify-center">
              <div
                className="text-[#162C51] font-medium cursor-pointer"
                onClick={() => setEventDialog(false)}
              >Close</div>
            </div>
          </div>
        </div>
      )}

      <main className="flex min-h-screen flex-col text-[#292929]">
        {!hideHeader && (
          <div className="flex justify-center p-5 border-t border-b">
            <Image src={ObkLogo} alt="OBK Logo" width={140} priority />
          </div>
        )}

        <div className="relative pb-20">
          {!hideBack && (
            <div
              className="inline-flex gap-2 mt-5 ml-4 mb-7 items-center cursor-pointer"
              onClick={() => history.back()}
            >
              <Image
                src={ArrowLeft}
                alt="back button"
                // className="dark:invert"
                width={16}
                priority
              />
              <div>Back</div>
            </div>
          )}
          {/* {result && JSON.stringify(result)} */}
          <div className="p-4">
            <div className="text-[#292929] font-medium text-2xl">
              Payment Method
            </div>
            <div className="text-[#7C7C7C] mt-1">
              Please select payment method before proceeding
            </div>
          </div>

          <div className="p-4 mx-auto max-w-md">
            <div className="">
              <div className="font-medium">QR Payment</div>
              <Item slug={"promptpay"} logo={PromptpayIcon} name="PromptPay" />
            </div>

            {/* <div className="mt-6">
              <div className="font-medium">Wallet</div>
              <Item
                slug={"truewallet"}
                logo={TruemoneyWalletIcon}
                name="True Money Wallet"
              />
            </div> */}
          </div>
          {selectMethod && (
            <BottomAction
              href={{
                pathname: `/info/${id}/payMethod/${selectMethod}`,
                query: {
                  total,
                  ...(type && { type }),
                  ...(hideBack && { hideBack }),
                  ...(hideHeader && { hideHeader }),
                  ...(hideDoneSuccess && { hideDoneSuccess }),
                  ...(hideTryAgainUnsuccess && { hideTryAgainUnsuccess }),
                  ...(subCode && { subCode }),
                },
              }}
              text="Pay Now"
            />
          )}
        </div>
      </main>
    </>
  );
}
