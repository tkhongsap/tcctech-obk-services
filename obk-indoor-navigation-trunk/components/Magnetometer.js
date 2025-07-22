import { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Magnetometer } from "expo-sensors";
import {
  magnetometerDataState,
  magnetometerListenerState,
} from "../state/app_recoil_state";
import { useRecoilState } from "recoil";

export default CustomMagnetometer = () => {
  const [magnetometerData, setMagnetometerData] = useRecoilState(
    magnetometerDataState
  );
  const [magnetometerListener, setMagnetometerListener] = useRecoilState(
    magnetometerListenerState
  );
  const [available, setAvailable] = useState(false);

  const _slow = () => Magnetometer.setUpdateInterval(1000);
  const _fast = () => Magnetometer.setUpdateInterval(16);

  const _subscribe = () => {
    setMagnetometerListener(
      Magnetometer.addListener((data) => {
        setMagnetometerData(data);
      })
    );
  };

  const _unsubscribe = () => {
    magnetometerListener && magnetometerListener.remove();
    setMagnetometerListener(null);
  };

  const checkAvailable = async () => {
    await Magnetometer.requestPermissionsAsync();
    const isAvailid = await Magnetometer.isAvailableAsync();
    setAvailable(isAvailid);
  };

  useEffect(() => {
    checkAvailable();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Magnetometer (Available: {JSON.stringify(available)})
      </Text>
      {magnetometerData && (
        <>
          <Text style={styles.text}>x: {magnetometerData.x}</Text>
          <Text style={styles.text}>y: {magnetometerData.y}</Text>
          <Text style={styles.text}>z: {magnetometerData.z}</Text>
        </>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={magnetometerListener ? _unsubscribe : _subscribe}
          style={styles.button}
        >
          <Text>{magnetometerListener ? "On" : "Off"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={_slow}
          style={[styles.button, styles.middleButton]}
        >
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {},
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
});

