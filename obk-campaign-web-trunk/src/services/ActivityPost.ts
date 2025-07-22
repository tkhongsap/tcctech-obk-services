"use server";

import type { ActivityPostBody, ActivityPostResponse } from "@/types/services";

const ActivityPost = async (
  body: ActivityPostBody
): Promise<[string | null, ActivityPostResponse | null]> => {
  console.log("ActivityPost...", body);
  try {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(`${process.env.DEFAULT_API_URL}/activity`, {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const resJson = (await res.json()) || {};
    console.log("ActivityPost response:", res, resJson);
    if (res.status !== 200) throw `ActivityPost status not ok ${res.status}`;

    return [null, resJson];
  } catch (e: any) {
    // if (e?.message === "NEXT_REDIRECT") throw e;

    console.log(e);
    return ["ActivityPost Error", null];
  }
};

export default ActivityPost;
