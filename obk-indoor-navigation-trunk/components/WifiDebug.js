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
} from "../state/app_recoil_state";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";

const styles = StyleSheet.create({
  sectionContainer: {
    // marginTop: Constants.statusBarHeight + 70,
    // paddingHorizontal: 24,
    flex: 1,
  },
});

export default WifiDebug = ({ show, setData = () => {} }) => {
  // const [connected, setConneted] = useState({connected: false, ssid: 'S4N'});
  // const [ssid, setSsid] = useState('');
  // const password ="tanenbaum-1981";
  // const isWep = false;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trackWifiScanLocation, setTrackWifiScanLocation] = useRecoilState(
    trackWifiScanLocationState
  );
  const [wifiData, setWifiData] = useRecoilState(wifiDataState);

  const saveWifi = async () => {
    const json = JSON.stringify(wifiData);
    const res = await axios.post(
      "https://smart-1.dft.go.th/Api/RegisterFile/TestSaveWifi",
      { data: json }
    );
  };

  const listWifi = async ({ force = false }) => {
    try {
      // console.log("force: ", force);
      setLoading(true);
      setError(null);
      setWifiData([]);
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

  const wifi = async ({ force = false }) => {
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
        listWifi({ force });
      } else {
        // Permission denied
        setError("Permission denied");
      }
    } else {
    }
  };

  return (
    show && (
      <View style={styles.sectionContainer}>
        <View>
          <ScrollView horizontal={true}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Button
                title="Save"
                buttonStyle={{
                  backgroundColor: "rgb(244, 244, 244)",
                }}
                titleStyle={{ color: "black" }}
                onPress={() => {
                  saveWifi();
                }}
              />
              <Button
                title="Refresh"
                buttonStyle={{
                  backgroundColor: "rgb(244, 244, 244)",
                }}
                titleStyle={{ color: "black" }}
                onPress={() => {
                  // setShowWifiDebug(!showWifiDebug);
                  wifi({ force: false });
                }}
              />
              <Button
                title="Force Refresh"
                buttonStyle={{
                  backgroundColor: "rgb(244, 244, 244)",
                }}
                titleStyle={{ color: "black" }}
                onPress={() => {
                  // setShowWifiDebug(!showWifiDebug);
                  wifi({ force: true });
                }}
              />
              <Button
                title={
                  !!trackWifiScanLocation ? "Disable Track" : "Enable Track"
                }
                buttonStyle={{
                  backgroundColor: !!trackWifiScanLocation
                    ? "rgb(255, 87, 51)"
                    : "rgb(244, 244, 244)",
                }}
                titleStyle={{ color: "black" }}
                onPress={() => setTrackWifiScanLocation(!trackWifiScanLocation)}
              />
            </View>
          </ScrollView>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView>
            {error && <Text>{error}</Text>}
            {loading ? (
              <Text style={{ textAlign: "center", marginTop: 100 }}>
                Loading...
              </Text>
            ) : (
              wifiData &&
              wifiData.map((e) => (
                <View key={e.BSSID} style={{ marginVertical: 10 }}>
                  <Text style={{ color: "blue" }}>{e.SSID}</Text>
                  <Text>{JSON.stringify(e)}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    )
  );
};

