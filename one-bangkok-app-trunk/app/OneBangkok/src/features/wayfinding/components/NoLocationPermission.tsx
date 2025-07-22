import {useContext} from 'react';
import React, {
  View,
  ScrollView,
  Linking,
  StyleSheet,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon, Spacing, Text} from '~/components/atoms';
import {HeadText} from '~/components/molecules/HeadText';
import {StickyButton} from '~/components/molecules/StickyButton';
import t from '~/utils/text';
import {WayFindingContext} from '../store/wayfinding';
import DeviceInfo from 'react-native-device-info';

const AllowPermissionButton = ({
  onPress,
  title,
}: {
  onPress: any;
  title: string;
}) => {
  return <StickyButton title={title} rightIcon="next" onPress={onPress} />;
};

const NoLocationPermission = () => {
  const wayFindingContext = useContext(WayFindingContext);
  if (!wayFindingContext) {
    throw new Error('No WayFindingContext.Provider found.');
  }
  const inset = useSafeAreaInsets();

  const handleOnPress = async () => {
    const isLocationEnabled = DeviceInfo.isLocationEnabledSync();
    if (!isLocationEnabled) {
      if (Platform.OS === 'ios') {
        Linking.openURL('App-Prefs:Privacy&path=LOCATION');
      } else {
        Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
      }
    } else {
      Linking.openSettings();
    }
  };
  return (
    <View
      className="absolute top-0 bottom-0 right-0 left-0 z-50 bg-white"
      style={{top: inset.top + 50}}>
      <>
        <ScrollView className="w-full px-5 ">
          <View style={styles.mt60}>
            <HeadText
              tagline={t('General__One_bangkok', 'One Bangkok')}
              title={t('Wayfinding', 'Wayfinding')}
            />
          </View>
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
              <Text
                size="B1"
                weight="regular"
                color="muted"
                className="text-center">
                {t(
                  'Building__access__Location__Alway__permission_wayfinding__Body',
                  'Please allow "One Bangkok" to use device\'s location',
                )}
              </Text>
            </View>
          </View>
        </ScrollView>
        <AllowPermissionButton
          title={t('General__Allow_now', 'Allow now')}
          onPress={handleOnPress}
        />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  mt60: {marginTop: 25},
});

export default NoLocationPermission;
