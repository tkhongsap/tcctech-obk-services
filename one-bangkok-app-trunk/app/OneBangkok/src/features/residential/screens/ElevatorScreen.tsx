import {Platform, View, Linking} from 'react-native';
import {Spacing} from '~/components/atoms';
import {HeadText} from '~/components/molecules';
import t from '~/utils/text';
import {StackActions, useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import LocationPermission from '~/features/residential/components/Elevator/LocationPermission';
import LocationDisable from '~/features/residential/components/Elevator/LocationDisable';
import React, {useEffect, useState} from 'react';
import {
  check,
  checkMultiple,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {ScreenContainer, StickyButton} from '../components';
import {Header} from '../components/Header';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {
  residentialUnitSelectedState,
  UnitDetail,
} from '~/states/residentialTenant/residentialTenantState';
import GetLocation from 'react-native-get-location';
import {getDistance} from 'geolib';
import ErrorOutOfRange from '../components/Elevator/ErrorOutOfRange';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import {logScreenView} from '~/utils/logGA';

enum ElevatorLocationStatus {
  BLOCKED,
  UNKNOWN,
  OUT_OF_RANGE,
}

const ElevatorScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<ElevatorLocationStatus>();

  useEffect(() => {
    logScreenView('ElevatorScreen');
    checkLocationPermission();
    const fetchPersonID = async () => {
      const id = await residentialTenantAction.getUID();
    };
    fetchPersonID();
  }, []);

  const checkLocationPermission = async () => {
    try {
      setIsLoading(true);
      if (Platform.OS === 'ios') {
        await checkLocationPermissionIOS();
      } else if (Platform.OS === 'android') {
        await checkLocationPermissionAndroid();
      }
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setIsLoading(false);
    }
  };

  const checkLocationPermissionIOS = async () => {
    const results = await checkMultiple([
      PERMISSIONS.IOS.LOCATION_ALWAYS,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ]);
    results['ios.permission.LOCATION_ALWAYS'];
    if (
      results['ios.permission.LOCATION_ALWAYS'] === RESULTS.GRANTED ||
      results['ios.permission.LOCATION_WHEN_IN_USE'] === RESULTS.GRANTED
    ) {
      await validateUserLocation();
    } else {
      setStatus(ElevatorLocationStatus.UNKNOWN);
      // Linking.openSettings();
    }
  };

  const checkLocationPermissionAndroid = async () => {
    const permissionLocation = await check(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
    if (permissionLocation === RESULTS.GRANTED) {
      await validateUserLocation();
    } else if (permissionLocation === RESULTS.BLOCKED) {
      // Linking.openSettings();
      setStatus(ElevatorLocationStatus.BLOCKED);
    } else {
      // Linking.openSettings();
      setStatus(ElevatorLocationStatus.UNKNOWN);
    }
  };

  const requestLocation = async () => {
    try {
      setIsLoading(true);
      if (Platform.OS !== 'android') {
        Linking.openURL('App-Prefs:Privacy&path=LOCATION');
        return;
      }

      await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      await checkLocationPermissionAndroid();
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setIsLoading(false);
    }
  };

  const validateUserLocation = async () => {
    const [position, residentProperty] = await Promise.all([
      getPosition(),
      getDefaultProperty(),
    ]);
    const id = await residentialTenantAction.getUID();
    // if (!position || !residentProperty) {
    //   throw new Error("Can't get user position or resident property");
    // }

    const distance = getDistance(
      {
        latitude: residentProperty.projectGeoLocation.latitude,
        longitude: residentProperty.projectGeoLocation.longitude,
      },
      {
        latitude: position.latitude,
        longitude: position.longitude,
      },
    );
    if (distance <= residentProperty.projectGeoLocation.radius) {
      navigation.dispatch(
        StackActions.replace('ElevatorFloorSelectionScreen', {
          property: residentProperty,
          personID: id,
        }),
      );
    } else {
      setStatus(ElevatorLocationStatus.OUT_OF_RANGE);
    }
  };

  const getPosition = async () => {
    try {
      return await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });
    } catch (error) {
      return null;
    }
  };

  const getDefaultProperty = async (): Promise<UnitDetail | null> => {
    try {
      const {data} = await serviceMindService.properties();
      const properties = data.properties as UnitDetail[];
      const selectedUnit = residentialUnitSelectedState.selectedUnit.value;
      if (selectedUnit !== '') {
        const selectedProperty = properties.find(
          e => e.houseNumber === selectedUnit,
        );
        if (selectedProperty) {
          return selectedProperty;
        }
      } else {
        const defaultProperty: UnitDetail =
          properties.find((property: UnitDetail) => property.isDefault) ??
          properties[0];
        if (defaultProperty) {
          return defaultProperty;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const navigateToErrorScreen = () => {
    navigation.navigate('AnnouncementResidentialScreen', {
      type: 'error',
      title: t('Residential__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Residential__Announcement__Error_generic__Body',
        'Please wait a bit before trying again',
      ),
      buttonText: t('Residential__Back_to_explore', 'Back to explore'),
      screenHook: 'ResidentialHomeScreen',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('ResidentialHomeScreen'),
    });
  };

  return (
    <>
      <ScreenContainer
        bgColor="#ffffff"
        barStyle="dark-content"
        isLoading={isLoading}>
        <View className="w-full bg-white">
          <Header
            leftAction="goBack"
            titleColor="dark-gray"
            bgColor="bg-white"
          />
          <Spacing height={8} />
          <View className="px-5">
            <HeadText
              tagline={t('Residential__Residential', 'Residences')}
              title={t('Residential__Elevator__Elevator', 'Call Elevator')}
              titleColor="default"
              taglineColor="subtitle-muted"
              descriptionColor="subtitle-muted"
              descriptionSpacing={16}
            />
          </View>
        </View>
        {status === ElevatorLocationStatus.BLOCKED && <LocationPermission />}
        {status === ElevatorLocationStatus.UNKNOWN && <LocationDisable />}
        {status === ElevatorLocationStatus.OUT_OF_RANGE && <ErrorOutOfRange />}
      </ScreenContainer>

      {status === ElevatorLocationStatus.UNKNOWN && (
        <StickyButton
          title={t('Residential__Elevator__Allow_Now', 'Allow now')}
          className="bg-dark-teal-dark"
          rightIcon="next"
          iconHeight={20}
          iconWidth={20}
          onPress={requestLocation}
          disabled={isLoading}
        />
      )}
      {status === ElevatorLocationStatus.OUT_OF_RANGE && (
        <StickyButton
          title={t('Residential__Elevator__General__Try_Again', 'Try again')}
          className="bg-dark-teal-dark"
          rightIcon="next"
          iconHeight={20}
          iconWidth={20}
          onPress={checkLocationPermission}
          disabled={isLoading}
        />
      )}
    </>
  );
};

export default ElevatorScreen;
