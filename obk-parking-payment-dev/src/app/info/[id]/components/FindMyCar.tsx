import GetFindMyCar from "@/services/GetFindMyCar";
import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import Image from "next/image";
import InformationIcon from "@/assets/icon/information.svg";
import GetSmartParkingColor from "@/services/GetSmartParkingColor";

export default function FindMyCar({ plateNo = "" }) {
  const {
    data: colorConfigs,
    error: getSmartParkingColorError,
    trigger: GetSmartParkingColorTrigger,
  } = useSWRMutation("GetSmartParkingColor", () => GetSmartParkingColor());

  const {
    data,
    error,
    isMutating: loading,
    trigger,
  } = useSWRMutation("GetFindMyCar", () => GetFindMyCar(plateNo));
  const [mounted, setMounted] = useState(false);
  const [colorZone, setColorZone] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      trigger();
      GetSmartParkingColorTrigger();
    }
  }, [mounted, plateNo]);

  useEffect(() => {
    // mark error
    if (getSmartParkingColorError) {
      setColorZone("black");
      return;
    }
    if (data && data[0]?.zoneName && colorConfigs) {
      const colorConfig = colorConfigs.find(
        (e: { name: string }) => e.name == data[0].zoneName
      );

      // mark can't find config value
      setColorZone(colorConfig?.color || "grey");
    }
  }, [data, colorConfigs, getSmartParkingColorError]);

  return (
    !loading && (
      <div className="px-4 pt-3">
        {/* {JSON.stringify(data)} */}
        {error || !data || data.length == 0 ? (
          <div className="max-w-sm mx-auto bg-[#EFEFEF] p-4">
            <div className="">
              <div className="text-[#162C51] flex gap-2 font-medium">
                <Image src={InformationIcon} width={16} alt={"info"} />{" "}
                <div>Car location is unavailable</div>
              </div>
              <div className="mt-2 text-sm">
                Once you park your car and we can detect your license plate,
                your car location will be displayed.
              </div>
            </div>
          </div>
        ) : (
          <div className="border max-w-sm mx-auto p-4">
            <div className="font-medium">My Car Location</div>
            <hr className="mx-0 mt-3" />
            <div className="text-[#989898] mt-3 text-sm">Floor</div>
            <div className="font-lg">{data[0].floorName}</div>
            <div className="text-[#989898] mt-3 text-sm">Zone</div>
            <div
              className={`inline-block min-w-28 font-lg ${
                colorZone ? "font-medium text-white px-4" : "text-black"
              }`}
              style={{
                backgroundColor: colorZone,
              }}
            >
              {data[0].zoneName}
            </div>
            <div className="text-[#989898] mt-3 text-sm">Pole</div>
            <div className="font-lg">{data[0].parkingExtension?.poleName}</div>
          </div>
        )}
      </div>
    )
  );
}
