import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import DemoMapBuilding3d from "./pages/DemoMapBuilding3d";
import WifiDebug from "./components/WifiDebug";
import SensorDebug from "./components/SensorDebug";
import LocationDebug from "./components/LocationDebug";
import { Button } from "@rneui/themed";
import { RecoilRoot } from "recoil";
// import ArScene from "./components/ArScene";

export default function App() {
  const [showWifiDebug, setShowWifiDebug] = useState(false);
  const [showSensor, setShowSensor] = useState(false);
  const [showGPS, setShowGPS] = useState(false);
  const [wifiData, setWifiData] = useState([]);
  const [showAr, setShowAr] = useState(false);

  return (
    <RecoilRoot>
      <View style={styles.container}>
        {/* {showAr && <ArScene />} */}
        {/* <LocationDebug show={showGPS} />
        <SensorDebug show={showSensor} />
        <WifiDebug
          show={showWifiDebug}
          setData={(e) => {
            setWifiData(e);
          }}
        /> */}
        <DemoMapBuilding3d wifiData={wifiData} />
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            top: 40,
            right: 15,
            gap: 5,
          }}
        >
          {/* <Button
            title="AR"
            {...actionBtnStyle}
            onPress={() => {
              setShowWifiDebug(false);
              setShowSensor(false);
              setShowGPS(false);
              setShowAr(!showAr);
            }}
          /> */}
          {/* <Button
            title="GPS"
            {...actionBtnStyle}
            onPress={() => {
              setShowWifiDebug(false);
              setShowSensor(false);
              setShowAr(false);
              setShowGPS(!showGPS);
            }}
          />
          <Button
            title="Sensor"
            {...actionBtnStyle}
            onPress={() => {
              setShowWifiDebug(false);
              setShowGPS(false);
              setShowAr(false);
              setShowSensor(!showSensor);
            }}
          />
          <Button
            title="Wifi debug"
            {...actionBtnStyle}
            onPress={() => {
              setShowSensor(false);
              setShowGPS(false);
              setShowAr(false);
              setShowWifiDebug(!showWifiDebug);
            }}
          /> */}
        </View>
        <StatusBar style="auto" />
      </View>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  buttonStyle: {
    color: "red",
    titleStyle: { color: "red" },
    borderWidth: 1,
    borderColor: "#ff0000",
    backgroundColor: "rgb(244, 244, 244)",
  },
});

const actionBtnStyle = {
  buttonStyle: {
    borderWidth: 1,
    borderColor: "#ff0000",
    backgroundColor: "rgb(244, 244, 244)",
  },
  titleStyle: { color: "black" },
};

