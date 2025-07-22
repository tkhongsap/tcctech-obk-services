import {ImmutableObject} from '@hookstate/core';
import {find, first, get, isUndefined} from 'lodash';
import {AuthorizedLocationData, FloorData} from 'ob-bms-sdk/dist/api';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import {ScrollView, View} from 'react-native';
import {HeadText, Header, StickyButton, useModal} from '~/components/molecules';
import {Screen} from '~/components/templates';
import {
  memberAction,
  memberState,
} from '~/features/buildingAccess/store/member';
import t from '~/utils/text';
import {
  Confirmation,
  ExitConfirmation,
} from '~/components/organisms/GenericModal';
import {Spacing, Text} from '~/components/atoms';
import FloorList from '../components/FloorList';
import {hideLoading, showLoading} from '~/states/loadingState';
import {useNavigation} from '~/navigations/AppNavigation';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import {sortedFloor} from '~/utils/sorted';

const ChangeDefaultFloorScreen = () => {
  const [floors, setFloors] = useState<ImmutableObject<FloorData>[]>([]);
  const [towerName, setTowerName] = useState('');
  const [location, setLocation] = useState<
    ImmutableObject<AuthorizedLocationData>[]
  >([]);
  const [defaultFloor, setDefaultFloor] = useState('');
  const [_modalState, modalActions] = useModal();
  const navigation = useNavigation();

  const {...methods} = useForm({mode: 'onSubmit', reValidateMode: 'onSubmit'});

  const onPressCancel = () => {
    modalActions.hide();
  };

  const onPressContinue = async (floorId: string) => {
    showLoading();
    await memberAction.changeDefaultFloor(floorId);
    const selectedLocation = find(location, {floor_id: floorId});
    if (selectedLocation) {
      memberState.default_floor.set(selectedLocation.id);
    }
    hideLoading();
    modalActions.hide();
    navigation.goBack();
  };

  const onConfirmExit = () => {
    modalActions.hide();
    navigation.goBack();
  };

  const onPressLeftAction = async () => {
    modalActions.setContent(
      <ExitConfirmation onContinue={onConfirmExit} onCancel={onPressCancel} />,
    );
    modalActions.show();
  };

  const handleOnPress: SubmitHandler<FieldValues> = async data => {
    if (!isUndefined(data.FloorList)) {
      const destinationFloor = find(floors, {id: data.FloorList});
      const floorName = get(destinationFloor, ['display_name', 'en'], '');
      const destination = `${towerName}, Floor ${floorName}`;
      modalActions.setContent(
        <Confirmation
          title={t(
            'Drawer__Change_default_floor__Header',
            'Confirm changing your default floor?',
          )}
          description={t(
            'Drawer__Change_default_floor__Body',
            'Your default building access will be changed to "{{destination}}"',
            {destination},
          )}
          onContinue={() => {
            onPressContinue(data.FloorList);
          }}
          onCancel={onPressCancel}
        />,
      );
      modalActions.show();
    }
  };

  const getMember = useCallback(async () => {
    const currentLanguage = appLanguageActions.getLanguage();

    const result = await memberAction.getMember();
    if (result) {
      const tower = first(memberState.towers.value);
      if (tower) {
        const name = get(tower, ['display_name', 'en'], '');
        setTowerName(name);

        const sortFloors = sortedFloor([...tower.floors], currentLanguage);
        setFloors(sortFloors);
        setLocation(
          tower.locations as ImmutableObject<AuthorizedLocationData>[],
        );
        const defaultLocation = find(tower.locations, {
          id: memberState.default_floor.value,
        });

        if (defaultLocation) {
          setDefaultFloor(defaultLocation.floor_id);
        }
      }
    }
  }, []);

  useEffect(() => {
    getMember();
  }, [getMember]);

  return (
    <Screen>
      <Header
        leftAction="goBack"
        title={t('General__Building_access', 'Building access')}
        onPressLeftAction={onPressLeftAction}
      />
      <View className="w-full px-5">
        <HeadText
          tagline={t('General__Building', 'Building')}
          title={towerName}
          titleSize="H3"
          titleClamps="leading-[26.4]"
        />
        <Spacing height={40} />
        <Text size="B1" weight="medium">
          {t('General__Select_default_floor', 'Select default Floor')}
        </Text>
        <Spacing height={12} />
      </View>
      <ScrollView className="w-full px-5">
        <FormProvider {...methods}>
          <FloorList
            destinationFloors={floors}
            name={'FloorList'}
            defaultFloor={defaultFloor}
          />
        </FormProvider>
      </ScrollView>
      <View className="flex-grow" />
      <StickyButton
        title={t('General__Continue', 'Continue')}
        rightIcon="next"
        onPress={methods.handleSubmit(handleOnPress)}
      />
    </Screen>
  );
};

export default ChangeDefaultFloorScreen;
