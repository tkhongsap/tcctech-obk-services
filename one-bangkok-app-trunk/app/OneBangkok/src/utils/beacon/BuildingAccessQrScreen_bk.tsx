// import dayjs from 'dayjs';
// import {get, isEmpty, isNull} from 'lodash';
// import React, {useCallback, useEffect, useState} from 'react';
// import {Header, modalActions} from '~/components/molecules';
// import QRCodeWidget from '~/components/molecules/QrCode';
// import {QRTokenService} from '~/services/QRTokenService';
// import t from '~/utils/text';
// import ShortCut from '../components/shortcut';
// import {ScrollView} from 'react-native-gesture-handler';
// import {
//   DeviceEventEmitter,
//   NativeEventEmitter,
//   NativeModules,
//   View,
// } from 'react-native';
// import {memberAction} from '../store/member';
// // import beaconUtils from '~/utils/beacon';
// // import {Text} from '~/components/atoms';
// import {request, PERMISSIONS} from 'react-native-permissions';
// import BleManager from 'react-native-ble-manager';
// // import {BleManager} from 'react-native-ble-plx';
// import base64 from 'base-64';
// import RNFetchBlob from 'rn-fetch-blob';
// import {stringToBytes} from 'convert-string';
// // import BeaconManager from 'react-native-beacon-manager';
// // import {
// //   startScan,
// //   stopScan,
// //   checkPermissionsAndStartScan,
// //   Beacon,
// // } from 'react-native-beacon-manager'; // Adjust the path accordingly

// // import Beacons from '@hkpuits/react-native-beacons-manager';

// // const {Beacon} = NativeModules;
// // const beaconsEventEmitter = new NativeEventEmitter(Beacon);

// const beaconWhitelist = ['279a0fa70e457168286ca9667bfce82e'];

// const BuildingAccessQrScreen = () => {
//   const [qrValue, setQrValue] = useState('');
//   const [qrCountdownSeconds, setQrCountdownSeconds] = useState(0);
//   const [qrGenerationTime, setQrGenerationTime] = useState(0);
//   const BleManagerModule = NativeModules.BleManager;
//   const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

//   const generateQrCode = async () => {
//     const qrTokenService = new QRTokenService();
//     const result = await qrTokenService.generate();
//     const qrData = get(result, 'data');

//     if (!isNull(qrData) && !isEmpty(qrData)) {
//       const token = qrData.token;
//       const expirationTimestamp = dayjs(token.expired_date).unix();
//       const generationTimestamp = dayjs().unix();
//       setQrValue(token.id);
//       setQrCountdownSeconds(expirationTimestamp - generationTimestamp);
//       setQrGenerationTime(generationTimestamp);
//     }
//   };

//   const fetchQrCode = useCallback(async () => {
//     const qrTokenService = new QRTokenService();
//     const result = await qrTokenService.get();
//     const qrData = get(result, 'data');

//     if (isNull(qrData) || isEmpty(qrData)) {
//       await generateQrCode();
//     } else {
//       const token = qrData.token;
//       const expirationTimestamp = dayjs(token.expired_date).unix();
//       const generationTimestamp = dayjs().unix();
//       setQrValue(token.id);
//       setQrCountdownSeconds(expirationTimestamp - generationTimestamp);
//       setQrGenerationTime(generationTimestamp);
//     }
//   }, []);

//   const checkPermission = async () => {
//     try {
//       // Request Bluetooth Peripheral permission
//       const bluetoothPermissionResult = await request(
//         PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
//       );
//       console.log(
//         'Bluetooth Peripheral Permission Result:',
//         bluetoothPermissionResult,
//       );

//       // Request Location permission (use either WhenInUse or Always based on your needs)
//       const locationPermissionResult = await request(
//         PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
//       );
//       console.log('Location Permission Result:', locationPermissionResult);

//       // Request Background Location permission if needed
//       const backgroundLocationPermissionResult = await request(
//         PERMISSIONS.IOS.LOCATION_ALWAYS,
//       );
//       console.log(
//         'Background Location Permission Result:',
//         backgroundLocationPermissionResult,
//       );
//     } catch (error) {
//       console.error('Permission Request Error:', error);
//     }
//   };

//   useEffect(() => {
//     // memberAction.getMemberId();
//     fetchQrCode();
//     checkPermission();
//   }, [fetchQrCode]);

