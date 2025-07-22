import React, {useEffect} from 'react';
import {ScrollView} from 'react-native';
import {Spacing} from '~/components/atoms/Spacing';
import {Header, StickyButton, modalActions} from '~/components/molecules';
import {Screen} from '~/components/templates';
import t from '~/utils/text';
import {useNavigation} from '@react-navigation/native';
import {AnnouncementType} from '~/components/Announcement';
import {StackNavigation} from '~/navigations/AppNavigation';
import {useScreenHook} from '~/services/EventEmitter';
import {
  Confirmation,
  ExitConfirmation,
} from '~/components/organisms/GenericModal';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import accountAction from '~/states/account/accountAction';
import {TextInput} from '~/components/molecules/TextInput';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import {TextValidations} from '~/utils/validation';
import {useAccountState} from '~/states/account/accountState';
import {useBackHandlerChangeState} from '~/utils/useBackHandler';
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
    screenHook: 'ChangeNameScreen',
  });
};

const ChangeNameScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  const {profile} = useAccountState();
  const {...methods} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      firstName: profile.value?.first_name,
      middleName: profile.value?.middle_name,
      lastName: profile.value?.last_name,
    },
  });

  useBackHandlerChangeState(() => {
    handleOnPressLeftAction();
    return true;
  });

  const handleOnPressLeftAction = () => {
    const formEdited = methods.formState.dirtyFields;

    if (Object.keys(formEdited).length > 0) {
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
  const handleOnPress: SubmitHandler<FieldValues> = async data => {
    const onPressConfirm = async () => {
      const isNameUpdated = await accountService.submitNewName(
        data.firstName,
        data.middleName,
        data.lastName,
      );
      if (isNameUpdated === true) {
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

    modalActions.setContent(
      <Confirmation
        onCancel={() => modalActions.hide()}
        title={t(
          'Drawer__Edit_name_confirm__Header',
          'Confirm changing your name?',
        )}
        description={t(
          'Drawer__Edit_name_confirm__Body',
          'Your name will be changed to “{{firstName}} {{middleName}} {{lastName}}”',
          {
            firstName: data.firstName?.trim(),
            middleName: data.middleName?.trim(),
            lastName: data.lastName?.trim(),
          },
        )}
        onContinue={onPressConfirm}
      />,
    );
    modalActions.show();
  };

  useScreenHook('ChangeNameScreen', async event => {
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

  useEffect(() => {
    logScreenView('ChangeNameScreen');
  }, []);

  return (
    <Screen>
      <Header
        leftAction="goBack"
        title={t('General__Personal_info', 'Personal information')}
        onPressLeftAction={handleOnPressLeftAction}
      />
      <ScrollView className="w-full px-8">
        <Spacing height={24} />
        <FormProvider {...methods}>
          <TextInput
            name="firstName"
            placeholder={t('General__Your_first_name', 'Your first name')}
            labelText={t('General__First_name', 'First Name')}
            onFocus={() => methods.clearErrors('firstName')}
            rules={{
              required: t(
                'General__First_name_error_2',
                'Please type in your first name',
              ),
              validate: value => {
                if (TextValidations(value)) {
                  return t(
                    'General__First_name_error_3',
                    'First name must not contain special character',
                  );
                }
              },
            }}
          />

          <Spacing height={24} />
          <TextInput
            name="middleName"
            labelText={t('General__Middle_name', 'Middle Name')}
            placeholder={t('General__Your_middle_name', 'Your middle name')}
            onFocus={() => methods.clearErrors('middleName')}
            rules={{
              validate: value => {
                if (TextValidations(value)) {
                  return t(
                    'General__Middle_name_error_1',
                    'Middle name must not contain special character',
                  );
                }
              },
            }}
          />
          <Spacing height={24} />
          <TextInput
            name="lastName"
            labelText={t('General__Last_name', 'Last Name')}
            placeholder={t('General__Your_last_name', 'Your last name')}
            onFocus={() => methods.clearErrors('lastName')}
            rules={{
              required: t(
                'General__Last_name_error_1',
                'Please type in your last name',
              ),
              validate: value => {
                if (TextValidations(value)) {
                  return t(
                    'General__Last_name_error_2',
                    'Last name must not contain special character',
                  );
                }
              },
            }}
          />
        </FormProvider>
      </ScrollView>
      <StickyButton
        title={t('General__Continue', 'Continue')}
        rightIcon="next"
        onPress={methods.handleSubmit(handleOnPress)}
      />
    </Screen>
  );
};

export default ChangeNameScreen;
