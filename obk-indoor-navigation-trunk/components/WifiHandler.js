import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import WifiManager from "react-native-wifi-reborn";
import { Button } from "@rneui/themed";
import {
  wifiScanIntervalState,
  trackWifiScanLocationState,
  wifiDataState,
  currentPositionState,
} from "../state/app_recoil_state";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import WIFI_LOCATION_DATA from "../assets/wifi_obk";
import findLocationFromWifi from "../utils/findLocationFromWifi";

const styles = StyleSheet.create({
  sectionContainer: {
    // marginTop: Constants.statusBarHeight + 70,
    // paddingHorizontal: 24,
    flex: 1,
  },
});

export default WifiHandler = ({ setData = () => {} }) => {
  // const [connected, setConneted] = useState({connected: false, ssid: 'S4N'});
  // const [ssid, setSsid] = useState('');
  // const password ="tanenbaum-1981";
  // const isWep = false;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wifiScanInterval, setWifiScanInterval] = useRecoilState(
    wifiScanIntervalState
  );
  const trackWifiScanLocation = useRecoilValue(trackWifiScanLocationState);
  const [wifiData, setWifiData] = useRecoilState(wifiDataState);
  const setCurrentPosition = useSetRecoilState(currentPositionState);
  const listWifi = async ({ force = false }) => {
    try {
      // console.log("force: ", force);
      setLoading(true);
      setError(null);
      setWifiData([]);

      if (!(await checkPermission())) {
        return;
      }
      // console.log("=== LIST WIFI");
      let list = [];
      if (force) {
        list = await WifiManager.reScanAndLoadWifiList();
      } else {
        list = await WifiManager.loadWifiList();
      }

      // if result list is text (some error)
      if (typeof list == "string") {
        throw new Error(list);
      }

      // console.log("wifi list:", list);

      const sortList = list.sort(
        (firstItem, secondItem) => secondItem.level - firstItem.level
      );
      setWifiData(sortList);
    } catch (error) {
      console.log("Error (listWifi): ", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkPermission = async () => {
    if (Platform.OS !== "ios") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location permission is required for WiFi connections",
          message:
            "This app needs location permission as this is required  " +
            "to scan for wifi networks.",
          buttonNegative: "DENY",
          buttonPositive: "ALLOW",
        }
      );
      const enabled = await WifiManager.isEnabled();

      if (!enabled) {
        setError("Wifi not enabled");
        WifiManager.setEnabled(true); //set WiFi ON
        return;
      }

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // You can now use react-native-wifi-reborn
        return true;
      } else {
        // Permission denied
        setError("Permission denied");
      }
    } else {
    }

    // try {
    //   const data = await WifiManager.connectToProtectedSSID(
    //     ssid,
    //     password,
    //     isWep,
    //   );
    //   console.log('Connected successfully!', {data});
    //   setConneted({connected: true, ssid});
    // } catch (error) {
    //   setConneted({connected: false, error: error.message});
    //   console.log('Connection failed!', {error});
    // }

    // try {
    //   const ssid = await WifiManager.getCurrentWifiSSID();
    //   setSsid(ssid);
    //   console.log('Your current connected wifi SSID is ' + ssid);
    // } catch (error) {
    //   setSsid('Cannot get current SSID!' + error.message);
    //   console.log('Cannot get current SSID!', {error});
    // }
  };

  // Set continue scaning
  const enableScan = (enable) => {
    if (enable) {
      listWifi({ force: true });
      setWifiScanInterval(
        setInterval(() => {
          listWifi({ force: true });
        }, 32000)
      );
      console.log("=== Enable WifiScanInterval");
    } else {
      setWifiScanInterval(clearInterval(wifiScanInterval));
      console.log("=== Clear WifiScanInterval");
    }
  };

  useEffect(() => {
    enableScan(trackWifiScanLocation);
  }, [trackWifiScanLocation]);

  useEffect(() => {
    if (!wifiData) return;
    // Example find location from wifi
    const mapFindLocation = WIFI_LOCATION_DATA.map((wc) => {
      const searchWd = wifiData
        .filter((wd) => wc.bssid.includes(wd.BSSID))
        .sort((a, b) => b.level - a.level);
      if (searchWd.length > 0) {
        return { ...searchWd[0], ...wc };
      }
      return wc;
    })
      .filter((e) => e.level)
      .sort((a, b) => b.level - a.level);
    const location = findLocationFromWifi(mapFindLocation);
    console.log("=== Result location from wifi:", location);
    if (location && location[0] && location[1]) {
      if (trackWifiScanLocation) {
        // onEstimatedLocation(location);
        setCurrentPosition(() => ({
          coords: { latitude: location[1], longitude: location[0] },
        }));
      }
    }
  }, [wifiData]);

  // useEffect(() => {
  //   wifi({ force: false });
  // }, []);
};

