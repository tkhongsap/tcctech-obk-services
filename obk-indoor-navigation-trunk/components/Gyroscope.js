import { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gyroscope } from "expo-sensors";
import {
  gyroscopeDataState,
  gyroscopeListenerState,
} from "../state/app_recoil_state";
import { useRecoilState } from "recoil";

export default CustomGyroscope = () => {
  const [available, setAvailable] = useState(false);
  const [gyroscopeData, setGyroscopeData] = useRecoilState(gyroscopeDataState);
  const [gyroscopeListener, setGyroscopeListener] = useRecoilState(
    gyroscopeListenerState
  );

  const _slow = () => Gyroscope.setUpdateInterval(1000);
  const _fast = () => Gyroscope.setUpdateInterval(16);

  const _subscribe = () => {
    setGyroscopeListener(
      Gyroscope.addListener((gyroscopeData) => {
        setGyroscopeData(gyroscopeData);
      })
    );
  };

  const _unsubscribe = () => {
    gyroscopeListener && gyroscopeListener.remove();
    setGyroscopeListener(null);
  };

  const checkAvailable = async () => {
    await Gyroscope.requestPermissionsAsync();
    const isAvailid = await Gyroscope.isAvailableAsync();
    setAvailable(isAvailid);
  };

  useEffect(() => {
    checkAvailable();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Gyroscope (Available: {JSON.stringify(available)})
      </Text>
      {gyroscopeData && (
        <>
          <Text style={styles.text}>x: {gyroscopeData.x}</Text>
          <Text style={styles.text}>y: {gyroscopeData.y}</Text>
          <Text style={styles.text}>z: {gyroscopeData.z}</Text>
        </>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={gyroscopeListener ? _unsubscribe : _subscribe}
          style={styles.button}
        >
          <Text>{gyroscopeListener ? "On" : "Off"}</Text>
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

