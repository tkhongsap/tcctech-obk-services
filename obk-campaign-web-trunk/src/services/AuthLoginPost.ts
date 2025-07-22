"use server";

import { cookies } from "next/headers";
import type {
  AuthLoginPostBody,
  AuthLoginPostResponse,
} from "@/types/services";
import { permanentRedirect, redirect } from "next/navigation";

const AuthLoginPost = async (
  body: AuthLoginPostBody,
  success_redirect: string | null = null
): Promise<[string | null, AuthLoginPostResponse | string | null]> => {
  console.log("AuthLoginPost...");
  try {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(`${process.env.DEFAULT_API_URL}/auth/login`, {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const resJson = (await res.json()) || {};
    console.log("AuthLoginPost response:", res, resJson);

    if (res.status !== 200) throw `AuthLoginPost status not ok ${res.status}`;

    // set token to cookie
    cookies().set({
      name: "token",
      value: resJson.authToken,
      httpOnly: true,
      secure: true,
      maxAge: 86400,
    });

    if (success_redirect) {
      redirect(success_redirect);
    }

    return [null, resJson];
  } catch (e: any) {
    if (e?.message == "NEXT_REDIRECT") throw e;

    console.log(e);
    return ["AuthLoginPost Error", null];
  }
};

export default AuthLoginPost;
