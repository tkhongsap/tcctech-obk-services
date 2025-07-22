"use client";

import Image from "next/image";
import ObkLogo from "@/assets/obk-logo.svg";
import { useEffect, useState, useCallback, useRef, ReactNode } from "react";
import LoadingSpin from "@/components/LoadingSpin";
import ArrowLeft from "@/assets/ArrowLeft.svg";
import GetInquiryPaymentTransaction from "@/services/GetInquiryPaymentTransaction";
import { useRouter } from "next/navigation";
import { useTimer } from "react-timer-hook";
import useSWR from "swr";

export default function QrMethodPage({
  params: { id },
  searchParams: {
    total,
    hideBack,
    hideHeader,
    hideDoneSuccess,
    hideTryAgainUnsuccess,
    type,
    subCode,
  },
  pageTitle,
  serviceFetcher = () => {},
  serviceKey = "get_qr_payment",
  bannerQr,
  classQrBox,
  downloadQrName,
}: {
  params: { id: string };
  searchParams: {
    total: string;
    hideHeader: boolean;
    hideBack: boolean;
    hideDoneSuccess: boolean;
    hideTryAgainUnsuccess: boolean;
    type: string;
    subCode?: string | undefined;
  };
  pageTitle: string;
  serviceFetcher: Function;
  serviceKey: string;
  bannerQr: ReactNode;
  classQrBox: string;
  downloadQrName: string;
}) {
  const router = useRouter();
  const [showSaved, setShowSaved] = useState(false);
  const [inquiryError, setInquiryError] = useState(false);
  const [countGenQr, setCountGenQr] = useState(0);
  const {
    data,
    error,
    isLoading: loading,
    isValidating,
    mutate,
  } = useSWR(
    serviceKey,
    () => serviceFetcher({ invoiceNo: id, description: type, amount: total, subCode }),
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  let inquirystatus = false;
  const timeoutCheckInquiry = 3000; // interval

  // first expiry time
  const expiryTimestamp = new Date();

  const { seconds, minutes, restart, pause } = useTimer({
    expiryTimestamp,
    autoStart: false,
    onExpire: () => {
      console.log("timeout qr called");
      setCountGenQr((v) => v + 1);
      stopInquiry();
    },
  });

  // show dialog saved qr
  let timeoutShowSaved = useRef<NodeJS.Timeout | undefined>();
  function showDialogSaved() {
    setShowSaved(true);
    timeoutShowSaved.current && clearTimeout(timeoutShowSaved.current);
    timeoutShowSaved.current = setTimeout(() => {
      setShowSaved(false);
    }, 1500);
  }

  const startInquiry = () => {
    console.log("startInquiry: ");
    inquirystatus = true;
    inquiryPayment();
  };

  const stopInquiry = () => {
    console.log("stopInquiry: ");
    inquirystatus = false;
  };

  const inquiryPayment = async () => {
    console.log("inquiryPayment: ", inquirystatus);

    // Finished
    if (!(inquirystatus && data?.data?.transactionNo)) {
      return;
    }

    // Fetch
    const result = await GetInquiryPaymentTransaction({
      transactionNo: data?.data?.transactionNo,
      type,
      logId: id,
      subCode,
    });

    if (inquirystatus) {
      console.log("inquiryPayment result: ", result);

      if (result?.data?.transactionStatusId == 2) {
        stopInquiry();

        // generate query params
        const params = new URLSearchParams();
        params.set("receiptNo", result?.data?.invoiceNo);
        params.set("type", type);
        hideHeader && params.set("hideHeader", "1");
        hideBack && params.set("hideBack", "1");
        hideDoneSuccess && params.set("hideDoneSuccess", "1");
        hideTryAgainUnsuccess && params.set("hideTryAgainUnsuccess", "1");
        if (subCode) {
          params.set("subCode", subCode);
        }

        router.push(`/info/${id}/paymentSuccess?${params}`);
        return;
      }

      // Skip error status, waiting refresh qr process
      // if (result?.data?.transactionStatusId != 1) {
      //   stopInquiry();
      //   pause();
      //   setInquiryError(true);
      // }

      // Sleep
      await new Promise((resolve) => setTimeout(resolve, timeoutCheckInquiry));
    }
    return inquiryPayment();
  };

  useEffect(() => {
    console.log("effect inquiry");
    if (data?.data?.transactionNo) {
      // set new timeout gen qr
      const expired = new Date(data?.data?.qrExpiredDate); 
      expiryTimestamp.setSeconds(expired.getTime());
      restart(expired);
      startInquiry();
    }
    return () => {
      stopInquiry();
      pause();
    };
  }, [data]);

  useEffect(() => {
    console.log("countGenQr", countGenQr);
    if (countGenQr != 0) {
      console.log("---");
      mutate();
    } else {
      console.log("+++");
    }
  }, [countGenQr]);

  return (
    <>
      <main className="flex min-h-screen flex-col text-[#292929] bg-[#EFEFEF]">
        {!hideHeader && (
          <div className="flex justify-center p-5 border-t border-b bg-[#FDFDFD]">
            <Image src={ObkLogo} alt="OBK Logo" width={140} priority />
          </div>
        )}

        <div className="relative pb-20">
          {!hideBack && (
            <div
              className="inline-flex gap-2 mt-5 ml-4 mb-2 items-center cursor-pointer"
              onClick={() => history.back()}
            >
              <Image
                src={ArrowLeft}
                alt="back button"
                // className="dark:invert"
                width={18}
                priority
              />
              <div className="pt-0.5">Back</div>
            </div>
          )}
          <div className="p-4">
            <div className="font-medium text-2xl">{type == "Residential"
                ? ""
                : pageTitle}</div>
            <div className="mt-4 font-medium text-sm">
              {type == "Residential"
                ? "Please do not refresh or close this page while your payment is being processed."
                : "Please remain patient for a moment. Kindly refrain from closing your web browser or refreshing the page."}
            </div>
          </div>

          {error && (
            <div className="grid place-items-center w-full h-40">
              <h2>Something went wrong!</h2>
            </div>
          )}

          {!error && (
            <div className="px-4 mx-auto max-w-md">
              <div className="bg-white p-4">
                <div
                  className={
                    "border w-full max-w-md mx-auto pb-3 " + classQrBox
                  }
                >
                  {bannerQr}
                  <div className="px-5 mt-2 text-center ">
                    The QR code is accepted for mobile banking across all banks.
                  </div>
                  <div className="p-5 mt-2">
                    <div className="flex justify-center h-[250px]">
                      {data?.data && !loading && !isValidating ? (
                        <Image
                          width={250}
                          height={250}
                          src={"data:image/png;base64," + data?.data?.qrImage}
                          alt=""
                        ></Image>
                      ) : (
                        <div className="grid place-items-center">
                          <LoadingSpin width="40" />
                        </div>
                      )}
                    </div>
                    <div className="text-center mt-8 text-sm flex justify-center gap-2">
                      Refresh{" "}
                      <div className="font-medium w-10 text-left">
                        {(minutes + "").padStart(2, "0")}:
                        {(seconds + "").padStart(2, "0")}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-5">
                      <div className="font-medium">Total</div>
                      <div className="text-2xl font-medium">
                        {Number(total).toLocaleString()} Baht
                      </div>
                    </div>
                    {(type == "Residential") && (
                    <div className="flex justify-between items-center mt-5">
                      <div className="font-medium">Invoice Number</div>
                      <div className="text-1xl font-medium">
                        {id}
                      </div>
                    </div>
                    )}
                  </div>
                </div>
                <div className="mt-5 mx-auto">
                  <a
                    download={`${downloadQrName}_${data?.data?.transactionNo}.png`}
                    href={"data:image/png;base64," + data?.data?.qrImage}
                    onClick={() => showDialogSaved()}
                    className="p-3 block text-center w-full font-medium bg-[#E4E4E4] border border-[#E4E4E4]"
                  >
                    Save QR code
                  </a>
                </div>
              </div>
            </div>
          )}
          {inquiryError && (
            <div className="fixed w-full h-screen top-0 bg-[#29292994]">
              <div className="p-4 bg-white fixed bottom-0 w-full pb-7">
                <div className="font-medium">Invalid QR code</div>
                <div className="text-[#7C7C7C]">
                  The QR code you scanned is no longer valid or has expired.
                  Please regenerate a new QR code.
                </div>
                <div
                  className="cursor-pointer mx-auto mt-4 w-full max-w-sm text-white bg-[#162C51] text-center p-3 font-medium"
                  onClick={() => {
                    setCountGenQr((v) => v + 1);
                    setInquiryError(false);
                  }}
                >
                  Generate New QR
                </div>
                <div
                  className="cursor-pointer mx-auto mt-3 w-full max-w-sm border border-[#162C51] text-center p-3 font-medium"
                  onClick={() => history.back()}
                >
                  Cancel
                </div>
              </div>
            </div>
          )}

          {showSaved && (
            <div className="grid place-items-center fixed bottom-0 w-full p-4">
              <div className="bg-[#DFF9E5] p-4 max-w-sm w-full grid place-items-center text-[#22973F]">
                QR code image save successfully
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
