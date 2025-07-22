"use server"

export default async function GetFirebaseConfig() {
  try {
    if (process.env.OBK_FIREBASE_CONFIG) {
      return JSON.parse(process.env.OBK_FIREBASE_CONFIG);
    }
    throw "No env";
  } catch (error) {
    console.log("GetFirebaseConfig Error: ", error);
    return {};
  }
}
