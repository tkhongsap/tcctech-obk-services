import React, {useState} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon, Spacing, Text} from '~/components/atoms';
import {activeOpacity} from '~/constants';
import Swiper from 'react-native-swiper';
import SwiperV2 from 'react-native-swiper-android';
import FastImage from 'react-native-fast-image';
import {CheckField} from '~/components/molecules/CheckField';
import {useModal} from '../../components/ResidentialModal';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import {TUnansweredQuestionnaires} from '~/states/residentialTenant/residentialTenantState';
import {useNavigation} from '~/navigations/AppNavigation';
import {t} from 'i18next';

interface Props {
  unitId: string;
  unansweredQuestionnaires: TUnansweredQuestionnaires[];
  onClose?: () => void;
  onGoToQuestionnaire?: () => void;
}

const QuestionnaireWelcomeModal = ({
  unitId,
  unansweredQuestionnaires,
  onClose = () => {},
  onGoToQuestionnaire = () => {},
}: Props) => {
  const navigation = useNavigation();
  const [_, modalActions] = useModal();
  const [isCheckedDoNotShowToday, setIsCheckedDoNotShowToday] = useState(false);
  const nBannerWidth = 340;
  const [currentIndex, setCurrentIndex] = useState(0);

  const onPressDoNotShowToday = () => {
    setIsCheckedDoNotShowToday(prev => !prev);
  };

  const onPressClose = async () => {
    if (isCheckedDoNotShowToday) {
      residentialTenantAction.setQuestionnaireNotShowToday(unitId);
    }
    modalActions.hide();
    onClose();
  };

  const onPressStart = (unansweredQuestionnaire: TUnansweredQuestionnaires) => {
    if (isCheckedDoNotShowToday) {
      residentialTenantAction.setQuestionnaireNotShowToday(unitId);
    }
    modalActions.hide();
    onGoToQuestionnaire();
    navigation.navigate('QuestionnaireCreateScreen', {
      questionnaire: unansweredQuestionnaire,
    });
  };

  const styles = StyleSheet.create({
    modalView: {
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    modalRow: {
      height: 618,
      flexDirection: 'row',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    detailBox: {
      backgroundColor: 'white',
      width: nBannerWidth,
      overflow: 'hidden',
    },
    wrapperBanner: {
      height: '90%',
      backgroundColor: 'white',
      overflow: 'hidden',
    },
    bannerActive: {
      backgroundColor: '#333333',
      width: 100,
      height: 3,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
    },
    bannerInactive: {
      backgroundColor: '#a1a1a1',
      width: 25,
      height: 3,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
    },
  });

  return (
    <View style={styles.modalView} className="">
      <View style={styles.modalRow}>
        <View style={styles.detailBox}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              padding: 10,
            }}>
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={onPressClose}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Icon color="#7c7c7c" type="close" width={15} height={15} />
                <Text style={{marginLeft: 5, fontSize: 18, color: '#4d616d'}}>
                  {t('General__Close', 'Close')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {Platform.OS === 'ios' ? (
            <Swiper
              key="swiper-ios"
              style={styles.wrapperBanner}
              showsButtons={false}
              loop={true}
              dot={<View style={styles.bannerInactive} />}
              activeDot={<View style={styles.bannerActive} />}
              loadMinimal
              loadMinimalSize={unansweredQuestionnaires.length}
              paginationStyle={{bottom: 30}}
              onIndexChanged={setCurrentIndex}>
              {unansweredQuestionnaires.map(item => (
                <FastImage
                  key={item.id}
                  source={{
                    uri: item?.bannerImage?.s3Url,
                    priority: FastImage.priority.low,
                  }}
                  resizeMode="cover"
                  style={{
                    width: '100%',
                    aspectRatio: 686 / 832,
                  }}
                />
              ))}
            </Swiper>
          ) : (
            <SwiperV2
              key="swiper-android"
              style={styles.wrapperBanner}
              showsButtons={false}
              loop={true}
              dot={<View style={styles.bannerInactive} />}
              activeDot={<View style={styles.bannerActive} />}
              loadMinimal
              loadMinimalSize={unansweredQuestionnaires.length}
              paginationStyle={{bottom: 30}}
              onIndexChanged={setCurrentIndex}>
              {unansweredQuestionnaires.map(item => (
                <FastImage
                  key={item.id}
                  source={{
                    uri: item?.bannerImage?.s3Url,
                    priority: FastImage.priority.low,
                  }}
                  resizeMode="cover"
                  style={{
                    width: '100%',
                    aspectRatio: 686 / 832,
                  }}
                />
              ))}
            </SwiperV2>
          )}
          <View className="mt-[-20px] gap-6">
            <View className="px-3">
              <TouchableOpacity
                className="bg-dark-teal-light w-full h-[46px] flex items-center justify-center"
                onPress={() =>
                  onPressStart(unansweredQuestionnaires[currentIndex])
                }>
                <Text color="white">
                  {t(
                    'Residential_Questionnaire_Start_questionnaire',
                    'Start Questionnaire',
                  )}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="h-[45px]">
              <TouchableOpacity
                activeOpacity={activeOpacity}
                onPress={onPressDoNotShowToday}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginLeft: 12,
                  }}>
                  <CheckField
                    value={isCheckedDoNotShowToday}
                    onPress={onPressDoNotShowToday}>
                    <View className="flex flex-row flex-wrap mr-[30px]">
                      <Spacing width={4} />
                      <Text style={{color: '#4d616d', fontSize: 16}}>
                        {t(
                          'Residential_Questionnaire_Do_not_show_this_again_today',
                          'Do not show this again today',
                        )}
                      </Text>
                    </View>
                  </CheckField>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default QuestionnaireWelcomeModal;
