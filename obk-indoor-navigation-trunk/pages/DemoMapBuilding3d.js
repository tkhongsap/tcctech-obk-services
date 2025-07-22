import { useEffect, useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import Mapbox from "@rnmapbox/maps";
// import { Slider } from "@rneui/base";
import sheet from "../styles/sheet";
import { ButtonGroup, Icon, Button, color } from "@rneui/base";
import { CurrentMarker } from "../components/CurrentMarker";
// import LineLayerExample from "../components/LineLayerExample";
import PinMarker from "../components/PinMarker";
import WirelessMarker from "../components/WirelessMarker";
import WifiHandler from "../components/WifiHandler";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  updateLocationMapState,
  currentPositionState,
  trackLocationSensorState,
  trackWifiScanLocationState,
  keySourceState,
  showBorderSourceState,
  switchLocationWhenAccuracyState,
} from "../state/app_recoil_state";
import DialogDetail from "../components/DialogDetail";
// import ShopsMarker from "../components/ShopsMarker";
import TrackLocationSensor from "../components/TrackLocationSensor";
import CheckPointsWithinPolygon from "../components/CheckPointsWithinPolygon";
import SettingView from "../components/Setting";
import LocationComponent from "../components/LocationHandler";
import mapKeyGeojson from "../utils/mapKeyGeojson";

Mapbox.setAccessToken(
  "pk.eyJ1IjoiYW5na2FybiIsImEiOiJjamNsZmZhdHAwOW9lMnluM3JvdnZ0ZDRqIn0.e2XtXpUTNRwj__dWvXCJQQ"
);
Mapbox.setTelemetryEnabled(false);

const lineLayerStyle = {
  lineColor: "#000000",
  lineWidth: 1,
};

const styles = StyleSheet.create({
  slider: {
    alignItems: "stretch",
    flex: 1,
    justifyContent: "center",
    maxHeight: 60,
    paddingHorizontal: 24,
  },
  page: {
    flex: 1,
    zIndex: 0,
  },
  container: {
    flex: 1,
  },
  lineLayer: {
    lineCap: "round",
    lineJoin: "round",
    lineOpacity: 0.6,
    lineColor: "rgb(53, 175, 109)",
    lineWidth: 2.0,
  },
});

const layerStyles = {
  building: {
    fillExtrusionOpacity: 0.5,
    fillExtrusionHeight: ["get", "height"],
    fillExtrusionBase: ["get", "base_height"],
    fillExtrusionColor: ["get", "color"],
    // fillExtrusionColorTransition: {duration: 2000, delay: 0},
  },
};

