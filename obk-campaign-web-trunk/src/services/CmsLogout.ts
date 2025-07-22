"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  try {
    cookies().delete("token");
    return;
  } catch (error) {
    console.log("=== logout", error);
    return;
  }

  // redirect("/cms/login");
}
