"use server";

import { GetOauthToken } from "@/services/GetOauthToken";
import type { GetReceiptImageResponse } from "@/types/Service";

const GetReceiptImage = async ({
  logId,
  paymentId,
  type = "Web Payment",
  subCode = undefined,
}: {
  logId: string;
  paymentId: number;
  type: string;
  subCode?: string;
}) => {
  console.log("GetReceiptImageDetail...");
  try {
    let { data, error } = await GetOauthToken();
    if (error || !data) throw error;
    const { access_token } = data;

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // return
    const res = await fetch(
      `${process.env.OBK_API_URL}/v1/carpark/redemption/GenerateReceipt`,
      {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
        },
        body: JSON.stringify({
          logId,
          paymentId,
          type,
          subCode
        }),
      }
    );
    if (res.status !== 200)
      throw `GetReceiptImage status not ok (${res.status})`;
    const resJson: GetReceiptImageResponse = await res.json();
    console.log("GetReceiptImage response success");
    return resJson;
  } catch (e) {
    console.log(e);
    throw new Error("GetReceiptImage Error");
  }
};

export default GetReceiptImage;