const DemoMapBuilding3d = () => {
  const camera = useRef(null);
  function onSliderChange(value) {
    setSliderValue(value);
  }

  const INITIAL_COORDINATES = [[100.546279440235, 13.726098033992884]];

  const [pinPoint, setPinPoint] = useState([
    100.546279440235, 13.726098033992884,
  ]);
  const [markerCurrentPosition, setMarkerCurrentPosition] = useState(
    INITIAL_COORDINATES[0]
  );
  const [allowOverlapWithPuck, setAllowOverlapWithPuck] = useState(false);
  const [sliderValue, setSliderValue] = useState(-80);
  const [shapeSource, setShapeSource] = useState(mapKeyGeojson["b1_2"].default);
  const [outdoorShapeSource, setOutdoorShapeSource] = useState(
    mapKeyGeojson["obk_outdoor"].default
  );
  const [shapeSourceSelected, setShapeSourceSelected] = useState("b1_2");
  const [indoorSourceSelected, setIndoorSourceSelected] = useState("b1_2");

  const [selectedIndex, setSelectedIndex] = useState(2);
  const [updateLocationMap, setUpdateLocationMap] = useRecoilState(
    updateLocationMapState
  );
  const [currentPosition, setCurrentPosition] =
    useRecoilState(currentPositionState);
  const [camToggle, setCamToggle] = useState(false);
  const [showDetail, setShowDetail] = useState(null);

  const [enableTrackLocationSensor, setEnableTrackLocationSensor] =
    useRecoilState(trackLocationSensorState);
  const [trackWifiScanLocation, setTrackWifiScanLocation] = useRecoilState(
    trackWifiScanLocationState
  );
  const [openSetting, setOpenSetting] = useState(false);
  const keySource = useRecoilValue(keySourceState);
  const showBorderSource = useRecoilValue(showBorderSourceState);
  const switchLocationWhenAccuracy = useRecoilValue(
    switchLocationWhenAccuracyState
  );
  const [multiSources, setMultiSources] = useState([]);

  const listGeojson = ["", "b1_2"];
  const onSelectFloor = (selectedIdx) => {
    setSelectedIndex(selectedIdx);
    const key = listGeojson[selectedIdx];
    const geojson = mapKeyGeojson[key]?.default || null;
    setShapeSource(geojson);
    setShapeSourceSelected(key);
  };

  const onPressMap = (e) => {
    console.log("map:", e);
    setShowDetail(null);
    const coord = e.geometry.coordinates;
    // setCurrentPosition(() => ({
    //   coords: { latitude: coord[1], longitude: coord[0] },
    // }));
    setMarkerCurrentPosition(() => [coord[0], coord[1]]);
  };

  const onPressShapeSource = (e) => {
    console.log("shap:", e);
    setShowDetail(e?.features[0]?.properties?.detail || null);
    // setCurrentPosition(() => ({
    //   coords: e.coordinates,
    // }));
    setMarkerCurrentPosition(() => [
      e.coordinates.longitude,
      e.coordinates.latitude,
    ]);
  };

  // set key source from global state
  useEffect(() => {
    if (keySource) {
      setMultiSources([
        {
          key: keySource,
          shape: mapKeyGeojson[keySource].default,
        },
      ]);
      setShapeSourceSelected(keySource);
    }
  }, [keySource]);

  // show/hide border is pair of current source
  useEffect(() => {
    if (showBorderSource) {
      setMultiSources([
        {
          key: shapeSourceSelected,
          shape: mapKeyGeojson[shapeSourceSelected].border,
        },
      ]);
    } else {
      setMultiSources([
        {
          key: shapeSourceSelected,
          shape: mapKeyGeojson[shapeSourceSelected].default,
        },
      ]);
    }
  }, [showBorderSource]);

  const onPressWifi = (e) => {
    console.log("wifi:", e);
    setShowDetail({
      title: `(${e.id}) ${e.SSID || ""}`,
      content: `level: ${e.level || "-"}\n${e.cod.join(", ")}`,
    });
  };

  const checkPointOutdoor = async () => {
    console.log("! checkPointOutdoor")
    const sourcesPointOn = [];
    for ([key, value] of Object.entries(mapKeyGeojson)) {
      const polygon = value.border?.geometry?.coordinates;
      if (!polygon) continue;
      const result = await CheckPointsWithinPolygon(
        markerCurrentPosition,
        polygon
      );
      if (result.features.length != 0) {
        sourcesPointOn.push({ key, shape: value.default });
      }
    }

    if (sourcesPointOn.length > 0) {
      setMultiSources(sourcesPointOn);
    } else {
      // set outdoor
      setMultiSources([
        {
          key: "obk_outdoor",
          shape: mapKeyGeojson["obk_outdoor"].default,
        },
      ]);
    }
  };

  // Watch and update location (gps|sensor) to map
  useEffect(() => {
    console.log("Watch and update location (gps|sensor) to map")
    if (
      (updateLocationMap ||
        enableTrackLocationSensor ||
        trackWifiScanLocation) &&
      currentPosition
    ) {
      setMarkerCurrentPosition(() => [
        currentPosition.coords.longitude,
        currentPosition.coords.latitude,
      ]);
    }
  }, [
    updateLocationMap,
    currentPosition,
    enableTrackLocationSensor,
    trackWifiScanLocation,
  ]);

  // disable track location when wifi scan or sersor track is enabled
  useEffect(() => {
    if (enableTrackLocationSensor || trackWifiScanLocation) {
      setUpdateLocationMap(false);
    }
  }, [enableTrackLocationSensor, trackWifiScanLocation]);

  // disable track wifi and sensor when location track is enabled
  useEffect(() => {
    if (updateLocationMap) {
      setEnableTrackLocationSensor(false);
      setTrackWifiScanLocation(false);
    }
  }, [updateLocationMap]);

  useEffect(() => {
    checkPointOutdoor();
  }, [markerCurrentPosition]);

  return (
    <>
      <LocationComponent />
      <WifiHandler />
      <TrackLocationSensor />

      <View style={styles.page}>
        <View style={styles.container}>
          <Mapbox.MapView
            ref={(ref) => (this.map = ref)}
            style={sheet.matchParent}
            styleURL={Mapbox.StyleURL.Light}
            onPress={onPressMap}
            attributionEnabled={false}
            logoEnabled={false}
          >
            <Mapbox.Camera
              ref={camera}
              zoomLevel={18}
              pitch={0}
              heading={0}
              animationDuration={0}
              centerCoordinate={INITIAL_COORDINATES[0]}
            />

            {/*<ShopsMarker selected={setShowDetail} />*/}

            <Mapbox.MarkerView
              coordinate={markerCurrentPosition}
              allowOverlap={true}
            >
              <CurrentMarker />
            </Mapbox.MarkerView>

            {pinPoint && <PinMarker coordinate={pinPoint} />}

            <WirelessMarker onSelected={onPressWifi} />

             {outdoorShapeSource && (
              <Mapbox.ShapeSource id="outdoor" shape={outdoorShapeSource}>
                <Mapbox.FillExtrusionLayer
                  id="outdoorFillLayer"
                  style={layerStyles.building}
                />
                <Mapbox.LineLayer id="outdoorline" style={lineLayerStyle} />
              </Mapbox.ShapeSource>
            )} 
            {/* {shapeSource && (
              <Mapbox.ShapeSource
                id="indoorBuildingSource"
                shape={shapeSource}
                onPress={onPressShapeSource}
              >
                <Mapbox.FillExtrusionLayer
                  id="indoorFillLayer"
                  style={layerStyles.building}
                />
                <Mapbox.LineLayer id="indoorline" style={lineLayerStyle} />
              </Mapbox.ShapeSource>
            )} */}

            {multiSources.length > 0 &&
              multiSources.map((e) => (
                <Mapbox.ShapeSource
                  key={e.key}
                  id={e.key}
                  shape={e.shape}
                  onPress={onPressShapeSource}
                >
                  <Mapbox.FillExtrusionLayer
                    id={"indoorFillLayer" + e.key}
                    style={layerStyles.building}
                  />
                  <Mapbox.LineLayer
                    id={"indoorline" + e.key}
                    style={lineLayerStyle}
                  />
                </Mapbox.ShapeSource>
              ))}
          </Mapbox.MapView>

          <DialogDetail data={showDetail} close={() => setShowDetail(null)} />

          <Icon
            raised
            name="visibility"
            color="#2196f3"
            onPress={() => {
              camToggle
                ? camera.current?.setCamera({
                    pitch: 0,
                    heading: 0,
                    centerCoordinate: INITIAL_COORDINATES[0],
                    zoomLevel: 18,
                    animationDuration: 700,
                  })
                : camera.current?.setCamera({
                    pitch: 50,
                    heading: 30,
                    centerCoordinate: INITIAL_COORDINATES[0],
                    zoomLevel: 18,
                    animationDuration: 700,
                  });
              setCamToggle(!camToggle);
            }}
            containerStyle={{ position: "absolute", bottom: 265, right: 18 }}
          />

          <Icon
            raised
            name="location-searching"
            color="#2196f3"
            onPress={() => {
              camera.current?.setCamera({
                centerCoordinate: markerCurrentPosition,
                animationDuration: 500,
                zoomLevel: 19,
              });
            }}
            containerStyle={{
              position: "absolute",
              bottom: 200,
              right: 18,
            }}
          />

          <ButtonGroup
            buttonStyle={{ width: 50 }}
            buttonContainerStyle={{}}
            buttons={["G", "B1"]}
            containerStyle={{ position: "absolute", bottom: 40, right: 15 }}
            disabledStyle={{}}
            disabledTextStyle={{}}
            disabledSelectedStyle={{}}
            disabledSelectedTextStyle={{}}
            innerBorderStyle={{}}
            onPress={onSelectFloor}
            selectedButtonStyle={{}}
            selectedIndex={selectedIndex}
            selectedTextStyle={{}}
            textStyle={{}}
            vertical
          />

          {/* <Button
            title="Outdoor Check"
            size="xs"
            color="grey"
            containerStyle={{ position: "absolute", top: 120, right: 30 }}
            onPress={() => {
              console.log({ markerCurrentPosition });
              checkPointOutdoor();
            }}
          /> */}

          <Button
            icon={{
              name: "menu",
              size: 30,
              color: "white",
            }}
            size="xs"
            buttonStyle={{
              backgroundColor: "rgba(100, 100, 100, 0.3)",
              padding: 5,
              borderRadius: 8,
            }}
            containerStyle={{ position: "absolute", top: 50, right: 30 }}
            onPress={() => setOpenSetting(!openSetting)}
          />

          {/* <View style={styles.slider}>
            <Slider
              value={sliderValue}
              onValueChange={onSliderChange}
              thumbTintColor={colors.primary.blue}
              minimumValue={-180}
              maximumValue={180}
              thumbTouchSize={{ width: 44, height: 44 }}
              maximumTrackTintColor={colors.secondary.purpleLight}
              minimumTrackTintColor={colors.secondary.purpleDark}
            />
          </View> */}
        </View>
      </View>
      {openSetting && <SettingView close={() => setOpenSetting(false)} />}
    </>
  );
};

export default DemoMapBuilding3d;

