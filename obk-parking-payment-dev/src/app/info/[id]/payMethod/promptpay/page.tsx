"use client";

import Image from "next/image";
import QrMethodPage from "@/components/QrMethodPage";
import ThaiQrPaymentLogo from "@/assets/thaiqrpayment-logo.svg";
import GetPromptPay from "@/services/GetPromptPay";
import useSWRMutation from "swr/mutation";
import GetParkingDetail from "@/services/GetParkingDetail";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingDefaultPage from "@/components/LoadingDefaultPage";

export default function PromptPay({
  params: { id },
  searchParams: {
    total,
    type,
    hideBack,
    hideHeader,
    hideDoneSuccess,
    hideTryAgainUnsuccess,
    subCode
  },
}: {
  params: { id: string };
  searchParams: {
    total: string;
    type: string;
    hideBack: boolean;
    hideHeader: boolean;
    hideDoneSuccess: boolean;
    hideTryAgainUnsuccess: boolean;
    subCode?: string | undefined;
  };
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  let {
    data,
    error,
    isMutating: loading,
    trigger,
  } = useSWRMutation("get_parking_detail", () => GetParkingDetail(id));
  useEffect(() => {
    if (error) {
      router.push(`/info/${id}/ticketInvalid`);
    } else if (data && data?.total <= 0) {
      router.push(`/info/${id}/paymentSuccess`)
    }
  }, [error, id, router]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      trigger();
    }
  }, [mounted, trigger]);

  if (loading || !data) return <LoadingDefaultPage />;

  return (<QrMethodPage
          bannerQr={
            <div className="bg-[#1A3763] py-5 mb-4 grid place-items-center">
              <Image width={110} src={ThaiQrPaymentLogo} alt={""}></Image>
            </div>
          }
          params={{
            id,
          }}
          searchParams={{
            total: data?.total,
            type,
            hideHeader,
            hideBack,
            hideDoneSuccess,
            hideTryAgainUnsuccess,
            subCode,
          }}
          pageTitle={"QR Payment"}
          serviceFetcher={GetPromptPay}
          serviceKey={"get_promptpay"}
          classQrBox={""}
          downloadQrName="promptpay_qr"
        />
      );
}
