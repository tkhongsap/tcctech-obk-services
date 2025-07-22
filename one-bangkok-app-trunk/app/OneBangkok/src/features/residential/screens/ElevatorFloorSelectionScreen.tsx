import {View, ScrollView} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {HeadText} from '~/components/molecules';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import React, {useEffect, useState} from 'react';
import SelectList, {
  ListSelect,
} from '~/features/residential/components/SelectList';
import ElevatorSlideButton from '~/features/residential/components/ElevatorSlideButton';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {UnitDetail} from '~/states/residentialTenant/residentialTenantState';
import serviceMindService from '~/services/residentialService/ServiceMindService';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ElevatorFloorSelectionScreen'
>;

const ElevatorFloorSelectionScreen = ({route: {params}}: Props) => {
  const navigation = useNavigation<StackNavigation>();
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();
  const [isLoading, setIsLoading] = useState(false);
  const [slideActive, setSlideActive] = useState(false);
  const [selectionHashError, setSelectionHashError] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string>();
  const [floors, setFloors] = useState<ListSelect[]>([]);
  // const [personID, setPersonID] = useState(params.personID);

  useEffect(() => {
    getPropertyDetail(params.property.propertyUnitId);
  }, []);

  useEffect(() => {
    if (slideActive) {
      if (!selectedFloor) {
        setSelectionHashError(true);
        setSlideActive(false);
      } else {
        navigation.navigate('ResidentialElevatorWaitingScreen', {
          locationID: selectedFloor,
          personID: params.personID,
        });
        setSlideActive(false);
      }
    }
  }, [slideActive]);

  const getPropertyDetail = async (id: string) => {
    try {
      setIsLoading(true);
      const {data} = await serviceMindService.propertyDetail(id);
      const property = data.property as UnitDetail;
      const residenceAuthFloor = property.bimData.residenceAuthFloor;
      setFloors(
        residenceAuthFloor.map(e => ({
          value: e.locations[0].locationID.toString(),
          name: e.floorName.toString(),
        })),
      );
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectFloor = (value: string) => {
    setSelectedFloor(value);
    if (selectionHashError) setSelectionHashError(false);
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

  const onPressLeftAction = async () => {
    navigation.navigate('ResidentialHomeScreen');
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
            onPressLeftAction={onPressLeftAction}
            titleColor="dark-gray"
            bgColor="bg-white"
          />
          <Spacing height={8} />
          <View className="px-5">
            <HeadText
              tagline={t('Residential__Residential', 'Residences')}
              title={
                language === 'th'
                  ? params.property.projectsNameThai
                  : params.property.projectsName
              }
              description={t(
                'Residential__Elevator__Floor_Selection_Description',
                'Currently in the {{project}} Building,\nPlease select your current floor.',
                {
                  project:
                    language === 'th'
                      ? params.property.projectsNameThai
                      : params.property.projectsName,
                },
              )}
              titleColor="default"
              taglineColor="subtitle-muted"
              descriptionColor="subtitle-muted"
              descriptionSpacing={16}
            />
          </View>
          <Spacing height={28} />
        </View>
        <View className="w-full px-4 flex justify-start">
          <Text size="B1" weight="medium" color="dark-gray">
            {t(
              'Residential__Elevator__General__Current_floor',
              'Current floor',
            )}
          </Text>
          <Spacing height={8} />
        </View>

        <View className="w-full">
          <ScrollView
            className={getTheme('bg-vp-list z-10 px-4')}
            scrollEnabled={floors.length >= 8}>
            <View>
              <SelectList
                data={floors}
                selected=""
                onPress={onSelectFloor}
                hasError={selectionHashError}
              />
              <Spacing height={8} />
              {selectionHashError && (
                <Text size="B2" weight="regular" color="fire-engine-red">
                  {t(
                    'Building__access__Elevator__floor__selection__Error',
                    'Please, select one option',
                  )}
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      </ScreenContainer>

      <View className="p-4 bg-white mb-[30]">
        <ElevatorSlideButton
          onActive={setSlideActive}
          unlockedStatus={slideActive}
        />
      </View>
    </>
  );
};

export default ElevatorFloorSelectionScreen;
