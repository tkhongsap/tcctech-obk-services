import { useEffect, useImperativeHandle, forwardRef } from "react";
import * as Location from "expo-location";
import {
  locationDataState,
  locationListenerState,
  watchPositionState,
  updateLocationMapState,
  currentPositionState,
  switchLocationWhenAccuracyState,
  trackWifiScanLocationState,
  trackLocationSensorState,
} from "../state/app_recoil_state";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export default LocationComponent = forwardRef(({ onError = () => {} }, ref) => {
  const [locationData, setLocationData] = useRecoilState(locationDataState);
  const [locationListener, setLocationListener] = useRecoilState(
    locationListenerState
  );
  const [watchPosition, setWatchPosition] = useRecoilState(watchPositionState);
  const [updateLocationMap, setUpdateLocationMap] = useRecoilState(
    updateLocationMapState
  );
  const setCurrentPosition = useSetRecoilState(currentPositionState);
  const switchLocationWhenAccuracy = useRecoilValue(
    switchLocationWhenAccuracyState
  );
  const setTrackWifiScanLocation = useSetRecoilState(
    trackWifiScanLocationState
  );
  const setEnableTrackLocationSensor = useSetRecoilState(
    trackLocationSensorState
  );
  useImperativeHandle(ref, () => ({}));

  const requestPermission = async () => {
    onError(null);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      onError("Permission to access location was denied");
    }
  };

  const watchLocation = async () => {
    try {
      await requestPermission();
      setLocationListener(
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
          },
          async (location) => {
            setLocationData(location);
          }
        )
      );
    } catch (e) {
      onError(JSON.stringify(e));
      setWatchPosition(false);
    }
  };

  // useEffect(() => {
  //   console.log(locationData);
  //   if (
  //     switchLocationWhenAccuracy &&
  //     locationData?.accuracy < switchLocationWhenAccuracy
  //   ) {
  //     setUpdateLocationMap(true);
  //   }
  // }, [switchLocationWhenAccuracy]);

  // update current position
  useEffect(() => {
    if (locationData) {
      if (switchLocationWhenAccuracy) {
        if (locationData?.coords?.accuracy < switchLocationWhenAccuracy) {
          setUpdateLocationMap(true);
          setCurrentPosition(locationData);
        } else {
          setUpdateLocationMap(false);
          setTrackWifiScanLocation(true);
          setEnableTrackLocationSensor(true);
        }
        return;
      }

      if (updateLocationMap) {
        setCurrentPosition(locationData);
      }
    }
  }, [locationData]);

  const stopWatch = () => {
    if (locationListener) {
      locationListener.remove();
      setLocationListener(null);
    }
  };

  useEffect(() => {
    if (watchPosition) {
      watchLocation();
    } else {
      stopWatch();
    }
    return stopWatch();
  }, [watchPosition]);
});

