import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';
import {
  Button,
  Header,
  StickyButton,
  modalActions,
} from '~/components/molecules';
import {Spacing, Text} from '~/components/atoms';
import {Screen} from '~/components/templates';
import {useScreenHook} from '~/services/EventEmitter';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  useForm,
  FormProvider,
  SubmitHandler,
  SubmitErrorHandler,
  FieldValues,
} from 'react-hook-form';
import {isEmpty} from 'lodash';
import {settingStateAction} from '~/features/setting/store';
import {ExitConfirmation} from '~/components/organisms/GenericModal';
import {useBackHandler} from '~/utils/useBackHandler';
import ConfirmPasswordForm from '~/features/auth/components/ConfirmPasswordForm';
import accountService from '~/services/accountService/AccountService';
import {logScreenView} from '~/utils/logGA';

const ConfirmChangePassword = ({onCancel, password}: any) => {
  const navigation = useNavigation<StackNavigation>();
  const onPressConfirm = async () => {
    const res = await accountService.submitNewPassword(password);
    if (res) {
      modalActions.hide();
      navigation.navigate('AccountInfoScreen');
    }
  };

  useEffect(() => {
    logScreenView('ChangeOrSetPasswordScreen');
  }, []);

  return (
    <>
      <Text size="B1" weight="medium">
        {t('Drawer__New_password_confirm__Header', 'Confirm password change?')}
      </Text>
      <Text color="muted" size="B2">
        {t(
          'Drawer__New_password_confirm__Body',
          'Once confirmed, the system will automatically sign you in with your new password.',
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
type Props = NativeStackScreenProps<
  RootStackParamList,
  'ChangeOrSetPasswordScreen'
>;

type FormValues = {
  password: string;
  confirmPassword: string;
};

const ChangeOrSetPasswordScreen = ({
  route: {
    params: {header, isSetupPassword},
  },
}: Props) => {
  const navigation = useNavigation<StackNavigation>();

  const handleOnPressLeftAction = () => {
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
  };

  const handleOnPressContinue: SubmitHandler<FieldValues> = async data => {
    if (isSetupPassword) {
      const res = await accountService.submitNewPassword(data.password);
      if (res) {
        settingStateAction.updatePasswordEnabled(true);
        navigation.navigate('AnnouncementScreen', {
          type: 'success',
          title: t(
            'Announcement__Set_password_success__Header',
            'Your password was set',
          ),
          message: t(
            'Announcement__Set_password_success__Body',
            'Your password has been set successfully.',
          ),
          buttonText: t('General__Back_to_account', 'Back to my account'),
          screenHook: 'ChangeOrSetPasswordScreen',
        });
      }
    } else {
      modalActions.setContent(
        <ConfirmChangePassword
          onCancel={() => modalActions.hide()}
          password={data.password}
        />,
      );
      modalActions.show();
    }
  };

  useScreenHook('ChangeOrSetPasswordScreen', async event => {
    switch (event.name) {
      case AnnouncementScreenEventNames.CONTINUE:
        if (event.from.params.type === 'success') {
          navigation.navigate('AccountInfoScreen');
        }
        break;
      default:
        break;
    }
  });

  const {...methods} = useForm({mode: 'onSubmit', reValidateMode: 'onSubmit'});

  const [setError] = useState<boolean>(false);

  const onError: SubmitErrorHandler<FormValues> = errors => {
    //TODO: handle error such as modal alert
    return console.log({errors});
  };

  useBackHandler(() => {
    handleOnPressLeftAction();
    return true;
  });

  return (
    <Screen>
      <Header
        leftAction={isSetupPassword ? 'goBack' : 'close'}
        title={header}
        onPressLeftAction={handleOnPressLeftAction}
      />
      <ScrollView className="px-[24px] w-full h-full">
        <Spacing height={24} />
        <FormProvider {...methods}>
          <ConfirmPasswordForm
            showStrengthBar={!isEmpty(methods.watch('password'))}
            onFocus={() => methods.clearErrors()}
            passwordName="password"
            confirmPasswordName="confirmPassword"
            passwordLabel={t('General__New_password', 'New password')}
            confirmPasswordLabel={t(
              'General__Confirm_password',
              'Confirm Password',
            )}
            setFormErrorPassword={setError}
            setFormErrorConfirmPassword={setError}
            persistentValue={true}
            errorPasswordDonMatch={t(
              'Account__New_password__Supporting_text',
              "New password and confirmed password don't match",
            )}
            {...methods}
          />
        </FormProvider>
      </ScrollView>
      <StickyButton
        title={t('General__Continue', 'Continue')}
        rightIcon="next"
        onPress={methods.handleSubmit(handleOnPressContinue, onError)}
      />
    </Screen>
  );
};

export default ChangeOrSetPasswordScreen;
