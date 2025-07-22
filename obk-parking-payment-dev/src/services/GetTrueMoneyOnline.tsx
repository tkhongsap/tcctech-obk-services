"use server";

import { GetOauthToken } from "@/services/GetOauthToken";
import type { GetTrueMoneyResponse, GetTrueMoneyInput } from "@/types/Service";

const GetTrueMoney = async ({
  invoiceNo,
  description = "Web Payment",
  amount,
}: GetTrueMoneyInput) => {
  console.log("GetTrueMoney...");
  try {
    let { data, error } = await GetOauthToken();
    if (error || !data) throw error;
    const { access_token } = data;

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(
      `${process.env.OBK_API_URL}/v1/carpark/payment/TrueMoneyOnline`,
      {
        next: { revalidate: 0 },
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
        },
        body: JSON.stringify({ invoiceNo, description, amount }),
      }
    );
    // console.log("GetTrueMoney response", res);
    if (res.status !== 200) {
      const resJson = await res.json();
      console.log("=== TrueMoneyResponse", resJson);
      throw "GetTrueMoney status not ok";
    }

    const resJson: GetTrueMoneyResponse = await res.json();

    console.log(
      "TrueMoneyResponse:",
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

export default GetTrueMoney;
