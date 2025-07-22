import React, {useEffect, useState} from 'react';
import {Screen} from '~/components/templates';
import {
  DatePickerField,
  Header,
  StickyButton,
  modalActions,
} from '~/components/molecules';
import t from '~/utils/text';
import {View} from 'react-native';
import {ScrollView} from 'react-native';
import {
  Confirmation,
  ExitConfirmation,
} from '~/components/organisms/GenericModal';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import dayjs, {Dayjs} from 'dayjs';
import accountAction from '~/states/account/accountAction';
import {AnnouncementType} from '~/components/Announcement';
import {useScreenHook} from '~/services/EventEmitter';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import DateTime from '~/utils/datetime';
import {useAccountState} from '~/states/account/accountState';
import {useBackHandlerChangeState} from '~/utils/useBackHandler';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import accountService from '~/services/accountService/AccountService';
import {logScreenView} from '~/utils/logGA';

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
    screenHook: 'EditDobScreen',
  });
};

type Props = NativeStackScreenProps<RootStackParamList, 'EditDobScreen'>;

const EditDobScreen = ({
  route: {
    params: {dob},
  },
}: Props) => {
  const navigation = useNavigation<StackNavigation>();
  const dateValue = dob ? dayjs(dob) : null;
  const {profile} = useAccountState();
  const [dateOfBirth, setDateOfBirth] = useState<any>(dateValue);

  const handleOnChange = (date: Dayjs) => {
    setDateOfBirth(DateTime.convertToUTC(date).toDate());
  };

  const handleOnPress = () => {
    const onPressConfirm = async () => {
      const isDobUpdated = await accountService.submitNewBirthday(dateOfBirth);
      if (isDobUpdated === true) {
        await accountAction.getProfile();
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
    };

    const formattedDate = DateTime.formatDateNoTimeZone(dateOfBirth as Date);

    modalActions.setContent(
      <Confirmation
        title={t(
          'Drawer__Edit_dob_confirm__Header',
          'Confirm changing your date of birth?',
        )}
        description={t(
          'Drawer__Edit_dob_confirm__Body',
          'Your date of birth will be changed to “{{dob}}”',
          {
            dob: formattedDate,
          },
        )}
        onContinue={onPressConfirm}
        onCancel={() => modalActions.hide()}
      />,
    );
    modalActions.show();
  };

  useBackHandlerChangeState(() => {
    handleOnPressLeftAction();
    return true;
  });

  const handleOnPressLeftAction = () => {
    const dateDiff = dayjs(profile.value!.dob).diff(dayjs(dateOfBirth));
    if (dateDiff !== 0) {
      modalActions.setContent(
        <ExitConfirmation
          onContinue={async () => {
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

  useScreenHook('EditDobScreen', async event => {
    switch (event.name) {
      case AnnouncementScreenEventNames.CONTINUE:
        if (event.from.params.type === 'error') {
          navigation.navigate('HomeScreen');
          break;
        }
        break;
      default:
        break;
    }
  });

  useEffect(() => {
    logScreenView('EditDobScreen');
  }, []);

  return (
    <Screen>
      <Header
        title={t('General__Personal_info', 'Personal information')}
        leftAction="goBack"
        onPressLeftAction={handleOnPressLeftAction}
      />
      <ScrollView className="w-full px-8">
        <View>
          <DatePickerField
            labelText={t('General__Your_birthday', 'Your birthday')}
            value={dateOfBirth ? dayjs(dateOfBirth) : null}
            onChange={handleOnChange}
            icon={'calendar'}
            IconColor={'#000000'}
            style={{textAlign: 'left', fontFamily: 'OneBangkok-Regular'}}
          />
        </View>
      </ScrollView>
      <StickyButton
        title={t('General__Continue', 'Continue')}
        rightIcon="next"
        onPress={handleOnPress}
      />
    </Screen>
  );
};

export default EditDobScreen;
