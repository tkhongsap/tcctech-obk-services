"use server";

import { GetOauthToken } from "@/services/GetOauthToken";
import type { GetParkingDetailResponse } from "@/types/Service";

const GetParkingDetail = async (id: string) => {
  console.log("GetParkingDetail... ");
  try {
    let { data, error } = await GetOauthToken();
    if (error || !data) throw error;
    const { access_token } = data;

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(
      `${process.env.OBK_API_URL}/v1/carpark/redemption/GetParkingDetail`,
      // "https://mocki.io/v1/00b34978-40ab-451b-85de-f1ccf6fc6b0b",
      {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
        },
        body: JSON.stringify({
          search: id,
          lostCard: false,
        }),
      }
    );
    const resJson = (await res.json()) || {};
    console.log("GetParking response", res, resJson);
    if (res.status !== 200) throw `GetParking status not ok ${res.status}`;
    return resJson;
  } catch (e) {
    console.log(e);
    throw new Error("GetParking Error");
  }
};

export default GetParkingDetail;
