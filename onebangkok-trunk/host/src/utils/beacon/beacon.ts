import {useCallback, useEffect, useState, useMemo} from 'react';
import {NativeEventEmitter, NativeModules} from 'react-native';

const {BeaconModule} = NativeModules;

export type Beacon = {
  tag: string;
  minor: string;
  major: string;
};

type BeaconManager = {
  startScan: (tag: string) => void;
  stopScan: (tag: string) => void;
  resetBeacons: () => void;
};

type UseBeaconOptions = {
  timeout?: number;
};

export type EnumScanStatus = 'idle' | 'scanning' | 'complete';

export const useBeacon = (
  options?: UseBeaconOptions,
): [Beacon[], BeaconManager, EnumScanStatus] => {
  const [beacons, setBeacons] = useState<Beacon[]>([]);
  const [scanStatus, setScanStatus] = useState<EnumScanStatus>('idle');

  const addBeacon = useCallback((beacon: Beacon) => {
    setBeacons(currentBeacons => {
      const existingBeaconIndex = currentBeacons.findIndex(
        el => el.tag === beacon.tag,
      );
      if (existingBeaconIndex !== -1) {
        const updatedBeacons = [...currentBeacons];
        updatedBeacons[existingBeaconIndex] = beacon;
        return updatedBeacons;
      }
      return [...currentBeacons, beacon];
    });
  }, []);

  useEffect(() => {
    const beaconScannerEmitter = new NativeEventEmitter(BeaconModule);
    const onEnterRegion = beaconScannerEmitter.addListener(
      'onEnterRegion',
      addBeacon,
    );

    return () => {
      setBeacons([]);
      onEnterRegion.remove();
    };
  }, [addBeacon]);

  const stopScan = useCallback((tag: string) => {
    setScanStatus('complete');
    BeaconModule.stopScanning(tag);
  }, []);

  const resetBeacons = useCallback(() => {
    setBeacons([]);
  }, []);

  const startScan = useCallback(
    (tag: string) => {
      resetBeacons();
      setScanStatus('scanning');
      BeaconModule.startScanning(tag);
      if (options?.timeout) {
        setTimeout(() => {
          stopScan(tag);
        }, options.timeout);
      }
    },
    [options?.timeout, stopScan, resetBeacons],
  );

  const beaconManager = useMemo(
    () => ({
      startScan,
      stopScan,
      resetBeacons,
    }),
    [startScan, stopScan, resetBeacons],
  );

  return [beacons, beaconManager, scanStatus];
};
