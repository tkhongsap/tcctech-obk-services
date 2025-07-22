import React, { useCallback, useEffect, useState } from 'react';
import { Header, StickyButton, useModal } from '~/components/molecules';
import { Screen } from '~/components/templates';
import t from '~/utils/text';
import { memberAction, memberState } from '../store/member';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, useNavigation } from '~/navigations/AppNavigation';
import {
  ParkingTicketsIndexTypeEnum,
  WrappedResponseParkingTicketDataData,
} from 'ob-bms-sdk/dist/api';
import { ScrollView } from 'react-native-gesture-handler';
import { Confirmation } from '~/components/organisms/GenericModal';
import ParkingDetail from '../components/ParkingDetail';
import getTheme from '~/utils/themes/themeUtils';
import { Pressable, View } from 'react-native';
import { Spacing, Text } from '~/components/atoms';
import SelectList, { ListSelect } from '~/components/molecules/SelectList';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import { find, isEmpty } from 'lodash';
import { AnnouncementScreenEventNames } from '~/screens/AnnouncementScreenEvent';
import { ScreenHookEventType, useScreenHook } from '~/services/EventEmitter';
import { TextInput } from '~/components/molecules/TextInput';
import { FormProvider, useForm } from 'react-hook-form';
import { TextValidation } from '~/utils/validation';
import { logScreenView } from '~/utils/logGA';
type Props = NativeStackScreenProps<
  RootStackParamList,
  'ParkingRedemptionDetailScreen'
>;