//   const startScan = () => {
//     // if (!isScanning) {
//     BleManager.scan([], 5, true)
//       .then(() => {
//         console.log('Scanning...');
//       })
//       .catch(error => {
//         console.error(error);
//       });
//     // }
//   };

//   const peripherals = new Map();
//   const [connectedDevices, setConnectedDevices] = useState([]);

//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   const handleGetConnectedDevices = () => {
//     BleManager.getConnectedPeripherals([]).then(results => {
//       if (results.length === 0) {
//         console.log('No connected bluetooth devices');
//       } else {
//         for (let i = 0; i < results.length; i++) {
//           let peripheral = results[i];
//           peripheral.connected = true;
//           peripherals.set(peripheral.id, peripheral);
//           setConnectedDevices(Array.from(peripherals.values()));
//         }
//       }
//     });
//   };

//   useEffect(() => {
//     // start bluetooth manager
//     BleManager.start({showAlert: false}).then(() => {
//       console.log('BleManager initialized');
//       handleGetConnectedDevices();
//       startScan();
//     });

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   BleManagerEmitter.addListener('BleManagerDiscoverPeripheral', peripheral => {
//     // console.log('find beacon');
//     // console.log(peripheral);
//     handleDiscoverPeripheral(peripheral);
//     // setDiscoveredDevices(Array.from(peripherals.values()));
//   });

//   const handleDiscoverPeripheral = (peripheral: any) => {
//     if (
//       peripheral.advertising &&
//       peripheral.advertising.serviceData &&
//       peripheral.advertising.serviceData.fe9a
//     ) {
//       const rawData = peripheral.advertising.serviceData.fe9a.data;
//       // const decodedDataHex = Buffer.from(rawData, 'base64').toString('hex');

//       const decodedData = base64.decode(rawData);
//       const toHex = (str: string) =>
//         [...str]
//           .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
//           .join('');
//       const decodedDataHex = toHex(decodedData);

//       // Trim the first 2 and last 4 characters
//       const trimmedData = decodedDataHex.substring(
//         2,
//         decodedDataHex.length - 4,
//       );

//       if (beaconWhitelist.includes(trimmedData)) {
//         // Connect to the beacon
//         console.log('connect to device');
//         console.log(peripheral.id);
//         console.log(peripheral.advertising.serviceData.fe9a.data);
//         console.log(peripheral);
//         console.log('advertising = ', peripheral.advertising);
//         const base64 = RNFetchBlob.base64;
//         const advertisingData = stringToBytes(
//           base64.decode(peripheral.advertising.serviceData.fe9a.data),
//         );
//         console.log(
//           base64.decode(peripheral.advertising.serviceData.fe9a.data),
//         );
//         console.log(advertisingData);
//         console.log(peripheral.advertising.serviceData.fe9a.bytes);

//         // const rssi = device.rssi;
//         // const name = device.localName;
//         const major = advertisingData[21]; // => this is major data
//         const minor = advertisingData[23]; // this is minor data }
//         // console.log(major);
//         // console.log(minor);
//         // connectToBeacon(peripheral.id);
//         // BleManager.stopScan();
//       }
//     }
//   };

//   BleManagerEmitter.addListener('BleManagerDidUpdateState', ({state}) => {
//     console.log('Bluetooth State:', state);
//     // Handle Bluetooth state changes
//   });

//   BleManagerEmitter.addListener('BleManagerConnectPeripheral', peripheral => {
//     console.log('BleManagerConnectPeripheral:', peripheral);
//   });

//   const connectToBeacon = (deviceId: string) => {
//     console.log('Attempting to connect to device:', deviceId);
//     // Check if the device is already connected before attempting to connect
//     // if (!peripherals.get(deviceId)?.connected) {
//     BleManager.connect(deviceId)
//       .then(() => {
//         console.log('Connected to device:', deviceId);
//         // Subscribe to relevant characteristics or services to get major and minor values
//       })
//       .catch(error => {
//         console.error('Connection error', error);
//       });
//     // }
//   };

//   useEffect(() => {
//     // let stopDiscoverListener =

//     // let stopConnectListener = BleManagerEmitter.addListener(
//     //   'BleManagerConnectPeripheral',
//     //   peripheral => {
//     //     console.log('BleManagerConnectPeripheral:', peripheral);
//     //   },
//     // );

//     let stopScanListener = BleManagerEmitter.addListener(
//       'BleManagerStopScan',
//       () => {
//         // setIsScanning(false);
//         console.log('scan stopped');
//       },
//     );

//     return () => {
//       // stopDiscoverListener.remove();
//       // stopConnectListener.remove();
//       stopScanListener.remove();
//     };
//   }, []);

//   /// ble-plx
//   // const manager = new BleManager();

//   // const startScan = () => {
//   //   manager.startDeviceScan(null, null, (error, device) => {
//   //     if (error) {
//   //       console.error(error);
//   //       return;
//   //     }

//   //     console.log('Scanning...');
//   //     handleDiscoverPeripheral(device);
//   //   });
//   // };

//   // const peripherals = new Map();
//   // const [connectedDevices, setConnectedDevices] = useState([]);

//   // // const handleGetConnectedDevices = () => {
//   // //   manager.getConnectedDevices([]).then(results => {
//   // //     if (results.length === 0) {
//   // //       console.log('No connected bluetooth devices');
//   // //     } else {
//   // //       for (let i = 0; i < results.length; i++) {
//   // //         let peripheral = results[i];
//   // //         peripheral.connected = true;
//   // //         peripherals.set(peripheral.id, peripheral);
//   // //         setConnectedDevices(Array.from(peripherals.values()));
//   // //       }
//   // //     }
//   // //   });
//   // // };

//   // const handleDiscoverPeripheral = peripheral => {
//   //   // console.log(peripheral.rawScanRecord);
//   //   // const advertisingData = stringToBytes(
//   //   //   base64.decode(
//   //   //     peripheral.rawScanRecord.serviceData[
//   //   //       base64.decode(peripheral.rawScanRecord.serviceUUIDs[0])
//   //   //     ],
//   //   //   ),
//   //   // );
//   //   console.log(peripheral);
//   //   if (peripheral.rawScanRecord) {
//   //     try {
//   //       const base64 = RNFetchBlob.base64;

//   //       const rawScanRecord = JSON.parse(
//   //         base64.decode(peripheral.rawScanRecord),
//   //       );
//   //       if (rawScanRecord.serviceUUIDs[0]) {
//   //         console.log(rawScanRecord);
//   //         console.log(rawScanRecord.serviceData[rawScanRecord.serviceUUIDs[0]]);
//   //         const advertisingData = stringToBytes(
//   //           rawScanRecord.serviceData[rawScanRecord.serviceUUIDs[0]],
//   //         );
//   //         console.log(advertisingData);
//   //         const major = advertisingData[21]; // => this is major data
//   //         const minor = advertisingData[23]; // this is minor data }
//   //         console.log(major);
//   //         console.log(minor);
//   //       }
//   //     } catch (err) {
//   //       console.log(err);
//   //     }
//   //   }

//   //   // if (
//   //   //   peripheral.advertising &&
//   //   //   peripheral.advertising.serviceData &&
//   //   //   peripheral.advertising.serviceData.fe9a
//   //   // ) {
//   //   //   const rawData = peripheral.advertising.serviceData.fe9a.data;

//   //   //   // Add your logic to process rawData here

//   //   //   if (beaconWhitelist.includes(trimmedData)) {
//   //   //     console.log('connect to device');
//   //   //     console.log(peripheral.id);
//   //   //     connectToBeacon(peripheral.id);
//   //   //   }
//   //   // }
//   // };

//   // const connectToBeacon = deviceId => {
//   //   console.log('Attempting to connect to device:', deviceId);
//   //   manager.connectToDevice(deviceId).then(
//   //     device => {
//   //       console.log('Connected to device:', device);
//   //       // Subscribe to relevant characteristics or services to get major and minor values
//   //     },
//   //     error => {
//   //       console.error('Connection error', error);
//   //     },
//   //   );
//   // };

//   // useEffect(() => {
//   //   // manager.setLogLevel(LogLevel.Verbose);

//   //   manager.onStateChange(state => {
//   //     console.log('Bluetooth State:', state);

//   //     if (state === 'PoweredOn') {
//   //       // handleGetConnectedDevices();
//   //       startScan();
//   //     }
//   //   });

//   //   manager.startDeviceScan(null, null, (error, device) => {
//   //     if (error) {
//   //       console.error(error);
//   //       return;
//   //     }

//   //     console.log('Scanning...');
//   //     handleDiscoverPeripheral(device);
//   //   });

//   //   return () => {
//   //     manager.stopDeviceScan();
//   //   };
//   // }, []);

//   // const region = {
//   //   identifier: 'AnyBeacon',
//   //   uuid: '00000000-0000-0000-0000-000000000000', // Wildcard UUID
//   // };

//   // useEffect(() => {
//   //   const startBeaconScanning = async () => {
//   //     try {
//   //       // Request authorization while the app is open
//   //       // await Beacons.requestWhenInUseAuthorization();

//   //       // Check if Beacon library is available

//   //       // Start monitoring and ranging for beacons
//   //       // await Beacons.startRangingBeaconsInRegion(region);
//   //       await Beacons.startRangingBeaconsInRegion(
//   //         region.identifier,
//   //         region.uuid,
//   //       );
//   //       // await Beacons.startUpdatingLocation();
//   //     } catch (error) {
//   //       console.error('Error starting beacon scanning:', error);
//   //     }
//   //   };

//   //   startBeaconScanning();

//   //   // Listen for beacon changes
//   //   const subscription = DeviceEventEmitter.addListener(
//   //     'beaconsDidRange',
//   //     data => {
//   //       // Handle the ranged beacons data
//   //       console.log('Ranged Beacons:', data.beacons);
//   //     },
//   //   );

//   //   // Stop scanning and remove the event listener when the component is unmounted
//   //   return () => {
//   //     Beacons.stopMonitoringForRegion(region);
//   //     Beacons.stopRangingBeaconsInRegion('test');
//   //     // Beacons.stopUpdatingLocation();
//   //     subscription.remove();
//   //   };
//   // }, []); // Empty dependency array means this effect runs once when the component mounts

//   // useEffect(() => {
//   //   // Request beacon permissions if needed
//   //   // Beacons.requestAlwaysAuthorization();

//   //   // Start detecting beacons
//   //   Beacons.startRangingBeaconsInRegion('MyBeaconRegion')
//   //     .then(() => console.log('Beacon ranging started successfully'))
//   //     .catch(error => console.error('Beacon ranging error:', error));

//   //   // Set up event listeners using NativeEventEmitter
//   //   const subscription = BleManagerEmitter.addListener(
//   //     'beaconsDidRange',
//   //     data => {
//   //       // Handle the received beacon data
//   //       console.log('Beacon data:', data);
//   //       const proximityUUIDs = data.beacons.map(
//   //         (beacon: {uuid: any}) => beacon.uuid,
//   //       );
//   //       console.log('Detected UUIDs:', proximityUUIDs);
//   //     },
//   //   );

//   //   // Clean up on component unmount
//   //   return () => {
//   //     Beacons.stopRangingBeaconsInRegion('MyBeaconRegion')
//   //       .then(() => console.log('Beacon ranging stopped successfully'))
//   //       .catch(error => console.error('Beacon ranging stop error:', error));

//   //     // Remove the event listener
//   //     subscription.remove();
//   //   };
//   // }, []);

//   return (
//     <View className="w-max">
//       <Header
//         title={t('no_key', 'My QR Code')}
//         leftAction="close"
//         onPressLeftAction={() => {
//           modalActions.hide();
//         }}
//         withPadding={false}
//       />
//       <ScrollView className="w-max flex-col">
//         {qrValue && qrCountdownSeconds > 0 && qrGenerationTime > 0 && (
//           <QRCodeWidget
//             value={qrValue}
//             description={t(
//               'no_key',
//               'Use this for building access, car park, payment, etc. within One Bangkok',
//             )}
//             onRegenerate={() => {
//               generateQrCode();
//             }}
//             initialCountdown={qrCountdownSeconds}
//             generateTime={qrGenerationTime}
//           />
//         )}
//         <ShortCut />
//         {/* <View style={{padding: 20}}>
//           <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
//             Discovered Devices:
//           </Text>
//           {discoveredDevices.length > 0 ? (
//             renderDiscoveredDevices()
//           ) : (
//             <Text>
//               No beacons found. Please make sure your beacons are nearby.
//             </Text>
//           )}
//         </View> */}
//         {/* <renderDiscoveredDevices /> */}
//       </ScrollView>
//     </View>
//   );
// };

// export default BuildingAccessQrScreen;
