"use server";

import { cookies } from "next/headers";
import type { CouponPostResponse, CouponPostBody } from "@/types/services";
import HandleServiceCmsError from "@/utils/HandleServiceCmsError";

const CouponPost = async (
  body: CouponPostBody
): Promise<[string | null, CouponPostResponse | null]> => {
  console.log("CouponPost...", body);

  console.log(`token: ${cookies().get("token")?.value}`);
  try {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(`${process.env.DEFAULT_API_URL}/camp/coupon`, {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
      body: JSON.stringify(body),
    });

    await HandleServiceCmsError(res);

    const resJson = (await res.json()) || {};
    console.log("CouponPost response:", res, resJson);
    if (res.status !== 200) throw `CouponPost status not ok ${res.status}`;
    return [null, resJson];
  } catch (e: any) {
    if (e?.message === "NEXT_REDIRECT") throw e;

    console.log(e);
    return ["CouponPost Error", null];
  }
};

export default CouponPost;
