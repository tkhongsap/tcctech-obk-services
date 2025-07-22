import React from 'react';
import {Screen} from '~/components/templates';
import {Header, useModal} from '~/components/molecules';
import t from '~/utils/text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import {Spacing, Text} from '~/components/atoms';
import {TouchableOpacity, View} from 'react-native';
import Switch from '~/components/atoms/Switch';
import getTheme from '~/utils/themes/themeUtils';
import accountAction from '~/states/account/accountAction';
import {useNavigation} from '@react-navigation/native';
import {Confirmation} from '~/components/organisms/GenericModal';
import {useScreenHook} from '~/services/EventEmitter';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';

interface IdentityDetailProps {
  title: string;
  identifier: string;
}

const IdentityDetail = (props: IdentityDetailProps) => {
  const {title, identifier} = props;
  return (
    <>
      <Text size="B2" color="subtitle-muted">
        {title}
      </Text>
      <Text size="H2" weight="medium">
        {/* TODO: PO consult designer to change font style  */}
        {identifier}
      </Text>
    </>
  );
};

const SetDefaultIdentity = ({onContinue, onCancel, provider}: any) => {
  const description =
    provider === 'phone'
      ? t(
          'Drawer__Default_phone_confirm__Body',
          'Are you sure you want to set this phone number as the default?',
        )
      : t(
          'Drawer__Default_email_confirm__Body',
          'Are you sure you want to set this email as the default?',
        );

  return (
    <Confirmation
      title={t('General__Set_default?', 'Set as default?')}
      description={description}
      textConfirmButton={t('General__Confirm', 'Confirm')}
      textCancelButton={t('General__Cancel', 'Cancel')}
      onContinue={onContinue}
      onCancel={onCancel}
      CancelButtonOutlined
    />
  );
};

const RemovePhone = ({onContinue, onCancel}: any) => {
  return (
    <Confirmation
      title={t('Drawer__Delete_phone_confirm__Header', 'Remove phone number?')}
      description={t(
        'Drawer__Delete_phone_confirm__Body',
        'Are you sure you want to remove this phone number?',
      )}
      textConfirmButton={t(
        'General__Remove_number',
        'Remove this phone number',
      )}
      textCancelButton={t(
        'Drawer__Delete_phone_confirm__Button_cancel',
        'Keep this phone number',
      )}
      onContinue={onContinue}
      onCancel={onCancel}
      ConfirmButtonColor="fire-engine-red"
      ConfirmButtonOutlined
      CancelButtonOutlined
    />
  );
};

const RemoveEmail = ({onContinue, onCancel}: any) => {
  return (
    <Confirmation
      title={t('Drawer__Delete_email_confirm__Header', 'Remove email?')}
      description={t(
        'Drawer__Delete_email_confirm__Body',
        'Are you sure you want to remove this email?',
      )}
      textConfirmButton={t('General__Remove_email', 'Remove this email')}
      textCancelButton={t(
        'Drawer__Delete_email_confirm__Button_cancel',
        'Keep this email',
      )}
      onContinue={onContinue}
      onCancel={onCancel}
      ConfirmButtonColor="fire-engine-red"
      ConfirmButtonOutlined
      CancelButtonOutlined
    />
  );
};

type Props = NativeStackScreenProps<RootStackParamList, 'IdentityDetailScreen'>;

const IdentityDetailScreen = ({
  route: {
    params: {header, identity},
  },
}: Props) => {
  const navigation = useNavigation<StackNavigation>();
  const [_modalState, modalActions] = useModal();

  const handleOnToggle = async () => {
    const result = await accountAction.setDefaultIdentity(
      identity.provider,
      identity.id,
    );
    modalActions.hide();
    if (result) {
      navigation.goBack();
    } else {
      goToAnnoucement();
    }
  };
  const handleOnRemoveIdentity = async () => {
    const result = await accountAction.deleteIdentity(identity.id);
    modalActions.hide();
    if (result) {
      navigation.goBack();
    } else {
      goToAnnoucement();
    }
  };

  useScreenHook('IdentityDetailScreen', async event => {
    switch (event.name) {
      case AnnouncementScreenEventNames.CONTINUE:
        navigation.navigate('AccountInfoScreen');
        break;
      default:
        break;
    }
  });

  const goToAnnoucement = () => {
    navigation.navigate('AnnouncementScreen', {
      type: 'error',
      title: t('General__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Announcement__Error_generic__Body',
        'Please wait and try again soon.',
      ),
      buttonText: t('General__Back_to_account', 'Back to my account'),
      screenHook: 'IdentityDetailScreen',
    });
  };

  const handleOnPressToggle = () => {
    modalActions.setContent(
      <SetDefaultIdentity
        onContinue={() => handleOnToggle()}
        onCancel={() => modalActions.hide()}
        provider={identity.provider}
      />,
    );
    modalActions.show();
  };

  const handleOnPressRemoveIdentity = () => {
    if (identity.provider === 'phone') {
      modalActions.setContent(
        <RemovePhone
          onContinue={() => handleOnRemoveIdentity()}
          onCancel={() => modalActions.hide()}
        />,
      );
    } else {
      modalActions.setContent(
        <RemoveEmail
          onContinue={() => handleOnRemoveIdentity()}
          onCancel={() => modalActions.hide()}
        />,
      );
    }
    modalActions.show();
  };

  const textSetDefaultDesc =
    identity.provider === 'phone'
      ? t('Account__Phone_info__Caption', 'Use this number for primary log in')
      : t('Account__Email_info__Caption', 'Use this email for primary log in');
  const textRemoveIdentity =
    identity.provider === 'phone'
      ? t('General__Remove_number', 'Remove this phone number')
      : t('General__Remove_email', 'Remove this email');
  return (
    <Screen>
      <Header title={header} leftAction="goBack" />
      <Spacing height={24} />
      <View className="w-full px-6">
        <IdentityDetail title={header} identifier={identity.identifier} />
        <Spacing height={44} />
        <View className={getTheme('border-[1px] border-line w-full px-[16px]')}>
          <Spacing height={20} />
          <View className="flex flex-row gap-2 items-center">
            <View className="flex-1">
              <Text size="B1" weight="medium">
                {t('General__Set_default', 'Set as default')}
              </Text>
              <Spacing height={6} />
              <Text color="subtitle-muted" size="B2">
                {textSetDefaultDesc}
              </Text>
            </View>
            <TouchableOpacity onPress={handleOnPressToggle} activeOpacity={1}>
              <View className="flex justify-center" pointerEvents="none">
                <Switch
                  value={false}
                  onValueChange={handleOnPressToggle}
                  disabled={false}
                />
              </View>
            </TouchableOpacity>
          </View>
          <Spacing height={20} />
        </View>
        <Spacing height={44} />
        <TouchableOpacity className="p-3" onPress={handleOnPressRemoveIdentity}>
          <Text
            size="B1"
            color="fire-engine-red"
            className="text-center"
            weight="medium">
            {textRemoveIdentity}
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default IdentityDetailScreen;
