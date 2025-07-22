/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '~/navigations/AppNavigation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Screen} from '~/components/templates';
import {IContentDigital} from '../components/ISustainability';
import LinearGradient from 'react-native-linear-gradient';
import {Icon, Spacing, Text} from '~/components/atoms';
import {IconButton} from '~/components/molecules';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {Fetch} from '~/utils/fetch/fetch';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';
import {activeOpacity} from '~/constants';
import {t} from 'i18next';
import {artCultureServices} from '~/services/artCultureService';
import authenState from '~/states/authen/authenState';
import firebaseConfigState from '~/states/firebase';
import {logScreenView} from '~/utils/logGA';
import MemberOnlyModal from '~/features/artCulture/components/MemberOnlyModal';
import {useFocusEffect} from '@react-navigation/native';

const DigitalLibraryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const currentLanguage = appLanguageState.currentLanguage.get();

  const enabledBookmarkContent =
    firebaseConfigState.enable_bookmark_wmm_dgl_content.value;

  const [objContent, setObjContent] = useState<IContentDigital>({
    sTitle: '',
    sSubTitle: '',
    sIntroduce: '',
    lstCategory: [],
    sPathBackground: '',
  });
  const [refreshing, setRefreshing] = useState(false);

  const GetDigitalLibraryCategory = useCallback(async () => {
    let objParam = {
      sLanguage: currentLanguage || 'en',
    };
    const res = await Fetch('GetDigitalLibraryCategory', objParam);
    return res;
  }, [currentLanguage]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GetDigitalLibraryCategory()
      .then(async resp => {
        if (resp.nStatusCode === 200) {
          setObjContent(resp as IContentDigital);
        }
        setRefreshing(false);
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [GetDigitalLibraryCategory]);

  useEffect(() => {
    GetDigitalLibraryCategory()
      .then(async resp => {
        if (resp.nStatusCode === 200) {
          setObjContent(resp as IContentDigital);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [GetDigitalLibraryCategory, currentLanguage]);

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

  const handlePressCat = (sID: string) => {
    navigation.navigate('FileDownloadScreen', {id: sID});
  };

  const [isFeatureBook, setIsFeatureBook] = useState<boolean>(false);
  const [isFetchBookmarkDone, setIsFetchBookmarkDone] =
    useState<boolean>(false);
  const fetchBookmark = () => {
    artCultureServices
      .getBookmarkByType('digital_library')
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
        .deleteBookmark('digital_library', '1')
        .then(() => {
          setIsFeatureBook(false);
        })
        .catch(error => {
          console.warn('error =>', error);
        });
    } else {
      artCultureServices
        .createBookmark('digital_library', '1')
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
    logScreenView('DigitalLibraryScreen');
  }, []);

  return (
    <Screen>
      {isMemberOnlyModalVisible && (
        <MemberOnlyModal onClose={() => setIsMemberOnlyModalVisible(false)} />
      )}

      <ScrollView
        className={'w-full'}
        testID="digital-libraly-scroll-view-id"
        contentContainerStyle={{paddingBottom: insets.bottom}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Pressable>
          <View>
            {/* Header */}
            <FastImage
              source={{
                uri: objContent.sPathBackground ?? '',
                priority: FastImage.priority.low,
              }}
              style={styles.subBox}>
              <View
                className="absolute bottom-[0] w-full"
                style={{height: 270}}>
                <LinearGradient
                  colors={[
                    'rgba(7,62,59, 0.79)',
                    'rgba(7,62,59, 0.79)',
                    'rgba(7,62,59, 0.79)',
                  ]}
                  style={styles.linearGradient}
                />
              </View>
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
                    {objContent.sTitle}
                  </Text>
                  <Spacing height={15} />
                  <Text weight="regular" style={styles.introduce}>
                    {objContent.sIntroduce}
                  </Text>
                </View>
              </View>
            </FastImage>

            {/* List Category */}
            <View className="px-3">
              {objContent.lstCategory.map(item => (
                <TouchableOpacity
                  activeOpacity={activeOpacity}
                  key={item.sID}
                  onPress={() => handlePressCat(item.sID)}>
                  <View style={styles.listBox}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={styles.itemCol}>
                        <Text style={styles.catLabel}>{item.sLabel}</Text>
                      </View>
                      <View style={styles.itemCol}>
                        <Icon
                          type={'right'}
                          width={20}
                          height={20}
                          color={'black'}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </ScrollView>
      <FloatingStickyMenu
        type="obNewIcon"
        width={30}
        height={30}
        color="white"
        rotation={0}
      />
    </Screen>
  );
};

export default DigitalLibraryScreen;
