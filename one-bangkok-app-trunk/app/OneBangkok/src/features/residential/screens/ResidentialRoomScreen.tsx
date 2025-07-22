import {View, ScrollView, Alert} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import {Header} from '../components/Header';
import {ScreenContainer} from '../components';
import {RootStackParamList} from '~/navigations/AppNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import RoomBNTH from '../components/RoomBNTH';
import RoomBNAS from '../components/RoomBNAS';
import {Text} from '~/components/atoms';
import t from '~/utils/text';
import LightDimmer from '../components/LightDimmer';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialRoomScreen'
>;

type module = {
  id: string;
  type: string;
  name: string;
  setup_date: number;
  room_id: string;
  modules_bridged: null;
  bridge: string;
  on: boolean;
  offload: boolean;
  firmware_revision: number;
  last_seen: number;
  reachable: boolean;
  brightness: any;
  current_position: null;
  target_position: null;
  target_positionstep: null;
  cooler_status: boolean;
  fan_speed: number;
  fan_mode: string;
  humidity: null;
};

const ResidentialRoomScreen = ({
  route: {
    params: {title, module, homeId, temperature},
  },
}: Props) => {
  const [moduleList, setModuleList] = useState<module[]>(module);
  const [lightInRoom, setLightInRoom] = useState<boolean>(false);

  const mapDeviceType = () => {
    const predefinedOrder = ['BNLD', 'BNIL', 'BNTH', 'BNAS'];
    const groupedByType = predefinedOrder.reduce((acc: any, type: string) => {
      acc[type] = module.filter((device: any) => device.type === type);
      return acc;
    }, {});

    Object.keys(groupedByType).forEach(type => {
      const devices = groupedByType[type];

      if (type === 'BNLD' || type === 'BNIL') {
        devices.sort((a: any, b: any) => {
          const lastCharA = a.name[a.name.length - 1];
          const lastCharB = b.name[b.name.length - 1];
          const numA = isNaN(lastCharA) ? lastCharA : parseInt(lastCharA, 10);
          const numB = isNaN(lastCharB) ? lastCharB : parseInt(lastCharB, 10);

          return numA < numB ? -1 : numA > numB ? 1 : 0;
        });
      }
      console.log(devices);
    });

    const sortedDevices = predefinedOrder.flatMap(type => groupedByType[type]);
    return sortedDevices;
  };
  const onClickDebug = () => {
    Alert.alert('Debug', JSON.stringify(module));
  };

  const isLightInRoom = () =>
    module.some((e: any) => e.type == 'BNLD' || e.type == 'BNIL');

  useEffect(() => {
    const sortedItems = mapDeviceType();
    setModuleList(sortedItems);
  }, []);

  const parseToFanSpeed = (fanSpeed: number) => {
    try {
      if (fanSpeed <= 0) return 0;
      return fanSpeed >= 3 ? 3 : fanSpeed;
    } catch (error) {
      return 0;
    }
  };

  return (
    <ScreenContainer bgColor="#ffffff" barStyle="dark-content">
      <Header
        leftAction="goBack"
        title={title}
        titleColor="dark-gray"
        bgColor="bg-white"
      />
      <ScrollView className="w-full bg-white pt-10">
        <View className="flex-1 flex-col items-center pb-[200px]">
          {isLightInRoom() ? (
            <View
              className="flex flex-row px-4 mb-4 text-left w-full"
              style={{gap: 12}}>
              <Text size="H3" weight="medium">
                {t('Residential__Home_Automation__Light', 'Light')}
              </Text>
            </View>
          ) : (
            <></>
          )}

          {moduleList.map(
            (
              {
                id,
                type,
                name,
                brightness,
                on,
                fan_mode,
                fan_speed,
                room_id,
                bridge,
                cooler_status,
              },
              index,
            ) => {
              let displayCurtainsText = false;

              if (
                type === 'BNAS' &&
                index === moduleList.findIndex(m => m.type === 'BNAS')
              ) {
                displayCurtainsText = true;
              }

              return (
                <Fragment key={`${type}_${id}_${room_id}`}>
                  {displayCurtainsText && (
                    <View
                      className="flex flex-row px-4 text-left w-full mt-10 mb-4"
                      style={{gap: 16}}>
                      <Text size="H3" weight="medium">
                        {t(
                          'Residential__Home_Automation__Curtains_And_Shutters',
                          'Curtains & Shutters',
                        )}
                      </Text>
                      <Text size="H4" weight="medium"></Text>
                    </View>
                  )}

                  {/* BNLD: lighting dimmer */}
                  {type === 'BNIL' || type === 'BNLD' ? (
                    <LightDimmer
                      key={id}
                      homeId={homeId}
                      id={id}
                      name={name}
                      brightness={brightness}
                      on={on}
                      type={type}
                      roomId={room_id}
                      bridge={bridge}
                    />
                  ) : (
                    <></>
                  )}

                  {/* BNTH: Thermostat */}
                  {type === 'BNTH' && (
                    <RoomBNTH
                      key={id}
                      homeId={homeId}
                      id={id}
                      name={name}
                      on={on}
                      fan_mode={fan_mode}
                      fan_speed={parseToFanSpeed(fan_speed)}
                      roomId={room_id}
                      bridge={bridge}
                      temperature={temperature}
                      type={'BNTH'}
                      cooler_status={cooler_status}
                    />
                  )}

                  {/* BNAS: Shutter */}
                  {type === 'BNAS' && (
                    <RoomBNAS
                      key={id}
                      homeId={homeId}
                      id={id}
                      name={name}
                      bridge={bridge}
                    />
                  )}
                </Fragment>
              );
            },
          )}

          {/* DEBUG BUTTON */}
          {/* <View className="mt-10">
        <Button title={'Debug'} onPress={onClickDebug}></Button>
      </View> */}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default ResidentialRoomScreen;
