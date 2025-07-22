import { useEffect, useState, useRef } from "react";
import { Accelerometer, Gyroscope } from "expo-sensors";
import { useRecoilState } from "recoil";
import {
  accelerometerListenerState,
  currentPositionState,
  gyroscopeListenerState,
  trackLocationSensorState,
} from "../state/app_recoil_state";
import CompassHeading from "react-native-compass-heading";

const stepThreshold = 1.1; // threshold for step detection in m/s^2 on the z-axis
const stepLength = 0.4; // average step length in meters
const updateInterval = 100; // update interval in milliseconds
const radiansToDegrees = 180 / Math.PI; // conversion factor

export default a = () => {
  const [enableTrackLocation, setEnableTrackLocation] = useRecoilState(
    trackLocationSensorState
  );
  const [accelerometerListener, setAccelerometerListener] = useRecoilState(
    accelerometerListenerState
  );
  const [gyroscopeListener, setGyroscopeListener] = useRecoilState(
    gyroscopeListenerState
  );

  const [position, setPosition] = useState(null);

  const [currentPosition, setCurrentPosition] = useRecoilState(currentPositionState);
  //   const [updateLocationMap, setUpdateLocationMap] = useRecoilState(
  //     updateLocationMapState
  //   );
  const orientation = useRef(0); // orientation in degrees
  const [accelerationSubscription, setAccelerationSubscription] =
    useState(null);
  const [gyroscopeSubscription, setGyroscopeSubscription] = useState(null);
  const [compassHeadingSubscription, setCompassHeadingSubscription] =
    useState(null);

  const checkAcceleroAvailable = async () => {
    await Accelerometer.requestPermissionsAsync();
    return await Accelerometer.isAvailableAsync();
  };

  const checkGyroscopeAvailable = async () => {
    await Gyroscope.requestPermissionsAsync();
    return await Gyroscope.isAvailableAsync();
  };

  async function run() {
    if (enableTrackLocation) {
      console.log("=== enable enableTrackLocation");
      //   await prepare();
      if (
        (await checkAcceleroAvailable()) &&
        (await checkGyroscopeAvailable())
      ) {
        // reset if listener debug
        accelerometerListener && accelerometerListener.remove();
        setAccelerometerListener(null);

        gyroscopeListener && gyroscopeListener.remove();
        setGyroscopeListener(null);
      } else {
        console.log("=== Prepare location sensor error");
        return null;
      }

      if (!currentPosition) {
        setCurrentPosition(() => ({
          coords: {
            latitude: 13.726075,
            longitude: 100.5462256,
          },
        }));
      }

      Accelerometer.setUpdateInterval(updateInterval);
      setAccelerationSubscription(() =>
        Accelerometer.addListener(({ x, y, z }) => {
          setCurrentPosition((prevLoc) => {
            if (z > stepThreshold && prevLoc) {
              // Simple step detection based on Z axis acceleration
              // Calculate new position in terms of latitude and longitude
              const radius = (orientation.current * Math.PI) / 180;
              const distancex = stepLength * Math.sin(radius);
              const distancey = stepLength * Math.cos(radius);
              const deltaLat = ((distancey / 6378137) * 180) / Math.PI;
              const deltaLon =
                ((distancex /
                  (6378137 *
                    Math.cos((Math.PI * prevLoc.coords.latitude) / 180))) *
                  180) /
                Math.PI;

              //const deltaLat =
              //  (stepLength * Math.cos((orientation.current * Math.PI) / 180)) /
              //  111000;
              //const deltaLon =
              //  (stepLength * Math.sin((orientation.current * Math.PI) / 180)) /
              //  (111000 * Math.cos((prevPos.latitude * Math.PI) / 180));

              return {
                coords: {
                  latitude: prevLoc.coords.latitude + deltaLat,
                  longitude: prevLoc.coords.longitude + deltaLon,
                },
              };
            }
            return prevLoc;
          });
        })
      );

      //   Gyroscope.setUpdateInterval(updateInterval);
      //   setGyroscopeSubscription(
      //     Gyroscope.addListener(({ x, y, z }) => {
      //       const orientationChange =
      //         ((z * updateInterval) / 1000) * radiansToDegrees; // Convert angular velocity to degrees

      //       setOrientation(
      //         (prevOrientation) =>
      //           (prevOrientation + orientationChange + 360) % 360
      //       );
      //     })
      //   );

      const degree_update_rate = 3;

      setCompassHeadingSubscription(
        CompassHeading.start(degree_update_rate, ({ heading, accuracy }) => {
          orientation.current = heading;
        })
      );
    } else {
      accelerationSubscription && accelerationSubscription.remove();
      gyroscopeSubscription && gyroscopeSubscription.remove();
      CompassHeading.stop();
    }
  }

  useEffect(() => {
    if (position) setCurrentPosition(() => ({ coords: position }));
  }, [position]);

  useEffect(() => {
    run();

    return () => {
      accelerationSubscription && accelerationSubscription.remove();
      gyroscopeSubscription && gyroscopeSubscription.remove();
      CompassHeading.stop();
    };
  }, [enableTrackLocation]);
};

