import React, {useCallback, useEffect, useState} from 'react';
import {
  GestureResponderEvent,
  Linking,
  Platform,
  ScrollView,
  View,
} from 'react-native';

import {Header} from '~/components/molecules/Header';
import {StickyButton} from '~/components/molecules/StickyButton';
import {Screen} from '~/components/templates/Screen';
import t from '~/utils/text';
import {
  request,
  PERMISSIONS,
  requestMultiple,
  check,
  RESULTS,
} from 'react-native-permissions';
import Config from 'react-native-config';

import {useBeacon} from '~/utils/beacon/beacon';
import locationUtils, {Location} from '~/utils/beacon/locations';
import {filter, find, first, get, isUndefined} from 'lodash';
import {memberAction, memberState} from '../store/member';
import {FloorData} from 'ob-bms-sdk/dist/api';
import {ImmutableObject, useHookstate} from '@hookstate/core';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import {BuildingAccessService} from '~/services/BuildingAccessService';
import ElevatorComponent from '../components/ElevatorComponent';
import {useNavigation} from '~/navigations/AppNavigation';
import _firebaseState from '~/states/firebase';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {HeadText} from '~/components/molecules';
import {Spacing, Text} from '~/components/atoms';

const ElevatorButton = ({
  onPress,
  title,
  hide,
}: {
  onPress: any;
  title: string;
  hide: boolean;
}) => {
  if (hide) {
    return <></>;
  }
  return <StickyButton title={title} rightIcon="next" onPress={onPress} />;
};

