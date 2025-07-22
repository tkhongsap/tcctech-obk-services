import {TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HeadText, Header, StickyButton} from '~/components/molecules';
import t from '~/utils/text';
import {Spacing, Text} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import VisitorPassList from '../components/VisitorPassList';
import {memberAction} from '../store/member';
import DateTime from '~/utils/datetime';
import {PassData} from 'ob-bms-sdk/dist/api/api';
import clsx from 'clsx';
import {isNull} from 'lodash';
import {HeaderImage} from '~/components/molecules/HeaderImage';

interface visitorPassState {
  active: Array<PassData>;
  expire: Array<PassData>;
}

const VisitorPassScreen = () => {
  const [visitorPass, setVisitorPass] = useState<visitorPassState>({
    active: [],
    expire: [],
  });
  const [index, setIndex] = useState(0);

  const navigation = useNavigation<StackNavigation>();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIndex(0);
    });

    return unsubscribe;
  }, [navigation]);
  const getData = () => {};
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const data = await memberAction.getMember();
      const expire: PassData[] = [];
      const active: PassData[] = [];
      if (data?.passes) {
        const {passes} = data;
        const currentDateTime = DateTime.getCurrentDateTime().toISOString();
        passes.forEach((pass, _index) => {
          const consent = isNull(pass.consent) || pass.consent;
          if (
            DateTime.isBefore(pass.to, currentDateTime) ||
            !consent ||
            pass.visitor_schedule?.deleted_at
          ) {
            expire.push(pass);
          } else {
            active.push(pass);
          }
        });
      }
      setVisitorPass({active: active, expire: expire});
    });
    return unsubscribe;
  }, [navigation]);

  const handleSetIndex = (_index: number) => {
    if (_index !== index) {
      setIndex(_index);
    }
  };

  const tabClassName = (_index: number) =>
    clsx(
      getTheme(' leading-[17.6px]  justify-center '),
      getTheme(
        index === _index ? 'border-b border-jet-black' : 'border-b border-line',
      ),
    );

  return (
    <>
      <HeaderImage
        defaultImage={require('../../../assets/images/bg_visitor_pass.png')}>
        <Header
          leftAction="goBack"
          onPressLeftAction={() => navigation.goBack()}
          bgColor={getTheme('bg-transparent')}
          leftColor={'#ffffff'}
          iconHeight={25}
          iconWidth={25}
        />
        <Spacing height={8} />
        <View className="px-5">
          <HeadText
            tagline={t('General__One_bangkok', 'One Bangkok')}
            title={t('General__Visitor_pass', 'Visitor Pass')}
            description={t(
              'Visitor_pass__Visitor_pass__Body',
              'You can invite guests to your office and send them a pass to avoid waitings in the lobby.',
            )}
            titleColor="default-inverse"
            taglineColor="sky-blue"
            descriptionColor="line"
            descriptionSpacing={16}
          />
        </View>
      </HeaderImage>
      <View className={getTheme('bg-default flex w-full px-5')}>
        <Spacing height={24} />
        <View className="flex flex-row">
          <TouchableOpacity
            onPress={() => handleSetIndex(0)}
            className={tabClassName(0)}
            style={{height: 47, width: '50%'}}>
            <Text
              className="text-center"
              weight={index === 0 ? 'medium' : 'regular'}>
              {t('General__Active', 'Active')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSetIndex(1)}
            className={tabClassName(1)}
            style={{height: 47, width: '50%'}}>
            <Text
              className="text-center"
              weight={index === 1 ? 'medium' : 'regular'}>
              {t('General__Expired', 'Expired')}
            </Text>
          </TouchableOpacity>
        </View>
        <Spacing height={12} />
      </View>
      {index === 0 && (
        <View
          style={{flex: 1, flexGrow: 1}}
          className={getTheme('bg-vp-list z-10')}>
          <VisitorPassList
            data={visitorPass.active}
            showDate={true}
            getData={getData}
            type={'active'}
          />
        </View>
      )}
      {index === 1 && (
        <View
          style={{flex: 1, flexGrow: 1}}
          className={getTheme('bg-vp-list z-10')}>
          <VisitorPassList
            data={visitorPass.expire}
            showDate={false}
            getData={getData}
            type={'expired'}
          />
        </View>
      )}
      <StickyButton
        title={t('General__Create_visitor_pass', 'Create visitor pass')}
        rightIcon="plusIcon"
        iconHeight={20}
        iconWidth={20}
        onPress={() => {
          navigation.navigate('CreateVisitorPassScreen');
        }}
      />
    </>
  );
};

export default VisitorPassScreen;
