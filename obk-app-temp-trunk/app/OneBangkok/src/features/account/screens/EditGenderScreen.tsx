import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {Screen} from '~/components/templates';
import {
  Button,
  Header,
  ListSection,
  StickyButton,
  modalActions,
} from '~/components/molecules';
import {accountState} from '~/states/account/accountState';
import t from '~/utils/text';
import {Spacing} from '~/components/atoms/Spacing';
import {useHookstate} from '@hookstate/core';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import {Text} from '~/components/atoms/Text';
import accountAction from '~/states/account/accountAction';
import {ExitConfirmation} from '~/components/organisms/GenericModal';
import {Gender} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {AnnouncementType} from '~/components/Announcement';
import {useScreenHook} from '~/services/EventEmitter';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {useBackHandlerChangeState} from '~/utils/useBackHandler';
import SelectList, {ListSelect} from '~/components/molecules/SelectList';

const goToAnnoucement = (
  navigation: StackNavigation,
  type: AnnouncementType,
  title: string,
  message: string,
) => {
  navigation.navigate('AnnouncementScreen', {
    type,
    title,
    message,
    buttonText: t('General__Back_to_explore', 'Back to Explore'),
    screenHook: 'EditGenderScreen',
  });
};

const ConfirmModal = ({onCancel, selectedGender}: any) => {
  const navigation = useNavigation<StackNavigation>();

  const onPressConfirm = async () => {
    try {
      const success = await accountAction.updateProfile({
        gender: selectedGender,
      });
      if (success) {
        accountAction.getProfile();
        modalActions.hide();
        navigation.navigate('AccountInfoScreen');
      } else {
        modalActions.hide();
        goToAnnoucement(
          navigation,
          'error',
          t('General__Something_went_wrong', 'Something\nwent wrong'),
          t(
            'Announcement__Error_generic__Body',
            'Please wait and try again soon.',
          ),
        );
      }
    } catch (error) {
      console.log('Cannot update gender: ' + error);
    }
  };
  const gender = {
    female: t('General__Female', 'Female'),
    male: t('General__Male', 'Male'),
    nonbinary: t('General__Nonbinary', 'Non-binary'),
    prefernottosay: t('General__Prefer_not_to_say', 'Prefer not to say'),
  };

  return (
    <>
      <Text size="B1" weight="medium">
        {t(
          'Drawer__Edit_gender_confirm__Header',
          'Confirm changing your gender?',
        )}
      </Text>
      <Text color="muted" size="B2">
        {t(
          'Drawer__Edit_gender_confirm__Body',
          'Your gender will be changed to “{{gender}}"',
          {gender: gender[selectedGender as keyof Gender]},
        )}
      </Text>
      <Spacing height={16} />
      <Button
        color="navy"
        title={t('General__Confirm', 'Confirm')}
        onPress={onPressConfirm}
      />
      <Spacing height={12} />
      <Button
        title={t('General__Cancel', 'Cancel')}
        outlined={true}
        onPress={onCancel}
      />
    </>
  );
};

const EditGenderScreen = (_props: any) => {
  const navigation = useNavigation<StackNavigation>();
  const state = useHookstate(accountState);
  const defaultSelected = state.profile.value?.gender;
  const [gender, setGender] = useState<Gender>(defaultSelected);

  const genderOptions: ListSelect[] = [
    {
      name: t('General__Female', 'Female'),
      value: 'female',
    },
    {
      name: t('General__Male', 'Male'),
      value: 'male',
    },
    {
      name: t('General__Nonbinary', 'Non-binary'),
      value: 'nonbinary',
    },
    {
      name: t('General__Prefer_not_to_say', 'Prefer not to say'),
      value: 'prefernottosay',
    },
  ];

  const handleGenderSelection = (value: Gender) => {
    setGender(value);
  };

  const handleOnPress = () => {
    modalActions.setContent(
      <ConfirmModal
        onCancel={() => modalActions.hide()}
        selectedGender={gender}
      />,
    );
    modalActions.show();
  };

  const handleOnPressLeftAction = () => {
    if (defaultSelected !== gender) {
      modalActions.setContent(
        <ExitConfirmation
          onContinue={() => {
            modalActions.hide();
            navigation.goBack();
          }}
          onCancel={() => modalActions.hide()}
        />,
      );
      modalActions.show();
    } else {
      navigation.goBack();
    }
  };

  useBackHandlerChangeState(() => {
    handleOnPressLeftAction();
    return true;
  });

  useScreenHook('EditGenderScreen', async event => {
    switch (event.name) {
      case AnnouncementScreenEventNames.CONTINUE:
        if (event.from.params.type === 'error') {
          navigation.navigate('HomeScreen');
          break;
        } else if (event.from.params.type === 'success') {
          navigation.navigate('HomeScreen');
          break;
        }
        break;
      default:
        break;
    }
  });

  return (
    <Screen>
      <Header
        leftAction="goBack"
        title={t('General__Gender', 'Gender')}
        onPressLeftAction={handleOnPressLeftAction}
      />
      <ScrollView className="w-full px-5">
        <Spacing height={24} />
        <SelectList
          data={genderOptions}
          onPress={handleGenderSelection}
          selected={defaultSelected!}
        />
      </ScrollView>
      <StickyButton
        title={t('General__Continue', 'Continue')}
        rightIcon="next"
        onPress={handleOnPress}
      />
    </Screen>
  );
};

export default EditGenderScreen;
