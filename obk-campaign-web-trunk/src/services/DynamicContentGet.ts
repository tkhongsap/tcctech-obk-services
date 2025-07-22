"use server";

import type { DynamicContentGetResponse } from "@/types/services";

const DynamicContentGet = async (): Promise<
  [string | null, DynamicContentGetResponse | null]
> => {
  console.log("DynamicContentGet...");
  try {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(
      // `${process.env.DEFAULT_API_URL}/dynamic_content/th/test_page/`,
      `https://xgrx-nsni-ogo5.s2.xano.io/api:ktikgkPS/dynamic_content/th/test_page/`,
      {
        cache: "no-store",
        method: "GET",
        headers: {
          // Accept: "application/json",
        },
      }
    );

    const resJson = (await res.json()) || {};
    console.log("DynamicContentGet response:", res, resJson);
    if (res.status !== 200) throw `DynamicContentGet status not ok ${res.status}`;

    return [null, resJson];
  } catch (e: any) {
    console.log(e);
    return ["DynamicContentGet Error", null];
  }
};

export default DynamicContentGet;
