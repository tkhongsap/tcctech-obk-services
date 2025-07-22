"use server";

import type { SurveyGetResponse } from "@/types/services";

const SurveyGet = async (): Promise<
  [string | null, SurveyGetResponse | null]
> => {
  console.log("SurveyGet...");
  try {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(
      `${process.env.DEFAULT_API_URL}/survey/camp_noti_bus`,
      {
        cache: "no-store",
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const resJson = (await res.json()) || {};
    console.log("SurveyGet response:", res, resJson);
    if (res.status !== 200) throw `SurveyGet status not ok ${res.status}`;

    return [null, resJson];
  } catch (e: any) {
    console.log(e);
    return ["SurveyGet Error", null];
  }
};

export default SurveyGet;
