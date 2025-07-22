import type { Oauth2TokenResponse } from "@/types/Service";

interface GetOauthTokenOutput {
  data?: Oauth2TokenResponse;
  error?: string;
}

export async function GetOauthToken(): Promise<GetOauthTokenOutput> {
  try {
    console.log("GetOauthToken...");
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(
      `${process.env.OBK_API_URL}/oauth2/token`,
      // "https://mocki.io/v1/22600a44-5057-4664-8326-25c555f8d465",
      // "http://www.randomnumberapi.com/api/v1.0/random",
      {
        next: { revalidate: 0 },
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.OBK_API_CLIENT_ID,
          client_secret: process.env.OBK_API_CLIENT_SECRET,
          grant_type: "client_credentials",
        }),
      }
    );

    console.log("GetOauthToken status:", res.status);
    if (res.status !== 200) throw "status not ok";
    const resJson = await res.json();
    console.log("GetOauthToken response:", resJson);

    return { data: resJson };
  } catch (e) {
    console.error(e);
    return { error: "GetOauthToken Error" };
    // if (typeof e === "string") return e;
    // else if (e instanceof Error) setError(e.message);
    // else setError("Error");
  }
}
