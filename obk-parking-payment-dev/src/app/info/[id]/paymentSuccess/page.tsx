"use client";

import Image from "next/image";
import ObkLogo from "@/assets/obk-logo.svg";
import CheckMarkIcon from "@/assets/CheckMark-green.svg";
import { useState } from "react";
import GetReceiptDetails from "@/services/GetReceiptDetails";
import GetReceiptImage from "@/services/GetReceiptImage";
import BottomAction from "@/components/BottomAction";
import useSWRImmutable from "swr/immutable";
import LoadingSpin from "@/components/LoadingSpin";
import { useRouter } from "next/navigation";

// import "./style.css";
export default function PayMethod({
  params: { id },
  searchParams: { type, total, hideBack, hideHeader, hideDoneSuccess, subCode },
}: {
  params: { id: string; hideDoneSuccess: boolean };
  searchParams: {
    total: number;
    type: string;
    hideHeader: boolean;
    hideBack: boolean;
    hideDoneSuccess: boolean;
    hideTryAgainUnsuccess: boolean;
    subCode?: string | undefined;
  };
}) {
  const router = useRouter();
  const {
    data: receiptDetailsData,
    error: receiptDetailsError,
    isLoading: receiptDetailsLoading,
  } = useSWRImmutable("GetReceiptDetails_" + id, () =>
    GetReceiptDetails({
      logId: id,
      type,
    })
  );

  const [receiptImageLoading, setReceiptImageLoading] = useState<number | null>(
    null
  );
  const [receiptImageError, setReceiptImageError] = useState(false);

  async function downloadImage(paymentId: number) {
    try {
      setReceiptImageLoading(paymentId);
      const elmId = "parking-receipt-download";

      // remove old created elm
      document.getElementById(elmId)?.remove();

      const data = await GetReceiptImage({ logId: id, paymentId, type, subCode });
      if (!data?.image) throw "no image";

      // create elm for download
      const a = document.createElement("a");
      a.href = data.image;
      a.id = elmId;
      a.download = `parking_receipt_${id}_${paymentId}.png`;
      a.style.display = "none";

      // append for other app can see
      document.body.append(a);

      a.click(); // Downloaded file
    } catch {
      setReceiptImageError(true);
    } finally {
      setReceiptImageLoading(null);
    }
  }

  return (
    <main className="flex min-h-screen flex-col text-[#292929]">
      {!hideHeader && (
        <div className="flex justify-center p-5 border-t border-b">
          <Image src={ObkLogo} alt="OBK Logo" width={140} priority />
        </div>
      )}

      <div className="relative mt-5 pb-20 max-w-lg">
        <div className="p-6">
          <div>
            <Image src={CheckMarkIcon} width={35} alt="" />
          </div>
          <div className="font-medium text-2xl mt-5 text-[#22973F]">
            Payment Successful
          </div>
          <div className="text-[#292929] mt-2">
            Your payment has been successfully processed.
          </div>
          {receiptDetailsData && (
            <div className="mt-4 mb-6">
              {type !== "Residential" ? (
                <>
                  You have already paid for this ticket {receiptDetailsData.length} times. The following are your receipts for this ticket:
                </>
              ) : null}
            </div>
          )}
          {/* <div className="text-[#292929] font-medium">
              Receipt Number: {receiptNo}
            </div> */}

          {receiptDetailsLoading && (
            <div className="mt-20 grid place-items-center">
              <LoadingSpin width="40" />
            </div>
          )}

          {receiptDetailsData &&
            receiptDetailsData.map((d, i) => (
              <div
                key={i}
                className="border border-[#BDBDBD] p-3 font-medium"
                style={{ marginTop: "-1px" }}
              >
                <div>
                  {i + 1}. Receipt Number: {d.trn_Tax_No}
                </div>
                <div className="mx-auto">
                  <div
                    onClick={() => downloadImage(d.trn_Log_ID_Payment)}
                    className={`${
                      receiptImageLoading == d.trn_Log_ID_Payment &&
                      "pointer-events-none opacity-50"
                    } cursor-pointer mt-3 text-center p-3 h-12 grid place-items-center w-full bg-[#E4E4E4]`}
                  >
                    {receiptImageLoading == d.trn_Log_ID_Payment ? (
                      <LoadingSpin width="25" />
                    ) : (
                      "Save This Receipt"
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {!hideDoneSuccess && (
          <BottomAction
            text="Done"
            onClick={() => {
              router.push(`/info/${id}`);
            }}
            prefetch={false}
          />
        )}
      </div>
    </main>
  );
}
