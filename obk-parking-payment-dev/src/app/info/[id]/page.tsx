"use client";

export const fetchCache = "force-no-store";

import Image from "next/image";
import ObkLogo from "@/assets/obk-logo.svg";
import GetParkingDetail from "@/services/GetParkingDetail";
import { useEffect, useState } from "react";
import TermsCon from "@/components/TermsCon";
import LoadingDefaultPage from "@/components/LoadingDefaultPage";
import { format } from "date-fns";
import BottomAction from "@/components/BottomAction";
import FindMyCar from "./components/FindMyCar";
import MainDetail from "./components/MainDetail";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";

export default function InfoPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [showTerms, setShowTerms] = useState(false);
  let {
    data,
    error,
    isMutating: loading,
    trigger,
  } = useSWRMutation("get_parking_detail", () => GetParkingDetail(id));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (error) {
      router.push(`/info/${id}/ticketInvalid`);
    }
  }, [error, id, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      console.log("trigger");
      trigger();
    }
  }, [mounted, trigger]);

  if (loading || !data) return <LoadingDefaultPage />;

  return (
    <>
      {/* {error && (
        <div className="grid place-items-center w-full h-screen">
          <h2>Something went wrong!</h2>
        </div>
      )} */}

      {data && (
        <main className="flex min-h-screen flex-col text-[#292929]">
          <div className="flex justify-center p-5 border-t border-b">
            <Image src={ObkLogo} alt="OBK Logo" width={140} priority />
          </div>

          <div className="relative pb-20">
            {showTerms && (
              <div className="absolute w-full bg-white h-full">
                <TermsCon back={() => setShowTerms(false)} />
              </div>
            )}
            {/* {result && JSON.stringify(result)} */}
            <div className="p-4">
              <div className="text-[#292929] font-medium text-2xl">
                My Parking Ticket
              </div>
              <div className="text-[#7C7C7C] mt-1">
                {format(data.entryDateTime, "EEEE d MMMM yyyy 'at' HH:mm")}
              </div>
            </div>

            <MainDetail data={data} />
            <FindMyCar plateNo={data.plateNo} />

            {/* <div className="px-4">
              <hr className="mx-auto" />
            </div> */}
            {/* <div className="p-4 max-w-sm mx-auto">
              <div>Discount code (if any)</div>
              <input
                type="text"
                className="border-[#DCDCDC] mt-1 block border w-full max-w-sm rounded p-3"
                placeholder="Enter discount code"
              />
            </div> */}
            <div
              className="mt-3 text-[#162C51] font-medium underline p-4 cursor-pointer"
              onClick={() => {
                setShowTerms(true);
                window.scrollTo({ top: 0 });
              }}
            >
              Read Terms and Conditions
            </div>
          </div>
          {data?.total > 0 && (
            <BottomAction
              href={{
                pathname: `/info/${id}/payMethod`,
                query: { total: data.total },
              }}
              text="Pay Now"
            />
          )}
        </main>
      )}
    </>
  );
}
