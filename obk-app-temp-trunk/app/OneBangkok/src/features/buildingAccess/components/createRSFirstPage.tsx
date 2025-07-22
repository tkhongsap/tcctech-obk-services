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
import {
  createRequestServiceAction,
  useCreateRequestServiceState,
} from '../store/requestService';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {buildingAccessAction} from '../store/buildingAccess';
import SelectList, {ListSelect} from '~/components/molecules/SelectList';
import {activeOpacity} from '~/constants';
import {find} from 'lodash';
import bmsService from '~/services/bmsService';
import {issueTypeAction} from '../store/issueTypes';
import { sortedIssue } from '~/utils/sorted';

enum SelectType {
  Building = 'building',
  Floor = 'floor',
  IssueType = 'issueType',
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

    case SelectType.IssueType:
      title = t('General__Issue', 'Issue');
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
        <SelectList
          data={options}
          onPress={handleSelection}
          selected={selectedId}
        />
      </ScrollView>
    </>
  );
};

interface CreateRSFirstPageProps {
  onNextStep: Function;
}

const CreateRSFirstPage = ({onNextStep}: CreateRSFirstPageProps) => {
  const {towerId, floorId, issueTypeId} = useCreateRequestServiceState();

  const {...methods} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      building: towerId.value,
      floor: floorId.value,
      issueType: issueTypeId.value,
    },
  });
  const [towerList, setTowerList] = useState<ListSelect[]>([]);
  const [locationList, setLocationList] = useState<ListSelect[]>([]);
  const [issueTypeList, setIssueTypeList] = useState<ListSelect[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState(towerId.value ?? '');
  const [selectedFloor, setSelectedFloor] = useState(floorId.value ?? '');
  const [selectedIssueType, setSelectedIssueType] = useState(
    issueTypeId.value ?? '',
  );
  const [_modalState, modalActions] = useModal();
  const handleOnPress: SubmitHandler<FieldValues> = async data => {
    createRequestServiceAction.setValueRSFirstPage(
      data.building,
      data.floor,
      data.issueType,
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

  const mapIssueType = useCallback(async () => {
    const issueType = await issueTypeAction.mapIssueType(languageSelected);
    setIssueTypeList(issueType);
  }, [languageSelected]);

  const getIssueTypes = async () => {
    await bmsService.getIssueTypes();
    mapIssueType();
  };

  useEffect(() => {
    mapTower();
    getIssueTypes();
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
  const onSelectIssueType = (_value: string) => {
    methods.setValue('issueType', _value);
    setSelectedIssueType(_value);
    modalActions.hide();
  };

  useEffect(() => {
    if (selectedBuilding) {
      mapLocation();
    }
    if (selectedBuilding && selectedBuilding !== towerId.value) {
      setSelectedFloor('');
      methods.setValue('floor', '');
    }
  }, [towerId.value, mapLocation, selectedBuilding]);

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
  const ModalSelectIssueType = () => {
    sortedIssue(issueTypeList)
    methods.clearErrors('issueType');
    modalActions.setMaxHeight('80%');
    modalActions.setContent(
      <ModalSelectBuildingOrFloor
        selected={selectedIssueType}
        options={issueTypeList}
        onPressCancel={() => modalActions.hide()}
        onPressDone={onSelectIssueType}
        type={SelectType.IssueType}
      />,
    );
    modalActions.show();
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

  const getNameIssueType = useCallback(() => {
    const issueTypeObj = find(issueTypeList, {
      value: selectedIssueType,
    });

    return issueTypeObj?.name;
  }, [selectedIssueType, issueTypeList]);

  const disableIssueType = useCallback(() => {
    return selectedBuilding === '' || selectedFloor === '';
  }, [selectedBuilding, selectedFloor]);

  return (
    <>
      <ScrollView className="w-screen px-4 py-8">
        <Pressable>
          <HeadText
            tagline={t('General__Location_&_issue', 'Location & Issue')}
            title={t('General__Where_and_what_is_the_issue?', 'Where and what is the issue?')}
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
                    'General__Select_building_header',
                    'Select the building that needs service work',
                  )}
                  rules={{
                    required: t('Visitor_pass__Visitor_create_2__Error_building', 'Please select the building'),
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
                  labelText={t('General__Select_floor_header', 'Select the floor in that building')}
                  rules={{
                    required:
                      selectedBuilding !== '' &&
                      t('Visitor_pass__Visitor_create_2__Error_floor', 'Please select the floor'),
                  }}
                  disabled={selectedBuilding === ''}
                />
              </View>
            </TouchableOpacity>

            <Spacing height={24} />
            <TouchableOpacity
              onPress={() => ModalSelectIssueType()}
              activeOpacity={activeOpacity}
              disabled={disableIssueType()}>
              <View pointerEvents="none">
                <TextInput
                  name={'issueType'}
                  defaultValue={getNameIssueType()}
                  value={getNameIssueType()}
                  autoCorrect={false}
                  autoCapitalize="none"
                  placeholderTextColor={Colors.black40}
                  placeholder={t('General__Select_issue', 'Select issue')}
                  labelText={t('General__Select_issue_header', 'Select the type of issue')}
                  rules={{
                    required:
                      !disableIssueType() &&
                      t('General__Select_issue_error', 'Please select the type of issue'),
                  }}
                  disabled={disableIssueType()}
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
export default CreateRSFirstPage;
