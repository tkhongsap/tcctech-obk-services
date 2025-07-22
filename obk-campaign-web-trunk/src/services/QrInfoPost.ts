"use server";

import { cookies } from "next/headers";
import type { QrInfoPostResponse, QrInfoPostBody } from "@/types/services";
import HandleServiceCmsError from "@/utils/HandleServiceCmsError";

const QrInfoPost = async (
  body: QrInfoPostBody
): Promise<[string | null, QrInfoPostResponse | null]> => {
  console.log("QrInfoPost...", body);

  console.log(`token: ${cookies().get("token")?.value}`);
  try {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(`${process.env.DEFAULT_API_URL}/camp/qrinfo`, {
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
    console.log("QrInfoPost response:", res, resJson);
    if (res.status !== 200) throw `QrInfoPost status not ok ${res.status}`;
    return [null, resJson];
  } catch (e: any) {
    if (e?.message === "NEXT_REDIRECT") throw e;

    console.log(e);
    return ["QrInfoPost Error", null];
  }
};

export default QrInfoPost;
