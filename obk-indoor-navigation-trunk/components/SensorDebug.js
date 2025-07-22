import { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Button } from "@rneui/themed";

import CustomAccelerometer from "./Accelerometer";
import CustomBaroMeter from "./Barometer";
import CustomGyroscope from "./Gyroscope";
import CustomMagnetometer from "./Magnetometer";
import { trackLocationSensorState } from "../state/app_recoil_state";
import { useRecoilState } from "recoil";

const Separator = () => <View style={styles.separator} />;

export default SensorDebug = ({ show }) => {
  const [showAcc, setShowAcc] = useState(true);
  const [showBaro, setShowBaro] = useState(false);
  const [showGyro, setShowGyro] = useState(false);
  const [showMag, setShowMag] = useState(false);
  const [enableTrackLocation, setEnableTrackLocation] = useRecoilState(
    trackLocationSensorState
  );

  return (
    show && (
      <View style={styles.container}>
        <View style={{ gap: 2, flexDirection: "row", flexWrap: "wrap" }}>
          <Button
            onPress={() => {
              setShowAcc(!showAcc);
              setShowBaro(false);
              setShowGyro(false);
              setShowMag(false);
            }}
          >
            Accelerometer
          </Button>
          <Button
            onPress={() => {
              setShowAcc(false);
              setShowBaro(!showBaro);
              setShowGyro(false);
              setShowMag(false);
            }}
          >
            BaroMeter
          </Button>
          <Button
            onPress={() => {
              setShowAcc(false);
              setShowBaro(false);
              setShowGyro(!showGyro);
              setShowMag(false);
            }}
          >
            Gyroscope
          </Button>
          <Button
            onPress={() => {
              setShowAcc(false);
              setShowBaro(false);
              setShowGyro(false);
              setShowMag(!showMag);
            }}
          >
            Magnetometer
          </Button>
          <Button
            title={!!enableTrackLocation ? "Disable Track" : "Enable Track"}
            buttonStyle={{
              backgroundColor: !!enableTrackLocation
                ? "rgb(255, 87, 51)"
                : "rgb(244, 244, 244)",
            }}
            titleStyle={{ color: "black" }}
            onPress={() => {
              setShowAcc(false);
              setShowBaro(false);
              setShowGyro(false);
              setShowMag(false);
              setEnableTrackLocation(!enableTrackLocation);
            }}
          />
        </View>
        <Separator />
        <ScrollView>
          {showAcc && <CustomAccelerometer />}
          {showBaro && <CustomBaroMeter />}
          {showGyro && <CustomGyroscope />}
          {showMag && <CustomMagnetometer />}
        </ScrollView>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 90,
    // height: 260,
    // paddingHorizontal: 20,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

