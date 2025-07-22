"use client";

import Image from "next/image";
import QrMethodPage from "@/components/QrMethodPage";
import truemonneyWalletFullLogo from "@/assets/truemonney-wallet_full.png";
import GetTrueMoneyOnline from "@/services/GetTrueMoneyOnline";

export default function TrueWallet({
  params: { id },
  searchParams: {
    total,
    type,
    hideBack,
    hideHeader,
    hideDoneSuccess,
    hideTryAgainUnsuccess,
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
  };
}) {
  return (
    <QrMethodPage
      bannerQr={
        <div className="py-5 grid place-items-center">
          <Image width={100} src={truemonneyWalletFullLogo} alt={""}></Image>
        </div>
      }
      params={{
        id,
      }}
      searchParams={{
        total,
        type,
        hideHeader,
        hideBack,
        hideDoneSuccess,
        hideTryAgainUnsuccess,
      }}
      pageTitle={"TrueMoney Wallet"}
      serviceFetcher={GetTrueMoneyOnline}
      serviceKey={"get_truewallet"}
      classQrBox={"border-4 border-[#F89017]"}
      downloadQrName="truewallet_qr"
    />
  );
}
