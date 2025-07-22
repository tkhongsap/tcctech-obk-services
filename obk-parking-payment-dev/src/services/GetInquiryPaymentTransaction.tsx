"use server";

import { GetOauthToken } from "@/services/GetOauthToken";
import type {
  GetInquiryPaymentTransactionResponse,
  GetInquiryPaymentTransactionRqBody,
} from "@/types/Service";

const GetInquiryPaymentTransaction = async ({
  transactionNo,
  type = "Web Payment",
  logId,
  subCode,
}: GetInquiryPaymentTransactionRqBody) => {
  console.log("InquiryPaymentTransaction...", { transactionNo, type, logId, subCode });
  try {
    let { data, error } = await GetOauthToken();
    if (error || !data) throw error;
    const { access_token } = data;
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(
      `${process.env.OBK_API_URL}/v1/carpark/payment/InquiryPaymentTransaction`,
      {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
        },
        body: JSON.stringify({ transactionNo, type, logId, subCode }),
      }
    );

    const resJson = (await res.json()) || {};

    console.log("GetInquiryPaymentTransactionResponse response", res, resJson);

    if (res.status !== 200)
      throw "GetInquiryPaymentTransaction status not ok: " + res.status;

    return { data: resJson, error: null };
  } catch (e) {
    console.log(e);
    return { error: "GetInquiryPaymentTransaction Error", data: null };
    // if (typeof e === "string") setError(e);
    // else if (e instanceof Error) setError(e.message);
    // else setError("Error");
  }
};

export default GetInquiryPaymentTransaction;
