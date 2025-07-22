/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import ArrowLeft from "@/assets/ArrowLeft.svg";
import Image from "next/image";
import LoadingDefaultPage from "@/components/LoadingDefaultPage";
import { useSearchParams } from "next/navigation";
import { QrInfoPostResponse } from "@/types/services";
import CouponGet from "@/services/CouponGet";
import { Button } from "@/components/ui/button";
import CouponPost from "@/services/CouponPost";
import UseCouponResultDialog from "@/components/UseCouponResultDialog";
import type { ShowDialog } from "@/components/UseCouponResultDialog";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function CouponInfo() {
  const [mounted, setMounted] = useState(false);
  const [couponInfo, setCouponInfo] = useState<QrInfoPostResponse | null>(null);
  const [couponInfoError, setCouponInfoError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState<ShowDialog>(null); // useState<Dialog | null>(null);
  const searchParams = useSearchParams();
  const ref_code = searchParams.get("ref") || "";

  async function getCouponInfo() {
    console.log("ref_code:", ref_code);
    setLoading(true);
    const [err, data] = await CouponGet({ ref_code });
    setLoading(false);
    console.log([err, data]);
    setCouponInfoError(!!err);
    setCouponInfo(data);
  }

  async function postUseCoupon() {
    console.log("ref_code:", ref_code);
    setLoading(true);
    const [error, data] = await CouponPost({ ref_code: ref_code });
    setLoading(false);
    console.log([error, data]);
    if (!error && data?.id) {
      setShowDialog({ type: "success", title: "Coupon successfully used" });
    } else {
      setShowDialog({
        type: "error",
        title: "Coupon usage failed",
        message: data?.message || "",
      });
    }
  }

  const tryFormatValue = (key: string, v: any) => {
    const datekey = ["use_date", "expire_date", "created_at", "last_update_at"];
    try {
      if (v && datekey.includes(key)) {
        return new Date(v).toUTCString();
      }
      return JSON.stringify(v);
    } catch (error) {
      return v;
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getCouponInfo();
    }
  }, [mounted]);

  if (loading) {
    return <LoadingDefaultPage />;
  }

  return (
    <div className="h-screen flex justify-around flex-col pb-4">
      <UseCouponResultDialog
        close={() => {
          setShowDialog(null);
          getCouponInfo();
        }}
        show={showDialog}
      />
      <div
        className="absolute top-0 left-0 inline-flex gap-2 mt-5 ml-4 mb-7 items-center cursor-pointer"
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
      {couponInfoError && (
        <div className="text-center mx-auto p-4 w-full max-w-lg">
          <div className="text-center font-medium text-xl">ไม่พบคูปอง!</div>
          <div className="mt-10 flex gap-2 justify-center">
            <div className="font-medium">Ref:</div>
            <div>{ref_code}</div>
          </div>
          <div className="bg-slate-400">
            {couponInfo && JSON.stringify(couponInfo)}
          </div>
        </div>
      )}

      {couponInfo?.id && (
        <div>
          <div className="font-medium text-xl text-center mt-4">
            Coupon Info
          </div>

          {/* <div className="mt-5 text-center mx-auto p-4 w-full max-w-lg">
            {Object.entries(couponInfo).map(([ck, cv]) => {
              return (
                <div key={ck} className="flex gap-5 justify-between">
                  <div className="font-medium">{ck}</div>
                  <div>{tryFormatValue(ck, cv)}</div>
                </div>
              );
            })}
          </div> */}

          <div className="mt-5 text-center mx-auto p-4 w-full max-w-lg space-y-3">
            <div className="flex gap-5 justify-between">
              <div className="font-medium">Ref</div>
              <div>{couponInfo.ref_code}</div>
            </div>
            <div className="flex gap-5 justify-between">
              <div className="font-medium">รหัสคูปอง</div>
              <div>{couponInfo.coupon_code}</div>
            </div>
            <div className="flex gap-5 justify-between">
              <div className="font-medium">สถานะคูปอง</div>
              {couponInfo.coupon_use ? (
                <div className="text-orange-800">ถูกใช้งานแล้ว</div>
              ) : (
                <div className="text-lime-600">พร้อมใช้งาน</div>
              )}
            </div>
            <div className="flex gap-5 justify-between">
              <div className="font-medium">วันที่ใช้คูปอง</div>
              <div>
                {couponInfo.use_date
                  ? format(couponInfo.use_date, "dd MMMM yyyy HH:mm", {
                      locale: th,
                    })
                  : "-"}
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center items-center w-full pb-4">
            <Button onClick={() => postUseCoupon()} size={"lg"}>
              Use Coupon
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
