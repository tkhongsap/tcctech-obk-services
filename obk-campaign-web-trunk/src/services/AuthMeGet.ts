"use server";

import { cookies } from "next/headers";
import type { AuthMeGetResponse } from "@/types/services";
import HandleServiceCmsError from "@/utils/HandleServiceCmsError";

const AuthMeGet = async (): Promise<
  [string | null, AuthMeGetResponse | null]
> => {
  console.log("AuthMeGet...");

  console.log(`token: ${cookies().get("token")?.value}`);
  try {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(`${process.env.DEFAULT_API_URL}/auth/me`, {
      cache: "no-store",
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
    });
    // console.log("AuthMeGet response", res);
    await HandleServiceCmsError(res);
    if (res.status !== 200) throw `AuthMeGet status not ok ${res.status}`;
    const resJson = await res.json();
    console.log("AuthMeGet response:", resJson);

    return [null, resJson];
  } catch (e: any) {
    if (e?.message === "NEXT_REDIRECT") throw e;

    console.log(e);
    return ["AuthMeGet Error", null];
  }
};

export default AuthMeGet;
