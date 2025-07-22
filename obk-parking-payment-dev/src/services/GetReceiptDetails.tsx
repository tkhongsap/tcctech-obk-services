"use server";

import { GetOauthToken } from "@/services/GetOauthToken";
import type {
  GetReceiptDetailsResponse,
  GetAlldataDetailsReceiptBody,
} from "@/types/Service";

const GetReceiptDetails = async ({
  type = "Web Payment",
  logId,
}: GetAlldataDetailsReceiptBody) => {
  console.log("GetReceiptDetailsDetail...", { type, logId });
  try {
    let { data, error } = await GetOauthToken();
    if (error || !data) throw error;
    const { access_token } = data;

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(
      `${process.env.OBK_API_URL}/v1/carpark/redemption/AlldataDetailsReceipt`,
      {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
        },
        body: JSON.stringify({ type, logId }),
      }
    );

    const resJson = (await res.json()) || {};
    console.log("GetReceiptDetails response", resJson);

    if (res.status !== 200)
      throw `GetReceiptDetails status not ok (${res.status})`;

    return resJson as GetReceiptDetailsResponse;
  } catch (e) {
    console.log(e);
    throw new Error("GetReceiptDetails Error");
  }
};

export default GetReceiptDetails;
