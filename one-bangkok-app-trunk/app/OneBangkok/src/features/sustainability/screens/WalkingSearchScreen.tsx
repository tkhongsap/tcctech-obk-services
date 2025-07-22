import {useFocusEffect} from '@react-navigation/native';
import clsx from 'clsx';
import {t} from 'i18next';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon, Spacing, Text} from '~/components/atoms';
import {IconButton} from '~/components/molecules';
import MemberOnlyModal from '~/features/artCulture/components/MemberOnlyModal';
import {useNavigation} from '~/navigations/AppNavigation';
import {artCultureServices} from '~/services/artCultureService';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import authenState from '~/states/authen/authenState';
import firebaseConfigState from '~/states/firebase';
import {logScreenView} from '~/utils/logGA';

const WalkingSearchScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const enabledBookmarkContent =
    firebaseConfigState.enable_bookmark_wmm_dgl_content.value;
  const currentLanguage = appLanguageState.currentLanguage.get();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const [time, setTime] = useState(10);

  const styles = StyleSheet.create({
    subBox: {
      width: Dimensions.get('window').width,
      height: 270,
    },
    linearGradient: {
      flex: 1,
    },
    title: {
      fontSize: 32,
      lineHeight: 38,
      color: 'white',
    },
    subTitle: {
      fontSize: 16,
      color: '#b0f0d5',
    },
    introduce: {
      fontSize: 17,
      lineHeight: currentLanguage === 'en' ? 17 : 22,
      color: '#c1c9c9',
    },
    listBox: {
      height: 65,
      borderColor: '#dcdcdc',
      borderBottomWidth: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    itemCol: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
    catLabel: {
      fontSize: 18,
    },
  });

  const [isFeatureBook, setIsFeatureBook] = useState<boolean>(false);
  const [isFetchBookmarkDone, setIsFetchBookmarkDone] =
    useState<boolean>(false);
  const fetchBookmark = () => {
    artCultureServices
      .getBookmarkByType('walking_meeting_map')
      .then(res => {
        const {data} = res.data;
        setIsFeatureBook(data.length > 0);
      })
      .catch(error => {
        console.warn('error =>', error);
      })
      .finally(() => {
        setIsFetchBookmarkDone(true);
      });
  };

  useEffect(() => {
    if (authenState && authenState.token.value && enabledBookmarkContent) {
      fetchBookmark();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenState]);

  const [isMemberOnlyModalVisible, setIsMemberOnlyModalVisible] =
    useState(false);
  const handleBookmarkAction = () => {
    if (!authenState.token.value) {
      setIsMemberOnlyModalVisible(true);
      return;
    }

    if (!isFetchBookmarkDone) {
      return;
    }

    if (isFeatureBook) {
      artCultureServices
        .deleteBookmark('walking_meeting_map', '1')
        .then(() => {
          setIsFeatureBook(false);
        })
        .catch(error => {
          console.warn('error =>', error);
        });
    } else {
      artCultureServices
        .createBookmark('walking_meeting_map', '1')
        .then(() => {
          setIsFeatureBook(true);
        })
        .catch(error => {
          console.warn('error =>', error);
        });
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (authenState && authenState.token.value && enabledBookmarkContent) {
        fetchBookmark();
      }
    }, [enabledBookmarkContent]),
  );

  useEffect(() => {
    logScreenView('WalkingSearchScreen');
  }, []);

  return (
    <View className="bg-white h-screen">
      <StatusBar barStyle={'dark-content'} />

      {isMemberOnlyModalVisible && (
        <MemberOnlyModal onClose={() => setIsMemberOnlyModalVisible(false)} />
      )}

      <View className="relative" style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full h-screen pb-[84px]"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Pressable>
            <ImageBackground
              className="h-[270px]"
              source={require('../../../assets/images/sustain-head-bg.png')}
              style={{
                width: Dimensions.get('screen').width,
                paddingTop: insets.top,
              }}>
              <View className="absolute bottom-[30px] items-start w-full">
                <View className="px-2">
                  <View className="flex flex-row justify-between items-center w-full">
                    <IconButton
                      width={25}
                      height={25}
                      color="white"
                      type="back"
                      onPress={() => navigation.goBack()}
                      rotation={0}
                    />
                    {enabledBookmarkContent ? (
                      <Pressable
                        className="p-2"
                        onPress={() => handleBookmarkAction()}>
                        <ImageBackground
                          className="w-[20px] h-[20px] shrink-0"
                          source={
                            isFeatureBook
                              ? require('../../../assets/artc/icons/icon-star-white-solid.png')
                              : require('../../../assets/artc/icons/icon-star-white-outline.png')
                          }
                          resizeMode="contain"
                        />
                      </Pressable>
                    ) : (
                      <View />
                    )}
                  </View>
                  <Spacing height={Platform.OS === 'ios' ? 22 : 80} />
                </View>
                <View className="px-4">
                  <Text weight="medium" style={styles.subTitle}>
                    {t('Sustain_Sub_Digital', 'Sustainability')}
                  </Text>
                  <Text weight="medium" style={styles.title}>
                    {t('Sustain_Walking_Page_Title', 'Walking Meeting Map')}
                  </Text>
                  <Spacing height={15} />
                  <Text weight="regular" style={styles.introduce}>
                    {t(
                      'Sustain_Walking_Page_Sub_Title',
                      'A guide outlining designated routes for discussions while walking',
                    )}
                  </Text>
                </View>
              </View>
            </ImageBackground>

            <View className="px-4 pt-4">
              <Text className="pb-2">
                {t('Sustain_Select_Duration', 'Select your meeting duration')}
              </Text>

              <View>
                <Pressable
                  className={clsx([
                    'flex flex-row justify-between border px-4 py-3 mb-3',
                    time === 10
                      ? 'border-[#162C51] bg-light-gray-light'
                      : 'border-line-light',
                  ])}
                  onPress={() => setTime(10)}>
                  <Text>10 {t('General__Minutes', 'minutes')}</Text>

                  <Icon
                    className={clsx([time === 10 ? 'block' : 'hidden'])}
                    type={'checkedIcon'}
                    width={16}
                    height={16}
                    color={'#1A1919'}
                  />
                </Pressable>

                <Pressable
                  className={clsx([
                    'flex flex-row justify-between border px-4 py-3 mb-3',
                    time === 15
                      ? 'border-[#162C51] bg-light-gray-light'
                      : 'border-line-light',
                  ])}
                  onPress={() => setTime(15)}>
                  <Text>15 {t('General__Minutes', 'minutes')}</Text>

                  <Icon
                    className={clsx([time === 15 ? 'block' : 'hidden'])}
                    type={'checkedIcon'}
                    width={16}
                    height={16}
                    color={'#1A1919'}
                  />
                </Pressable>

                <Pressable
                  className={clsx([
                    'flex flex-row justify-between border px-4 py-3 mb-3',
                    time === 30
                      ? 'border-[#162C51] bg-light-gray-light'
                      : 'border-line-light',
                  ])}
                  onPress={() => setTime(30)}>
                  <Text>30 {t('General__Minutes', 'minutes')}</Text>

                  <Icon
                    className={clsx([time === 30 ? 'block' : 'hidden'])}
                    type={'checkedIcon'}
                    width={16}
                    height={16}
                    color={'#1A1919'}
                  />
                </Pressable>
              </View>
            </View>

            <View className="px-4 pt-4 hidden">
              <Text className="pb-2">
                {t('Sustain_Select_Route', 'Select your preferred route')}
              </Text>

              <View>
                <Pressable className="flex flex-row justify-between border border-[#162C51] bg-light-gray-light px-4 py-3 mb-3">
                  <Text>{t('Outdoor', 'Outdoor')}</Text>

                  <Icon
                    type={'checkedIcon'}
                    width={16}
                    height={16}
                    color={'#1A1919'}
                  />
                </Pressable>
              </View>
            </View>
          </Pressable>
        </ScrollView>

        <View className="fixed bottom-0 left-0 w-full">
          <Pressable
            className="flex flex-row justify-between py-3 pb-12 px-4 bg-black-light"
            onPress={() => {
              navigation.navigate('WalkingSelectRouteScreen', {
                timeValue: time,
              });
            }}>
            <Text className="text-white">{t('Find_Route', 'Find Route')}</Text>
            <Icon
              type="back"
              className="invert mix-blend-difference"
              color="#FFF"
              rotation={180}
              width={20}
              height={20}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default WalkingSearchScreen;
