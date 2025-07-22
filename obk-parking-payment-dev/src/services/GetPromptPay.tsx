"use server";

import { GetOauthToken } from "@/services/GetOauthToken";
import type { GetPromptPayResponse, GetPromptPayInput } from "@/types/Service";

const GetPromptPay = async ({
  invoiceNo,
  description = "Web Payment",
  amount,
  subCode
}: GetPromptPayInput) => {
  console.log("GetPromptPay...");
  try {
    let { data, error } = await GetOauthToken();
    if (error || !data) throw error;
    const { access_token } = data;

    // await new Promise((resolve) => setTimeout(resolve, 1000));

    const res = await fetch(
      `${process.env.OBK_API_URL}/v1/carpark/payment/PromptPay`,
      {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
        },
        body: JSON.stringify({ invoiceNo, description, amount, subCode, cache: true }),
      }
    );

    if (res.status !== 200) throw "GetPromptPay status not ok";

    const resJson: GetPromptPayResponse = await res.json();

    console.log(
      "GetPromptPayResponse:",
      resJson.qrId,
      resJson.qrImage.slice(0, 10),
      resJson.qrTimeOut,
      resJson.respCode,
      resJson.respDesc,
      resJson.transactionNo
    );

    return { data: resJson, error: null };
  } catch (e) {
    console.log(e);
    throw new Error("GetPromptPay Error");
  }
};

export default GetPromptPay;
