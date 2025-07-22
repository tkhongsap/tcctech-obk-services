import {View} from 'react-native';
import React from 'react';
import {Text} from '~/components/atoms';
import t from '~/utils/text';

const TotalAvailable = ({total}: {total: number}) => {
  return (
    <>
      <View className="py-4 border border-gray-300 justify-center">
        <View className="px-4 flex flex-row justify-between items-center">
          <Text weight="regular">{t('no_key', 'Total available')}</Text>
          <Text weight="medium" size="H6" color="navy">
            {total.toLocaleString()}
          </Text>
          <Text weight="regular">{t('no_key', 'spots')}</Text>
        </View>
      </View>
    </>
  );
};

export default TotalAvailable;
