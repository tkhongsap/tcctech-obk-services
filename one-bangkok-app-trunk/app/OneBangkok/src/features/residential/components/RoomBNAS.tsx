import {View, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {Icon, Text} from '~/components/atoms';
import ShutterController from './ShutterController';
import t from '~/utils/text';
type Props = {
  homeId: string;
  id: string;
  name: string;
  bridge: string;
};

const RoomBNAS = ({homeId, id, name, bridge}: Props) => {
  return (
    <>
      {/* <View
        className="flex flex-row px-4 text-left w-full mt-10 mb-4"
        style={{gap: 16}}>
        <Text size="H3" weight="medium">
        {t('Residential__Home_Automation__Curtains_And_Shutters', 'Curtains & Shutters')}
        </Text>
        <Text size="H4" weight="medium"></Text>
      </View> */}
      <View
        className="w-full flex flex-col px-4 border-b border-line-light"
        key={id}>
        <ShutterController
          title={name}
          asChild={true}
          loadingState={true}
          onControlChange={value => {
            console.log('State Value, ' + value);
            // Alert.alert("", value)
          }}
          moduleId={id}
          homeId={homeId}
          bridge={bridge}
        />
      </View>
    </>
  );
};

export default RoomBNAS;
