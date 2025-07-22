import { format } from "date-fns";

type Props = {
  data: GetParkingDetailResponse;
};

import type { GetParkingDetailResponse } from "@/types/Service";

export default function MainDetail({ data }: Props) {
  return (
    data && (
      <div className="px-4 mt-2">
        <div className="border m-4 max-w-sm mx-auto">
          <div className="text-center my-4">
            <div className="text-3xl font-medium">{data.plateNo}</div>
            <div className="text-sm text-gray-500">License Plate</div>
          </div>
          <div className="bg-[#EFEFEF] px-3 m-3">
            <div className="py-4">
              <div className="font-medium">Ticket no. </div>
              <div className="text-[#292929]">{data.ticketNo}</div>
            </div>
            <hr />
            <div className="py-4 flex justify-between">
              <div className="font-medium">Vehicle type</div>
              <div className="text-[#292929] font-light">
                {data.vehicleTypeName}
              </div>
            </div>
            <hr />
            <div className="py-4 flex justify-between">
              <div className="font-medium">Date</div>
              <div className="text-[#292929]">
                {format(data.entryDateTime, "d MMMM yyyy")}
              </div>
            </div>
            <hr />
            <div className="py-4 flex justify-between">
              <div className="font-medium">Time in</div>
              <div className="text-[#292929]">
                {format(data.entryDateTime, "HH:mm:ss")}
              </div>
            </div>
            <hr />
            <div className="py-4 flex justify-between">
              <div className="font-medium">Duration</div>
              <div>
                {data.parkHH} hrs {data.parkMM} mins
              </div>
            </div>
            <hr />
            <div className="py-4 flex justify-between items-center">
              <div className="font-medium">Total</div>
              <div className="text-xl font-medium">
                {data.total.toLocaleString()} Baht
              </div>
            </div>
            <hr />
            <div className="py-2 text-sm text-[#292929]">
              <div className="font-medium">Rate details</div>
              <div>{data.rateDetailEN}</div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