const CallElevatorScreen = () => {
  const [beacons, beaconManager, scanStatus] = useBeacon({timeout: 10000});
  const firebaseState = useHookstate(_firebaseState);
  const liftBeaconTag = get(
    firebaseState,
    'building_access.value.lift_beacon_tag',
  );
  const [permissionStatus, setPermissionStatus] = useState('');
  const [permissionLocationAlwayStatus, setPermissionLocationAlwayStatus] =
    useState('');
  const [floors, setFloors] = useState<ImmutableObject<FloorData>[]>([]);
  const [currentFloor, setCurrentFloor] = useState('');
  const [lastCallFloor, setLastCallFloor] = useState('');
  const [lastElevator, setLastElevator] = useState('');
  const {...methods} = useForm({mode: 'onSubmit', reValidateMode: 'onSubmit'});
  const navigation = useNavigation();
  const [bluetoothStatus, setBluetoothStatus] = useState('');

  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      const permissionLocationaAlwayResult = await check(
        PERMISSIONS.IOS.LOCATION_ALWAYS,
      )
        .then(result => {
          switch (result) {
            case RESULTS.GRANTED:
              setPermissionLocationAlwayStatus(RESULTS.GRANTED);
              return result;
            case RESULTS.BLOCKED:
              setPermissionLocationAlwayStatus(RESULTS.BLOCKED);
              return result;
            default:
              setPermissionLocationAlwayStatus(result);
              return result;
          }
        })
        .catch(error => {
          console.log(error);
        });
      if (permissionLocationaAlwayResult !== RESULTS.GRANTED) return;
      request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL).then(result => {
        setPermissionStatus(result);
      });
    } else {
      requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]).then(statuses => {
        if (
          statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED
        ) {
          setPermissionLocationAlwayStatus('granted');
        } else {
          return;
        }
        if (statuses[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] === RESULTS.GRANTED) {
          setPermissionStatus('granted');
        }
      });
    }
  };

  const handleOnPress: SubmitHandler<FieldValues> = async data => {
    if (
      permissionStatus === 'granted' &&
      permissionLocationAlwayStatus === 'granted'
    ) {
      const location = await findLocation();
      if (scanStatus === 'complete' && floors.length === 0) {
        beaconManager.startScan(liftBeaconTag);
      } else if (!isUndefined(data.ElevatorList) && location) {
        const buildingAccessService = new BuildingAccessService();
        navigation.navigate('ElevatorWaitingScreen');

        const result = await buildingAccessService.callElevator(
          memberState.id.value,
          data.ElevatorList,
          location.id,
        );
        const destinationFloorId = get(result, [
          'data',
          'destination_floor_id',
        ]);
        const lastElevator = get(result, ['result', 'lift', 'name'], '-');

        if (!isUndefined(lastElevator)) {
          setLastElevator(lastElevator);
        }
        if (!isUndefined(destinationFloorId)) {
          setFloorName(destinationFloorId);
        }
      }
      // Validate and submit
      // Add  navigation logic here
    } else {
      Linking.openSettings();
    }
  };

  const getButtonTitle = () => {
    if (
      permissionStatus !== 'granted' ||
      permissionLocationAlwayStatus !== 'granted'
    ) {
      return t('General__Allow_now', 'Allow now');
    } else if (scanStatus === 'complete' && floors.length === 0) {
      return t('General__Try_again', 'Try again');
    } else {
      return t('General__Call_elevator', 'Call elevator');
    }
  };

  useEffect(() => {
    // Force-set granted permission because the simulator
    // does not have Bluetooth permission.
    if (Config.DEVELOPMENT_MODE! === 'true') {
      setPermissionStatus('granted');
    } else {
      checkPermission();
      const intervalId = setInterval(() => {
        if (permissionStatus !== 'granted') {
          checkPermission();
        } else {
          clearInterval(intervalId); // Stop checking when permission is granted
        }
      }, 5000); // Check every 5 seconds

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [permissionStatus]);

  useEffect(() => {
    if (permissionStatus === 'granted') {
      beaconManager.startScan(liftBeaconTag);
    }
  }, [permissionStatus, beaconManager, liftBeaconTag]);

  const setFloorName = async (floorId: string) => {
    if (memberState.towers.value) {
      const expectedFloor = memberState.towers.value
        .flatMap(tower => tower.floors)
        .find(floor => floor.id === floorId);

      if (expectedFloor) {
        const currentLanguage = appLanguageActions.getLanguage();

        const floorDisplayName = get(
          expectedFloor,
          ['display_name', currentLanguage],
          get(expectedFloor, ['name']),
        );
        setLastCallFloor(floorDisplayName);
      }
    }
  };

  const sortedFloors = async (floor: FloorData[], currentLanguage: string) => {
    const sortFloors = floor.sort((a, b) => {
      const aDisplayName = get(a, ['display_name', currentLanguage], a.name);
      const bDisplayName = get(b, ['display_name', currentLanguage], b.name);

      const aIsNumber = !isNaN(parseInt(aDisplayName));
      const bIsNumber = !isNaN(parseInt(bDisplayName));

      if (aIsNumber && bIsNumber) {
        return parseInt(aDisplayName) - parseInt(bDisplayName);
      } else if (!aIsNumber && !bIsNumber) {
        return aDisplayName.localeCompare(bDisplayName);
      } else {
        return aIsNumber ? 1 : -1;
      }
    });

    setFloors(sortFloors);
  };

  const getMemberData = useCallback(async (location: Location) => {
    const buildingAccessService = new BuildingAccessService();
    await memberAction.getMember(location.uid);
    const result = await buildingAccessService.getLastCall(
      memberState.id.value,
    );
    if (result) {
      const destinationFloorId = get(result, [
        '0',
        'data',
        'destination_floor_id',
      ]);

      const lastElevator = get(result, ['0', 'result', 'lift', 'name'], '-');

      if (!isUndefined(lastElevator)) {
        setLastElevator(lastElevator);
      }

      if (!isUndefined(destinationFloorId)) {
        setFloorName(destinationFloorId);
      }
    }
    const currentLanguage = appLanguageActions.getLanguage();

    const locationDisplayName = get(
      location,
      ['floor', 'display_name', currentLanguage],
      location.floor.name,
    );

    setCurrentFloor(locationDisplayName);
    const currentTower = find(memberState.towers.value, {
      id: location.tower.id,
    });

    if (currentTower) {
      const authorizedTower = find(memberState.towers.value, {
        id: currentTower.id,
      });
      if (authorizedTower) {
        const authorizedfloors = authorizedTower.floors;

        const destinationFloors = filter(
          authorizedfloors,
          floor => floor.id !== location.floor.id,
        );
        sortedFloors(destinationFloors, currentLanguage);
      }
    }
  }, []);

  const findLocation = useCallback(async () => {
    const firstDiscovered = first(beacons);
    if (firstDiscovered) {
      const location = await locationUtils.mapBeacon(
        firstDiscovered.minor,
        firstDiscovered.major,
      );
      return location;
    }
    return null;
  }, [beacons]);

  useEffect(() => {
    findLocation().then(location => {
      if (location) {
        getMemberData(location);
      }
    });
  }, [findLocation, getMemberData]);

  useEffect(() => {
    BluetoothStateManager.onStateChange(bluetoothState => {
      if (bluetoothState === 'PoweredOn' || bluetoothState === 'PoweredOff') {
        setBluetoothStatus(bluetoothState);
      }
    }, true /*=emitCurrentState*/);
  }, []);

  return (
    <Screen>
      <Header leftAction="goBack" />
      <ScrollView className="w-full px-5">
        <HeadText
          tagline={t('General__One_bangkok', 'One Bangkok')}
          title={t('General__Elevator', 'Elevator')}
        />
        {/* <HeadText
          tagline={t('General__One_bangkok', 'One Bangkok')}
          title={t('no_key', 'Signature Tower')}
        />
        <Spacing height={28} />
        <Text color="subtitle-muted">
          {t(
            'no_key',
            'Currently in the Signature Building. Please select your destination floor.',
          )}
        </Text>
        <Spacing height={28} /> */}

        <FormProvider {...methods}>
          <ElevatorComponent
            permissionLocationAlwayStatus={permissionLocationAlwayStatus}
            permissionStatus={permissionStatus}
            lastCallFloor={lastCallFloor}
            onClose={() => {
              setLastCallFloor('');
            }}
            currentFloor={currentFloor}
            destinationFloors={floors}
            scanStatus={scanStatus}
            bluetoothStatus={bluetoothStatus}
            passedTurnstile={memberState.passed_turnstile.value}
            lastElevator={lastElevator}
          />
        </FormProvider>
      </ScrollView>
      <View className="flex-grow" />
      <ElevatorButton
        title={getButtonTitle()}
        onPress={methods.handleSubmit(handleOnPress)}
        hide={!memberState.passed_turnstile.value && floors.length > 0}
      />
    </Screen>
  );
};

export default CallElevatorScreen;
