import { initializeApp } from "firebase/app";
import {
  fetchAndActivate,
  getRemoteConfig,
  getString,
} from "firebase/remote-config";
import GetFirebaseConfig from "@/services/GetFirebaseConfig";
// import type { smart_parking_color } from "@/types/config/smart_parking_color";

export default async function GetSmartParkingColor() {
  console.log("GetSmartParkingColor...");
  const firebaseConfig = await GetFirebaseConfig();
  const app = initializeApp(firebaseConfig);
  const remoteConfig = getRemoteConfig(app);
  remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

  return fetchAndActivate(remoteConfig)
    .then(() => {
      const smart_parking_color_data_string = getString(
        remoteConfig,
        "smart_parking_color"
      );
      console.log(
        "GetSmartParkingColor getString: ",
        smart_parking_color_data_string
      );
      const json = JSON.parse(smart_parking_color_data_string);
      return json;
    })
    .catch((err) => {
      console.log(err);
      throw Error("Get config value error");
    });
}
