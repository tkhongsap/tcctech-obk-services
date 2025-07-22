"use server";

import { cookies } from "next/headers";
import type { CouponGetResponse, CouponGetBody } from "@/types/services";
import HandleServiceCmsError from "@/utils/HandleServiceCmsError";

const CouponGet = async (
  body: CouponGetBody
): Promise<[string | null, CouponGetResponse | null]> => {
  console.log("CouponGet...", body);

  console.log(`token: ${cookies().get("token")?.value}`);
  try {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(
      `${process.env.DEFAULT_API_URL}/camp/coupon/${body.ref_code}`,
      {
        cache: "no-store",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies().get("token")?.value}`,
        },
      }
    );
    await HandleServiceCmsError(res);

    const resJson = (await res.json()) || {};
    console.log("CouponGet response:", res, resJson);
    if (res.status !== 200) throw `CouponGet status not ok ${res.status}`;
    return [null, resJson];
  } catch (e: any) {
    if (e?.message === "NEXT_REDIRECT") throw e;

    console.log(e);
    return ["CouponGet Error", null];
  }
};

export default CouponGet;
