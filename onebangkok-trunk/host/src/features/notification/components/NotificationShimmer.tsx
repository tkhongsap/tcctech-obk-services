/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Spacing} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';

const NotificationShimmer = ({borderTop}: any) => {
  return (
    <View
      className={`w-screen flex-1 p-4 ${
        borderTop
          ? getTheme('border-y-[1px] border-line')
          : getTheme('border-b-[1px] border-line')
      }`}>
      <SkeletonPlaceholder>
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 20, height: 20, borderRadius: 10}} />
              <Spacing width={4} />

              <View style={{width: 45, height: 12, borderRadius: 6}} />
            </View>
            <View style={{width: 64, height: 12, borderRadius: 6}} />
          </View>
          <Spacing height={12} />
          <View
            style={{
              width: '100%',
              height: 30,
              borderRadius: 4,
            }}
          />
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

export default NotificationShimmer;
