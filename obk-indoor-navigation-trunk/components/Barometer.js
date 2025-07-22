import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { Barometer } from "expo-sensors";
import {
  barometerDataState,
  barometerListenerState,
} from "../state/app_recoil_state";
import { useRecoilState } from "recoil";

export default CustomBarometer = () => {
  const [{ pressure, relativeAltitude }, setData] = useState({
    pressure: 0,
    relativeAltitude: 0,
  });
  const [barometerData, setBarometerData] = useRecoilState(barometerDataState);
  const [barometerListener, setBarometerListener] = useRecoilState(
    barometerListenerState
  );
  const [available, setAvailable] = useState(false);
  const toggleListener = () => {
    barometerListener ? unsubscribe() : subscribe();
  };

  const subscribe = () => {
    setBarometerListener(
      Barometer.addListener((data) => {
        setBarometerData(data);
      })
    );
  };

  const unsubscribe = () => {
    barometerListener && barometerListener.remove();
    setBarometerListener(null);
  };

  const checkAvailable = async () => {
    await Barometer.requestPermissionsAsync();
    const isAvailid = await Barometer.isAvailableAsync();
    setAvailable(isAvailid);
  };

  useEffect(() => {
    checkAvailable();
  }, []);

  return (
    <View style={styles.wrapper}>
      <Text>Barometer (Available: {JSON.stringify(available)})</Text>
      <Text>Listener: {barometerListener ? "ACTIVE" : "INACTIVE"}</Text>
      <Text>Pressure: {barometerData?.pressure} hPa</Text>
      <Text>
        Relative Altitude:{" "}
        {Platform.OS === "ios"
          ? `${barometerData?.relativeAltitude} m`
          : `Only available on iOS`}
      </Text>
      <TouchableOpacity onPress={toggleListener} style={styles.button}>
        <Text>Toggle listener</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
    marginTop: 15,
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
  },
});

