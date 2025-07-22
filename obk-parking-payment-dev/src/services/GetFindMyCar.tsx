"use server";

import { GetOauthToken } from "@/services/GetOauthToken";
// import type { GetFindMyCarResponse } from "@/types/Service";

const GetFindMyCar = async (plateNo: string) => {
  console.log("GetFindMyCar... ", { plateNo });
  try {
    let { data, error } = await GetOauthToken();
    if (error || !data) throw error;
    const { access_token } = data;

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(
      `${process.env.OBK_API_URL}/v1/mt/parking/spaceNo`,
      {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
        },
        body: JSON.stringify({
          pageNo: 1,
          pageSize: 1,
          plateNo: plateNo,
        }),
      }
    );
    const resJson = (await res.json()) || {};
    console.log("GetFindMyCar response", res, resJson);
    if (res.status !== 200) throw `GetFindMyCar status not ok ${res.status}`;
    return resJson;
  } catch (e) {
    console.log(e);
    throw new Error("GetFindMyCar Error");
  }
};

export default GetFindMyCar;
