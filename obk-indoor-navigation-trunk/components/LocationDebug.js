import { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { Button, ListItem, Switch } from "@rneui/themed";
import {
  currentPositionState,
  locationDataState,
  updateLocationMapState,
  watchPositionState,
} from "../state/app_recoil_state";
import { useRecoilState, useSetRecoilState } from "recoil";

const Separator = () => <View style={styles.separator} />;

export default LocationDebug = () => {
  const [loading, setLoading] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const setCurrentPosition = useSetRecoilState(currentPositionState);
  const [hasServicesEnable, setHasServicesEnable] = useState(false);
  const [updateLocationMap, setUpdateLocationMap] = useRecoilState(
    updateLocationMapState
  );

  const [locationData, setLocationData] = useRecoilState(locationDataState);

  const [watchPosition, setWatchPosition] = useRecoilState(watchPositionState);

  const requestPermission = async () => {
    setErrorMsg(null);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
    }
  };

  const getLocation = async () => {
    try {
      setLoading(true);
      await requestPermission();
      let location = await Location.getCurrentPositionAsync({});
      setLocationData(location);
    } catch (e) {
      setErrorMsg(JSON.stringify(e));
    } finally {
      setLoading(false);
    }
  };

  const checkEnable = async () => {
    const enable = await Location.hasServicesEnabledAsync();
    setHasServicesEnable(enable);
  };

  useEffect(() => {
    // (async () => {
    //   // if (Platform.OS === "android") {
    //   //   setErrorMsg(
    //   //     "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
    //   //   );
    //   //   return;
    //   // }
    // })();
    checkEnable();
  }, []);

  return (
    <View style={styles.container}>
      <Text>ServicesEnabled: {JSON.stringify(!!hasServicesEnable)}</Text>
      {loading && <Text>Loading...</Text>}
      {errorMsg && <Text>Error: {errorMsg}</Text>}
      {locationData && <Text>{JSON.stringify(locationData)}</Text>}

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <Button
          containerStyle={{ width: 200 }}
          title="Get Location"
          onPress={getLocation}
        />
      </View>
      <Separator />
      <ListItem
        bottomDivider
        containerStyle={{
          paddingHorizontal: 30,
          backgroundColor: "transparent",
        }}
      >
        <ListItem.Content>
          <ListItem.Title>Watch Position</ListItem.Title>
        </ListItem.Content>
        <Switch
          value={watchPosition}
          onValueChange={(value) => setWatchPosition(value)}
        />
      </ListItem>
      <ListItem
        containerStyle={{
          paddingHorizontal: 30,
          backgroundColor: "transparent",
        }}
      >
        <ListItem.Content>
          <ListItem.Title>Tracking Location</ListItem.Title>
        </ListItem.Content>
        <Switch
          value={updateLocationMap}
          onValueChange={(value) => setUpdateLocationMap(value)}
        />
      </ListItem>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
    zIndex: 20,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

