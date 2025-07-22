"use server";

import type { SurveyPostBody, SurveyPostResponse } from "@/types/services";

const SurveyPost = async (
  body: SurveyPostBody
): Promise<[string | null, SurveyPostResponse | null]> => {
  console.log("SurveyPost...");
  try {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(`${process.env.DEFAULT_API_URL}/survey/coffee`, {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const resJson = (await res.json()) || {};
    console.log("SurveyPost response:", res, resJson);
    if (res.status !== 200) throw `SurveyPost status not ok ${res.status}`;

    return [null, resJson];
  } catch (e: any) {
    // if (e?.message === "NEXT_REDIRECT") throw e;

    console.log(e);
    return ["SurveyPost Error", null];
  }
};

export default SurveyPost;
