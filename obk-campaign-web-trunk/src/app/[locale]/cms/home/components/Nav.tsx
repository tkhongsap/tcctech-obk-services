"use server";

import AuthMeGet from "@/services/AuthMeGet";
import Logout from "@/actions/Logout";

export default async function Nav() {
  const [_, data] = await AuthMeGet();

  return (
    <div className="flex justify-between absolute top-0 left-0 w-full p-5">
      <div>
        Welcome <span className="font-medium">{data?.name}</span>
      </div>
      <div className="">
        <form action={Logout}>
          <button className="text-center w-full border px-2 rounded-md py-2">
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