const ParkingRedemptionDetailScreen = ({
  route: {
    params: { token, internalQr },
  },
}: Props) => {
  const [_modalState, modalActions] = useModal();

  const [parkingDetail, setParkingDetail] =
    useState<WrappedResponseParkingTicketDataData>();
  const [parkingRateDetail, setParkingRateDetail] = useState<ListSelect[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRate, setSelectedRate] = useState('');
  const [remark, setRemark] = useState('');
  const maxLengthTextInput = 100;

  const navigation = useNavigation();
  const { ...methods } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  let language = appLanguageState.currentLanguage.get();
  if (language === '') {
    language = appLanguageState.defaultLanguage.get();
  }

  const handleOnPress = async () => {
    if (isEmpty(selectedRate)) {
      modalActions.setContent(
        <Confirmation
          title={t('General__Something_went_wrong', 'Something went wrong')}
          description={t(
            'General__Please_select_rate',
            'Please selected at least one rate',
          )}
          onContinue={() => {
            modalActions.hide();
          }}
          onCancel={() => {
            modalActions.hide();
            navigation.navigate('BuildingServiceScreen');
          }}
        />,
      );
      modalActions.show();
    } else {
      setIsLoading(true);

      const selectedRateDetail = find(parkingRateDetail, { value: selectedRate });
      const message = selectedRateDetail?.name;

      const result = await memberAction.redemption(
        memberState.id.value,
        parkingDetail?.id!,
        selectedRate,
        remark,
      );

      if (result) {
        navigation.navigate('AnnouncementScreen', {
          type: 'success',
          title: t(
            'Announcement__Redemption_success__Title',
            'Redemption successful',
          ),
          message: message!,
          buttonText: t('General__Back_to_redemption', 'Go back to redemption'),
          screenHook: 'ParkingRedemptionDetailScreen',
        });
      } else {
        navigation.navigate('AnnouncementScreen', {
          type: 'error',
          title: t('General__Something_went_wrong_2', 'Something\nwent wrong'),
          message: t(
            'Announcement__Error_generic__Body',
            'Please wait and try again soon.',
          ),
          buttonText: t('General__Bacl_to_scan_qr', 'Back to scan QR code'),
          screenHook: 'ParkingRedemptionDetailScreen',
        });
      }

      setIsLoading(false);
    }
  };

  const handleSelect = (value: string) => {
    setSelectedRate(value);
  };

  const preLoad = useCallback(async () => {
    try {
      setIsLoading(true);
      let redemptionId = '';
      let type: ParkingTicketsIndexTypeEnum = 'member_id';
      if (internalQr) {
        const tokenDetail = await memberAction.getTokenDetail(token);
        let accountId = tokenDetail!.account_id;
        if (tokenDetail!.type === 'visitor_pass') {
          const inviteDetail = await memberAction.getInviteDetail(
            tokenDetail?.id!,
          );
          redemptionId = inviteDetail?.uid!;
          type = 'invite_id';
        } else if (tokenDetail!.type === 'qr') {
          const personId = await memberAction.getPersonId(accountId);
          redemptionId = personId ? personId : accountId;
        }
      } else {
        redemptionId = token;
        type = 'log_id';
      }

      const parkingDetailResult = await memberAction.getParkingDetail(
        redemptionId,
        type,
      );
      const vehicleTypeId = parkingDetailResult?.vehicle_type_id;
      const memberTypeId = parkingDetailResult?.member_type_id;
      const rateDetails = await memberAction.getRateDetail(
        memberState.id.value,
        vehicleTypeId!,
        memberTypeId!,
      );

      if (!parkingDetailResult || !rateDetails) {
        modalActions.setContent(
          <Confirmation
            title={t('General__Something_went_wrong', 'Something went wrong')}
            description={t(
              'Drawer__Redemption__Description',
              'We’re unable to scan the parking ticket. Please check you camera before trying again.',
            )}
            onContinue={() => {
              modalActions.hide();
              navigation.navigate('BuildingServiceScreen');
            }}
            onCancel={() => {
              modalActions.hide();
              navigation.navigate('BuildingServiceScreen');
            }}
          />,
        );
        modalActions.show();
      }
      setParkingDetail(parkingDetailResult);
      const rateArray: ListSelect[] = [];
      for (const rate of rateDetails!) {
        rateArray.push({
          name: rate.detail[language],
          value: rate.code.toString(),
        });
      }

      setParkingRateDetail(rateArray);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      modalActions.setContent(
        <Confirmation
          title={t('General__Something_went_wrong', 'Something went wrong')}
          description={t(
            'Drawer__Redemption__Description',
            'We’re unable to scan the parking ticket. Please check you camera before trying again.',
          )}
          onContinue={() => {
            modalActions.hide();
            navigation.navigate('BuildingServiceScreen');
          }}
          onCancel={() => {
            modalActions.hide();
            navigation.navigate('BuildingServiceScreen');
          }}
        />,
      );
      modalActions.show();
    }
  }, [internalQr, language, modalActions, navigation, token]);

  useEffect(() => {
    preLoad();
  }, [preLoad]);

  const handleOnContinueEvent = (event: ScreenHookEventType) => {
    if (event.from.params.type === 'success') {
      navigation.navigate('BuildingServiceScreen');
    } else {
      navigation.navigate('ParkingRedemptionScreen');
    }
  };

  useScreenHook('ParkingRedemptionDetailScreen', async event => {
    const { name } = event;
    switch (name) {
      case AnnouncementScreenEventNames.CONTINUE:
        handleOnContinueEvent(event);
        break;
      default:
        break;
    }
  });
  useEffect(() => {
    logScreenView('ParkingRedemptionDetailScreen');
  }, []);

  return (
    <Screen isLoading={isLoading}>
      <Header
        title={t('General__Park_redemption', 'Parking redemption')}
        leftAction="goBack"
      />
      <ScrollView className="w-full px-5">
        <Pressable>
          {parkingDetail && (
            <View className={`${getTheme('border-[1px] border-line')} px-4`}>
              <View className={`${getTheme('w-full items-center px-4 py-6')}`}>
                <View>
                  <View className="flex items-center ">
                    <Text weight="medium" size="H1">
                      {t('no_key', `${parkingDetail!.plate_number}`)}
                    </Text>
                    <Text color="muted" size="B2">
                      {t('General__License_plate', 'License Plate')}
                    </Text>
                  </View>
                </View>
              </View>
              <ParkingDetail data={parkingDetail!} />
            </View>
          )}
          <Spacing height={24} />
          {parkingRateDetail && (
            <View>
              <Text weight="medium" size="B1">
                {t('General__Free_parking_allowance', 'Free parking allowance')}
              </Text>
              <Spacing height={16} />

              <SelectList
                data={parkingRateDetail!}
                onPress={handleSelect}
                selected={''}
              />
            </View>
          )}
        </Pressable>
        <FormProvider {...methods}>
          <TextInput
            name="remark"
            labelText={t('General__Remarks', 'Remarks')}
            placeholder={t('General__Remarks', 'Remarks')}
            style={{ height: 128, textAlignVertical: 'top' }}
            multiline
            onFocus={() => methods.clearErrors('remark')}
            description={`${remark.length}/${maxLengthTextInput}`}
            rules={{
              maxLength: {
                value: maxLengthTextInput,
                message: `${remark.length}/${maxLengthTextInput}`,
              },
              onChange: value => {
                setRemark(value.target.value);
                if (value.target.value.length > maxLengthTextInput) {
                  methods.setError('remark', {
                    type: 'maxLength',
                    message: `${value.target.value.length}/${maxLengthTextInput}`,
                  });
                } else {
                  methods.clearErrors('remark');
                }
              },
              validate: value => {
                if (TextValidation.isEngAndThaiLanguage(value)) {
                  return `${remark.length}/${maxLengthTextInput}`;
                }
              },
            }}
          />
          <Spacing height={24} />
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

export default ParkingRedemptionDetailScreen;
