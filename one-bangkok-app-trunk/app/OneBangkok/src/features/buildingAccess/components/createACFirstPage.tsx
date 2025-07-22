import React, {useCallback, useEffect, useState} from 'react';
import t from '~/utils/text';

import {Pressable, ScrollView, TouchableOpacity, View} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {TextInput} from '~/components/molecules/TextInput';
import {Colors} from '~/constants/Colors';
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';
import {HeadText, StickyButton, useModal} from '~/components/molecules';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {
  buildingAccessAction,
  buildingAccessState,
} from '../store/buildingAccess';
import SelectList, {ListSelect} from '~/components/molecules/SelectList';
import {activeOpacity} from '~/constants';
import {find, isEmpty, orderBy} from 'lodash';
import {
  createAirConditionerRequestAction,
  useCreateAirConditionerRequestState,
} from '../store/airConditionerRequest';
import SelectMultipleList from '~/components/molecules/SelectMultipleList';
import {ImageBackground} from '~/components/organisms/ImageBackground';
import FastImage from 'react-native-fast-image';
import {IMAGE} from '~/assets/image';
import { sortedZone } from '~/utils/sorted';
enum SelectType {
  Building = 'building',
  Zone = 'zone',
  Floor = 'floor',
}

const ModalSelectBuildingOrFloor = ({
  options,
  selected,
  onPressCancel,
  onPressDone,
  type,
}: {
  options: ListSelect[];
  selected: string;
  onPressCancel: any;
  onPressDone: any;
  type: SelectType;
}) => {
  const [selectedId, setSelectedId] = useState(selected);

  const handleSelection = (value: string) => {
    setSelectedId(value);
  };
  let title = '';
  switch (type) {
    case SelectType.Building:
      title = t('General__Building', 'Building');
      break;

    case SelectType.Floor:
      title = t('General__Floor', 'Floor');
      break;
    default:
      break;
  }

  return (
    <>
      <View className="flex flex-row justify-between h-[42px] items-center">
        <Text
          testID="date-picker-cancel-id"
          color="primary"
          weight="medium"
          onPress={onPressCancel}>
          {t('General__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium" className="flex-1 text-center">
          {title}
        </Text>
        <Text
          testID="date-picker-done-id"
          color="primary"
          weight="medium"
          className="text-right"
          onPress={() => onPressDone && onPressDone(selectedId)}>
          {t('General__Done', 'Done')}
        </Text>
      </View>
      <ScrollView className="w-full">
        <Spacing height={24} />
        <Spacing height={24} />
        <SelectList
          data={options}
          onPress={handleSelection}
          selected={selectedId}
        />
      </ScrollView>
    </>
  );
};

const ModalSelectZone = ({
  options,
  imageZone,
  selected,
  onPressCancel,
  onPressDone,
}: {
  options: ListSelect[];
  imageZone?: string;
  selected: any;
  onPressCancel: any;
  onPressDone: any;
}) => {
  const [selectedId, setSelectedId] = useState(selected);
  const handleSelection = (value: string[]) => {
    setSelectedId(value);
  };

  return (
    <>
      <View className="flex flex-row justify-between h-[42px] items-center">
        <Text
          testID="date-picker-cancel-id"
          color="primary"
          weight="medium"
          onPress={onPressCancel}>
          {t('General__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium" className="flex-1 text-center">
          {t('General__Zone', 'Zone')}
        </Text>
        <Text
          testID="date-picker-done-id"
          color="primary"
          weight="medium"
          className="text-right"
          onPress={() => onPressDone && onPressDone(selectedId)}>
          {t('General__Done', 'Done')}
        </Text>
      </View>
      <ScrollView className="w-full">
        <Spacing height={24} />
        <View className="h-[300px]">
          <ImageBackground
            url={imageZone}
            defaultImage={IMAGE.DEFAULT_ZONE}
            height={300}
            width="100%"
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <Spacing height={24} />
        <SelectMultipleList
          data={options}
          onPress={handleSelection}
          selected={selectedId}
        />
      </ScrollView>
    </>
  );
};

interface CreateACFirstPageProps {
  onNextStep: Function;
}

const CreateACFirstPage = ({onNextStep}: CreateACFirstPageProps) => {
  const {towerId, floorId, acZoneId} = useCreateAirConditionerRequestState();

  const {...methods} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      building: towerId.value,
      floor: floorId.value,
      acZone: acZoneId.value,
    },
  });

  const [towerList, setTowerList] = useState<ListSelect[]>([]);
  const [locationList, setLocationList] = useState<ListSelect[]>([]);
  const [acZoneList, setACZoneList] = useState<ListSelect[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState(towerId.value ?? '');
  const [selectedFloor, setSelectedFloor] = useState(floorId.value ?? '');
  const [selectedACZone, setSelectedACZone] = useState(acZoneId.value ?? []);
  const [_modalState, modalActions] = useModal();
  const handleOnPress: SubmitHandler<FieldValues> = async data => {
    createAirConditionerRequestAction.setValueACFirstPage(
      data.building,
      data.floor,
      data.acZone,
    );
    onNextStep && onNextStep();
  };

  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const mapTower = useCallback(async () => {
    const towers = await buildingAccessAction.mapTower(languageSelected);
    setTowerList(towers);
  }, [languageSelected]);

  const mapACZone = useCallback(async (floorId: string) => {
    const acZones = await buildingAccessAction.mapACZone(floorId);
    if (acZones) {
      setACZoneList(acZones);
    }
  }, []);

  useEffect(() => {
    mapTower();
  }, []);

  const mapLocation = useCallback(async () => {
    const locations = await buildingAccessAction.mapLocation(
      languageSelected,
      selectedBuilding,
    );
    if (locations) {
      setLocationList(locations);
    }
  }, [languageSelected, selectedBuilding]);

  const onSelectBuilding = (_value: string) => {
    methods.setValue('building', _value);
    setSelectedBuilding(_value);
    modalActions.hide();
  };
  const onSelectFloor = (_value: string) => {
    methods.setValue('floor', _value);
    setSelectedFloor(_value);
    modalActions.hide();
  };
  const onSelectACZone = (_value: string[]) => {
    methods.setValue('acZone', _value);
    setSelectedACZone(_value);
    modalActions.hide();
  };

  useEffect(() => {
    if (selectedBuilding) {
      mapLocation();
    }
    if (selectedBuilding && selectedBuilding !== towerId.value) {
      setSelectedFloor('');
      methods.setValue('floor', '');
      setSelectedACZone([]);
      methods.setValue('acZone', []);
    }
  }, [towerId.value, mapLocation, selectedBuilding]);

  useEffect(() => {
    if (selectedFloor) {
      mapACZone(selectedFloor);
    }
    if (selectedFloor && selectedFloor !== floorId.value) {
      setSelectedACZone([]);
      methods.setValue('acZone', []);
    }
  }, [floorId.value, selectedFloor]);

  const ModalSelectBuilding = () => {
    methods.clearErrors('building');
    modalActions.setContent(
      <ModalSelectBuildingOrFloor
        selected={selectedBuilding}
        options={towerList}
        onPressCancel={() => modalActions.hide()}
        onPressDone={onSelectBuilding}
        type={SelectType.Building}
      />,
    );
    modalActions.show();
  };
  const ModalSelectFloors = () => {
    methods.clearErrors('floor');
    modalActions.setMaxHeight('50%');
    modalActions.setContent(
      <ModalSelectBuildingOrFloor
        selected={selectedFloor}
        options={locationList}
        onPressCancel={() => modalActions.hide()}
        onPressDone={onSelectFloor}
        type={SelectType.Floor}
      />,
    );
    modalActions.show();
  };
  const ModalSelectACZone = () => {
    const _towerList = buildingAccessState.towers.value ?? [];
    const index = _towerList.map(e => e.id).indexOf(selectedBuilding);
    if (index > -1) {
      const floorObj = find(_towerList[index].floors, {
        id: selectedFloor,
      });
      methods.clearErrors('acZone');
      modalActions.setMaxHeight('80%');
      modalActions.setContent(
        <ModalSelectZone
          selected={selectedACZone}
          options={acZoneList}
          onPressCancel={() => modalActions.hide()}
          onPressDone={onSelectACZone}
          imageZone={floorObj.image}
        />,
      );
      modalActions.show();
    }
  };

  const getNameBuilding = useCallback(() => {
    const buildingObj = find(towerList, {
      value: selectedBuilding,
    });

    return buildingObj?.name;
  }, [selectedBuilding, towerList]);

  const getNameFloor = useCallback(() => {
    const floorObj = find(locationList, {
      value: selectedFloor,
    });

    return floorObj?.name;
  }, [selectedFloor, locationList]);

  const getNameACZone = useCallback(() => {
    const acZones: string[] = [];
    selectedACZone?.forEach(selected => {
      const existingZone = find(acZoneList, {
        value: selected,
      });
      if (existingZone) {
        acZones.push(existingZone.name);
      }
    });
    const sortedZones = sortedZone(acZones)

    return sortedZones?.join(', ');
  }, [selectedACZone, acZoneList]);

  const enableSelectACZone = useCallback(() => {
    return selectedFloor === '' || isEmpty(acZoneList);
  }, [selectedFloor, acZoneList]);

  return (
    <>
      <ScrollView className="w-screen px-4 py-8">
        <Pressable>
          <HeadText
            tagline={t('General__Location', 'Location')}
            title={t(
              'Otac__Create_1__Description',
              'Where would you like to request AC Overtime?',
            )}
            titleSize="H3"
            titleClamps="leading-[26.4]"
          />
          <FormProvider {...methods}>
            <Spacing height={24} />
            <TouchableOpacity
              onPress={() => ModalSelectBuilding()}
              activeOpacity={activeOpacity}>
              <View pointerEvents="none">
                <TextInput
                  name={'building'}
                  defaultValue={getNameBuilding()}
                  value={getNameBuilding()}
                  autoCorrect={false}
                  autoCapitalize="none"
                  placeholderTextColor={Colors.black40}
                  placeholder={t('General__Select_building', 'Select building')}
                  labelText={t(
                    'Otac__Create_1__Select_building',
                    'Select the building you would like AC Overtime',
                  )}
                  rules={{
                    required: t(
                      'Visitor_pass__Visitor_create_2__Error_building',
                      'Please select the building',
                    ),
                  }}
                />
              </View>
            </TouchableOpacity>

            <Spacing height={24} />
            <TouchableOpacity
              onPress={() => ModalSelectFloors()}
              activeOpacity={activeOpacity}
              disabled={selectedBuilding === ''}>
              <View pointerEvents="none">
                <TextInput
                  name={'floor'}
                  defaultValue={getNameFloor()}
                  value={getNameFloor()}
                  autoCorrect={false}
                  autoCapitalize="none"
                  placeholderTextColor={Colors.black40}
                  placeholder={t('General__Select_floor', 'Select floor')}
                  labelText={t(
                    'General__Select_floor_header',
                    'Select the floor in that building',
                  )}
                  rules={{
                    required:
                      selectedBuilding &&
                      t(
                        'Visitor_pass__Visitor_create_2__Error_floor',
                        'Please select the floor',
                      ),
                  }}
                  disabled={selectedBuilding === ''}
                />
              </View>
            </TouchableOpacity>

            <Spacing height={24} />
            <TouchableOpacity
              onPress={() => ModalSelectACZone()}
              activeOpacity={activeOpacity}
              disabled={enableSelectACZone()}>
              <View pointerEvents="none">
                <TextInput
                  name={'acZone'}
                  defaultValue={getNameACZone()}
                  value={getNameACZone()}
                  autoCorrect={false}
                  autoCapitalize="none"
                  placeholderTextColor={Colors.black40}
                  placeholder={t('General__Select_zone', 'Select zone')}
                  labelText={t(
                    'Otac__Create_1__Select_zone',
                    'Select the zone on that floor',
                  )}
                  rules={{
                    required:
                      !enableSelectACZone() &&
                      t('General__Select_zone_error', 'Please select the zone'),
                  }}
                  disabled={enableSelectACZone()}
                />
              </View>
            </TouchableOpacity>

            <Spacing height={24} />
          </FormProvider>
          <Spacing height={80} />
        </Pressable>
      </ScrollView>

      <StickyButton
        title={t('General__Next', 'Next')}
        onPress={methods.handleSubmit(handleOnPress)}
        rightIcon="next"
      />
    </>
  );
};
export default CreateACFirstPage;
