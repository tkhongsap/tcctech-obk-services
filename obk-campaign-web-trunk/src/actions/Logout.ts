"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export default async function Logout() {
  cookies().delete("token");
  revalidatePath("/cms/login");
  redirect("/cms/login");
}
