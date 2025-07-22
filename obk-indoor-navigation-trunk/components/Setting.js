import { View, StyleSheet, ScrollView } from "react-native";
import Constants from "expo-constants";
import { Button, Text, Icon, ListItem, Switch } from "@rneui/themed";
import { useState } from "react";
import WifiDebug from "./WifiDebug";
import SensorDebug from "./SensorDebug";
import LocationDebug from "./LocationDebug";
import SelectSource from "./SelectSource";
import {
  switchLocationWhenAccuracyState,
  trackLocationSensorState,
  trackWifiScanLocationState,
} from "../state/app_recoil_state";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { Divider } from "@rneui/base";

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    zIndex: 100,
    position: "absolute",
    backgroundColor: "#fff",
    top: 10,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 10,
    opacity: 0.8,
  },
});

export default Setting = ({ close = () => {} }) => {
  const sectionComponent = [
    {
      title: "Wifi",
      icon: "wifi",
      expland: true,
      comp: <WifiDebug show={true} />,
    },
    {
      title: "Sensors",
      icon: "sensors",
      expland: true,
      comp: <SensorDebug show={true} />,
    },
    {
      title: "GPS",
      icon: "my-location",
      expland: true,
      comp: <LocationDebug show={true} />,
    },
    {
      title: "Shape Source",
      icon: "format-shapes",
      comp: <SelectSource />,
    },
    {
      title: "Switch Location follow accuracy",
      switchValue: useRecoilValue(switchLocationWhenAccuracyState),
      switchChange: (v) => {
        if (v) {
          setEnableTrackLocationSensor(false);
          setTrackWifiScanLocation(false);
        }
        setSwitchLocationWhenAccuracy(v ? 10 : null);
      },
    },
  ];

  const [expandedData, setExpandedData] = useState(
    sectionComponent.filter((s) => s.expland).map(() => false)
  );
  const [subPage, setSubPage] = useState(null);
  const setSwitchLocationWhenAccuracy = useSetRecoilState(
    switchLocationWhenAccuracyState
  );
  const setEnableTrackLocationSensor = useSetRecoilState(
    trackLocationSensorState
  );
  const setTrackWifiScanLocation = useSetRecoilState(
    trackWifiScanLocationState
  );

  return (
    <View style={styles.container}>
      <Button
        icon={{
          name: "close",
          size: 30,
        }}
        size="sm"
        buttonStyle={{
          //   backgroundColor: "rgba(100, 100, 100, 0.2)",
          borderRadius: 60,
        }}
        type="clear"
        containerStyle={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
        }}
        onPress={() => {
          setSubPage(null);
          close();
        }}
      />
      {subPage ? (
        <>
          <View
            style={{
              margin: 15,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon
              name="keyboard-arrow-left"
              size={35}
              style={{ borderRadius: 35 }}
              containerStyle={{ marginLeft: -10 }}
              onPress={() => setSubPage(null)}
            />
            <Text style={{ fontSize: 18 }}>{subPage.title}</Text>
          </View>
          <ScrollView style={{ paddingHorizontal: 20 }}>
            {subPage.comp}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={{ margin: 15 }}>
            <Text style={{ fontSize: 18 }}>Setting</Text>
          </View>
          <ScrollView style={{ paddingHorizontal: 20 }}>
            {sectionComponent.map((sc, i) =>
              sc.comp ? (
                <ListItem.Accordion
                  containerStyle={{
                    margin: 0,
                    paddingHorizontal: 0,
                    backgroundColor: "transparent",
                  }}
                  key={i}
                  content={
                    <>
                      <Icon
                        name={sc.icon}
                        size={28}
                        style={{ marginRight: 4 }}
                      />
                      <ListItem.Content>
                        <ListItem.Title>{sc.title}</ListItem.Title>
                      </ListItem.Content>
                    </>
                  }
                  noIcon={!sc.expland}
                  isExpanded={expandedData[i]}
                  onPress={() => {
                    if (sc.expland) {
                      setExpandedData((prev) => {
                        const data = prev;
                        data[i] = !prev[i];
                        return [...data];
                      });
                      return;
                    }

                    if (sc.comp) {
                      setSubPage(sc);
                    }
                    sc.onPress && sc.onPress();
                  }}
                >
                  <View style={{ zIndex: 10, paddingBottom: 20 }}>
                    {sc.comp}
                  </View>
                  <Divider />
                </ListItem.Accordion>
              ) : (
                <ListItem
                  key={i}
                  containerStyle={{
                    margin: 0,
                    paddingHorizontal: 30,
                    backgroundColor: "transparent",
                  }}
                  bottomDivider
                >
                  <ListItem.Content>
                    <ListItem.Title>{sc.title}</ListItem.Title>
                  </ListItem.Content>
                  {sc.switchChange && (
                    <Switch
                      value={!!sc.switchValue}
                      onValueChange={sc.switchChange}
                    />
                  )}
                </ListItem>
              )
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

