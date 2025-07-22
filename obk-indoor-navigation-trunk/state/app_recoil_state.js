import { atom, selector } from "recoil";

const accelerometerListenerState = atom({
  key: "AccelerometerListener",
  default: null,
});

const accelerometerDataState = atom({
  key: "Accelerometer",
  default: null,
});

const gyroscopeListenerState = atom({
  key: "GyroscopeListener",
  default: null,
});

const gyroscopeDataState = atom({
  key: "GyroscopeData",
  default: null,
});

const magnetometerListenerState = atom({
  key: "MagnetometerListener",
  default: null,
});

const magnetometerDataState = atom({
  key: "MagnetometerData",
  default: null,
});

const barometerListenerState = atom({
  key: "BarometerListener",
  default: null,
});

const barometerDataState = atom({
  key: "BarometerData",
  default: null,
});

const locationListenerState = atom({
  key: "LocationListener",
  default: null,
});

const watchPositionState = atom({
  key: "WatchPosition",
  default: false,
});

const locationDataState = atom({
  key: "LocationData",
  default: null,
});

const currentPositionState = atom({
  key: "CurrentPosition",
  default: null,
});

const updateLocationMapState = atom({
  key: "UpdateLocationMap",
  default: false,
});

const wifiScanIntervalState = atom({
  key: "WifiScanInterval",
  default: null,
});

const trackWifiScanLocationState = atom({
  key: "TrackWifiScanLocation",
  default: false,
});

const trackLocationSensorState = atom({
  key: "TrackLocationSensor",
  default: false,
});

const keySourceState = atom({
  key: "KeySource",
  default: "",
});

const showBorderSourceState = atom({
  key: "ShowBorderSource",
  default: false,
});

const switchLocationWhenAccuracyState = atom({
  key: "SwitchLocationWhenAccuracy",
  default: null,
});

const wifiDataState = atom({
  key: "WifiData",
  default: null,
});

// const initailLatlngDirectionState = atom({
//   key: "InitailLatlngDirection",
//   default: null,
// });

export {
  accelerometerDataState,
  accelerometerListenerState,
  gyroscopeDataState,
  gyroscopeListenerState,
  magnetometerListenerState,
  magnetometerDataState,
  barometerListenerState,
  barometerDataState,
  locationListenerState,
  currentPositionState,
  updateLocationMapState,
  wifiScanIntervalState,
  trackLocationSensorState,
  trackWifiScanLocationState,
  keySourceState,
  showBorderSourceState,
  locationDataState,
  watchPositionState,
  switchLocationWhenAccuracyState,
  wifiDataState,
};

