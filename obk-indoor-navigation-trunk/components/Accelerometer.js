import { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Accelerometer } from "expo-sensors";
import { useRecoilState } from "recoil";
import {
  accelerometerDataState,
  accelerometerListenerState,
} from "../state/app_recoil_state";

export default CustomAccelerometer = () => {
  const [available, setAvailable] = useState(false);
  const [accelerometerData, setAccelerometerData] = useRecoilState(
    accelerometerDataState
  );
  const [accelerometerListener, setAccelerometerListener] = useRecoilState(
    accelerometerListenerState
  );
  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(16);

  const _subscribe = () => {
    // Accelerometer.setUpdateInterval(200);
    setAccelerometerListener(
      Accelerometer.addListener((e) => {
        return setAccelerometerData(() => ({
          timestamp: Date.now(),
          acceleration: e,
        }));
      })
    );
  };

  const _unsubscribe = () => {
    accelerometerListener && accelerometerListener.remove();
    setAccelerometerListener(null);
  };

  const checkAvailable = async () => {
    await Accelerometer.requestPermissionsAsync();
    const isAvailid = await Accelerometer.isAvailableAsync();
    setAvailable(isAvailid);
  };

  useEffect(() => {
    checkAvailable();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Accelerometer (Available: {JSON.stringify(available)})
      </Text>
      <Text style={styles.text}>(in gs where 1g = 9.81 m/s^2)</Text>
      {accelerometerData?.acceleration && (
        <>
          <Text style={styles.text}>
            x: {accelerometerData.acceleration?.x}
          </Text>
          <Text style={styles.text}>
            y: {accelerometerData.acceleration?.y}
          </Text>
          <Text style={styles.text}>
            z: {accelerometerData.acceleration?.z}
          </Text>
        </>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={accelerometerListener ? _unsubscribe : _subscribe}
          style={styles.button}
        >
          <Text>{accelerometerListener ? "On" : "Off"}</Text>
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
  text: {
    // textAlign: "center",
  },
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

