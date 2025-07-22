import React, {useEffect, useState} from 'react';
import {StickyButton, Header} from '~/components/molecules';
import {Screen} from '~/components/templates';
import t from '~/utils/text';
import {memberAction} from '../store/member';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {ParkingTicketsIndexTypeEnum} from 'ob-bms-sdk/dist/api';
import {ScrollView} from 'react-native-gesture-handler';
import ParkingDetail, {TParkingDetail} from '../components/ParkingDetail';
import getTheme from '~/utils/themes/themeUtils';
import {Pressable, View} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import SelectList, {ListSelect} from '../components/SelectList';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {ScreenHookEventType, useScreenHook} from '~/services/EventEmitter';
import {TextInput} from '~/components/molecules/TextInput';
import {FormProvider, useForm} from 'react-hook-form';
import {TextValidation} from '~/utils/validation';
import {RateDetail} from './ParkingTicketScreen';
import {StackActions} from '@react-navigation/native';
import {logScreenView} from '~/utils/logGA';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialParkingRedemptionDetailScreen'
>;

const ResidentialParkingRedemptionDetailScreen = ({
  route: {
    params: {token, internalQr},
  },
}: Props) => {
  const maxLengthTextInput = 100;
  const navigation = useNavigation();
  const [parkingDetail, setParkingDetail] = useState<TParkingDetail>();
  const [parkingRateDetail, setParkingRateDetail] = useState<ListSelect[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRateCode, setSelectedRateCode] = useState<number>();
  const [remark, setRemark] = useState('');
  const [invalidSelectRate, setInvalidSelectRate] = useState(false);
  const {...methods} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });
  const language =
    (appLanguageState.currentLanguage.get() as keyof RateDetail) ||
    (appLanguageState.defaultLanguage.get() as keyof RateDetail);

  useEffect(() => {
    preLoad();
    logScreenView('ResidentialParkingRedemptionDetailScreen');
  }, []);

  const navigateToErrorScreen = () => {
    navigation.navigate('AnnouncementScreen', {
      type: 'error',
      title: t('Residential__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Residential__Announcement__Error_generic__Body',
        'Please wait a bit before trying again',
      ),
      buttonText: t('Residential__Back_to_explore', 'Back to explore'),
      screenHook: 'ResidentialParkingRedemptionDetailScreen',
      buttonColor: 'dark-teal',
    });
  };

  const handleOnPress = async () => {
    if (selectedRateCode === undefined) {
      setInvalidSelectRate(true);
      return;
    }

    try {
      setIsLoading(true);

      const selectedRateDetail = parkingRateDetail.find(
        e => e.code === selectedRateCode,
      );
      const message = selectedRateDetail!.detail[language];
      const isSuccess = await memberAction.redemption(
        parkingDetail!.id,
        selectedRateCode.toString(),
        remark,
      );
      if (isSuccess) {
        navigation.navigate('AnnouncementScreen', {
          type: 'success',
          title: t(
            'Announcement__Redemption_success__Title',
            'Redemption successful',
          ),
          message,
          buttonText: t('General__Back_to_redemption', 'Go back to redemption'),
          screenHook: 'ResidentialParkingRedemptionDetailScreen',
          buttonColor: 'dark-teal',
        });
      } else {
        navigateToErrorScreen();
      }
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setIsLoading(false);
    }
  };

  const preLoad = async () => {
    try {
      setIsLoading(true);
      let redemptionId = '';
      let pkType: ParkingTicketsIndexTypeEnum = 'member_id';
      if (internalQr) {
        const tokenDetail = await memberAction.getTokenDetail(token);
        let accountId = tokenDetail!.account_id;
        if (tokenDetail!.type === 'visitor_pass') {
          const inviteDetail = await memberAction.getInviteDetail(
            tokenDetail?.id!,
          );
          redemptionId = inviteDetail?.uid!;
          pkType = 'invite_id';
        } else if (tokenDetail!.type === 'qr') {
          const personId = await memberAction.getPersonId(accountId);
          redemptionId = personId;
        }
      } else {
        redemptionId = token;
        pkType = 'log_id';
      }
      const parkingDetailResult = (await memberAction.getParkingDetail(
        redemptionId,
        pkType,
      )) as TParkingDetail;
      const vehicleTypeId = parkingDetailResult?.vehicle_type_id;
      const memberTypeId = parkingDetailResult?.member_type_id;

      const departmentId = 0;
      const rateDetails = await memberAction.getRedemptionRateDetail(
        memberTypeId,
        departmentId,
        vehicleTypeId,
      );
      if (!parkingDetailResult || !rateDetails) {
        navigation.dispatch(
          StackActions.replace('ResidentialTicketInvalidScreen', {
            description: t(
              'Residential__Redemption_Car_Park__Ticket_invalid_desc',
              'The ticket is invalid, or you have already \nredeemed it.',
            ),
          }),
        );
        return;
      }

      setParkingDetail(parkingDetailResult);
      if (rateDetails) {
        setParkingRateDetail(rateDetails);
      }
    } catch (error) {
      navigation.dispatch(
        StackActions.replace('ResidentialTicketInvalidScreen', {
          description: t(
            'Residential__Redemption_Car_Park__Ticket_invalid_desc',
            'The ticket is invalid, or you have already \nredeemed it.',
          ),
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnContinueEvent = (event: ScreenHookEventType) => {
    if (event.from.params.type === 'success') {
      navigation.navigate('ResidentialVisitorPassHomeScreen');
    } else {
      navigation.navigate('ResidentialParkingRedemptionScreen', {
        hookFrom: 'REDEMPTION_CAR_PARK',
      });
    }
  };

  useScreenHook('ResidentialParkingRedemptionDetailScreen', async event => {
    const {name} = event;
    switch (name) {
      case AnnouncementScreenEventNames.CONTINUE:
        handleOnContinueEvent(event);
        break;
      default:
        break;
    }
  });

  const onSelectRateCode = (code: number) => {
    setSelectedRateCode(code);
    setInvalidSelectRate(false);
  };

  return (
    <Screen isLoading={isLoading}>
      <Header
        title={t('Residential__Car_Park_Redemption', 'Car Park Redemption')}
        leftAction="goBack"
      />
      {parkingDetail && (
        <>
          <ScrollView className="w-full px-5">
            <Spacing height={28} />
            <Pressable>
              <View className={`${getTheme('border-[1px] border-line')} px-4`}>
                <View
                  className={`${getTheme('w-full items-center px-4 py-6')}`}>
                  <View>
                    <View className="flex items-center ">
                      <Text weight="medium" size="H1">
                        {t('no_key', `${parkingDetail.plate_number}`)}
                      </Text>
                      <Text color="muted" size="B2">
                        {t(
                          'Residential__Car_Park_Payment__Payment_Method_PromptPay_Slip_License_Plate',
                          'License Plate',
                        )}
                      </Text>
                    </View>
                    <Spacing height={16} />
                  </View>
                </View>
                <ParkingDetail data={parkingDetail} />
              </View>
              <Spacing height={32} />
              {parkingRateDetail.length >= 1 && (
                <View>
                  <Text weight="medium" size="B1">
                    {t(
                      'Residential__Redemption_Car_Park__Free_Parking_Allowance',
                      'Free parking allowance',
                    )}
                  </Text>
                  <Spacing height={16} />
                  <SelectList
                    data={parkingRateDetail}
                    onPress={onSelectRateCode}
                    selected={selectedRateCode}
                    hasError={invalidSelectRate}
                    disabled={isLoading}
                  />
                </View>
              )}
            </Pressable>

            <Spacing height={16} />
            <FormProvider {...methods}>
              <TextInput
                name="remark"
                labelText={t(
                  'Residential__Redemption_Car_Park__Remarks',
                  'Remarks',
                )}
                placeholder={t(
                  'Residential__Redemption_Car_Park__Remarks',
                  'Remarks',
                )}
                style={{height: 128, textAlignVertical: 'top'}}
                multiline
                onFocus={() => methods.clearErrors('remark')}
                description={`${remark.length}/${maxLengthTextInput}`}
                disabled={isLoading}
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
              <Spacing height={56} />
            </FormProvider>
          </ScrollView>
          {parkingDetail && (
            <StickyButton
              title={t('Residential__Redemption_Car_Park__Confirm', 'Confirm')}
              rightIcon="next"
              color="dark-teal"
              onPress={methods.handleSubmit(handleOnPress)}
              disabled={isLoading}
            />
          )}
        </>
      )}
    </Screen>
  );
};
export default ResidentialParkingRedemptionDetailScreen;
