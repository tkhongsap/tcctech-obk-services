import {isEmpty} from 'lodash';
import React, {View} from 'react-native';
import {Icon, Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import LastCalledCard from './LastCalledCard';
import {HeadText} from '~/components/molecules';
import ElevatorList from './ElevatorLists';
import {ImmutableObject} from '@hookstate/core';
import {FloorData} from 'ob-bms-sdk/dist/api';
import {EnumScanStatus} from '~/utils/beacon/beacon';

const DisableBlueTooth = () => {
  return (
    <View className="flex flex-col items-center justify-center text-center mt-56">
      <Icon height={62} width={62} type={'bluetooth'} color="#292929" />
      <Spacing height={10} />
      <Text size="N1" weight="bold">
        {t(
          'Building__access__Bluetooth__permission__Header',
          'Bluetooth permission',
        )}
      </Text>
      <View className="w-full h-16 px-6">
        <Spacing height={10} />
        <Text size="B1" weight="regular" color="muted" className="text-center">
          {t(
            'Building__access__Bluetooth__permission__Body',
            'Please allow “One Bangkok” to use bluetooth to call the elevator.',
          )}
        </Text>
      </View>
    </View>
  );
};

const DisableLocationAlway = () => {
  return (
    <View className="flex flex-col items-center justify-center text-center mt-56">
      <Icon height={62} width={62} type={'location'} color="#292929" />
      <Spacing height={10} />
      <Text size="N1" weight="bold">
        {t(
          'Building__access__Location__Alway__permission__Header',
          'Location permission',
        )}
      </Text>
      <View className="w-full h-16 px-6">
        <Spacing height={10} />
        <Text size="B1" weight="regular" color="muted" className="text-center">
          {t(
            'Building__access__Location__Alway__permission__Body',
            'Please allow "One Bangkok" to use device\'s location to call the elevator',
          )}
        </Text>
      </View>
    </View>
  );
};

const OutOfRange = () => {
  return (
    <View className="flex flex-col items-center justify-center text-center mt-56">
      <Icon height={62} width={62} type={'denied'} />
      <Spacing height={10} />
      <Text size="N1" weight="bold">
        {t(
          'Building__access__Out__of__range__We_can_not_locate_you',
          'We can’t locate you',
        )}
      </Text>
      <View className="w-full h-16 px-6">
        <Spacing height={10} />
        <Text size="B1" weight="regular" color="muted" className="text-center">
          {t(
            'Building__access__Out__of__range__Please_move_closer_to_the_elevator',
            'Please move closer to the elevator.',
          )}
        </Text>
      </View>
    </View>
  );
};

const NotPassedTurnstile = () => {
  return (
    <View className="flex flex-col items-center justify-center text-center mt-56">
      <Icon height={62} width={62} type={'denied'} />
      <Spacing height={10} />
      <Text size="N1" weight="bold">
        {t(
          'Building__access__Not__access__turnstile__Header',
          'Please access the turnstile',
        )}
      </Text>
      <View className="w-full h-16 px-6">
        <Spacing height={10} />
        <Text size="B1" weight="regular" color="muted" className="text-center">
          {t(
            'Building__access__Not__access__turnstile__Body',
            'Please access the turnstile \nbefore access to the elevator.',
          )}
        </Text>
      </View>
    </View>
  );
};

const PoweredOff = () => {
  return (
    <View className="flex flex-col items-center justify-center text-center mt-56">
      <Icon height={62} width={62} type={'bluetooth'} />
      <Spacing height={10} />
      <Text size="N1" weight="bold">
        {t('Building__access__Bluetooth__disable__Header', 'Enable Bluetooth')}
      </Text>
      <View className="w-full h-16 px-6">
        <Spacing height={10} />
        <Text size="B1" weight="regular" color="muted" className="text-center">
          {t(
            'Building__access__Bluetooth__disable__Body',
            'Bluetooth is disabled. Please enable it before calling the elevator.',
          )}
        </Text>
      </View>
    </View>
  );
};

const FloorSelector = ({
  lastCallFloor,
  onClose,
  currentFloor,
  destinationFloors,
  lastElevator,
}: {
  lastCallFloor: string;
  onClose: Function;
  currentFloor: string;
  destinationFloors: ImmutableObject<FloorData>[];
  lastElevator: string;
}) => {
  return (
    <View>
      {!isEmpty(lastCallFloor) && (
        <LastCalledCard
          destinationFloor={lastCallFloor}
          onClose={() => {
            onClose();
          }}
          lastElevator={lastElevator}
        />
      )}
      <ElevatorList
        name={'ElevatorList'}
        currentFloor={currentFloor}
        destinationFloors={destinationFloors}
      />
    </View>
  );
};

const ElevatorComponent = ({
  permissionStatus,
  permissionLocationAlwayStatus,
  lastCallFloor,
  onClose,
  currentFloor,
  destinationFloors,
  scanStatus,
  bluetoothStatus,
  passedTurnstile,
  lastElevator,
}: {
  permissionStatus: string;
  permissionLocationAlwayStatus: string;
  lastCallFloor: string;
  onClose: Function;
  currentFloor: string;
  destinationFloors: ImmutableObject<FloorData>[];
  scanStatus: EnumScanStatus;
  bluetoothStatus: string;
  passedTurnstile: boolean;
  lastElevator: string;
}) => {
  if (permissionLocationAlwayStatus !== 'granted') {
    return <DisableLocationAlway />;
  } else if (bluetoothStatus === 'PoweredOff') {
    return <PoweredOff />;
  } else if (permissionStatus !== 'granted') {
    return <DisableBlueTooth />;
  } else if (scanStatus === 'complete' && destinationFloors.length === 0) {
    return <OutOfRange />;
  } else if (!passedTurnstile && destinationFloors.length > 0) {
    return <NotPassedTurnstile />;
  } else {
    return (
      <FloorSelector
        lastCallFloor={lastCallFloor}
        onClose={onClose}
        currentFloor={currentFloor}
        destinationFloors={destinationFloors}
        lastElevator={lastElevator}
      />
    );
  }
};

export default ElevatorComponent;
