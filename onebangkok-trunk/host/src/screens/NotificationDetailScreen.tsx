import React, {useEffect} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {find, get} from 'lodash';

import {
  OBSpacing,
  LanguageButton,
  BottomNextButton,
  BottomNextButtonSize,
  Screen,
  Header,
} from '../components';
import DateTime from '~/utils/datetime';
import T from '../utils/text';

import {Styles, Colors} from '../constants';

import notificationState from '~/states/notification/notificationState';
import {RootStackParamList} from '../navigations/AppNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {logScreenView} from '~/utils/logGA';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NotificationDetailScreen'
>;

const NotificationDetailScreen = ({
  route: {
    params: {id},
  },
}: Props) => {
  const currentData = find(notificationState.data.value, {id});
  const data = get(currentData, 'data');
  const insets = useSafeAreaInsets();

  const findImage = (data: any) => {
    let haveImage = false;
    let imagePath = '';
    for (const item of data) {
      if (item.data.path) {
        haveImage = true;
        imagePath = item.data.path;
        break;
      }
    }
    return [haveImage, imagePath];
  };

  const [haveImage, imagePath] = findImage(data);

  const styles = StyleSheet.create({
    scrollView: {
      paddingTop: 40,
      paddingBottom: 35,
      paddingHorizontal: 28,
      flex: 1,
    },
    timeText: {
      marginBottom: 16,
      color: Colors.black10,
    },
    image: {
      width: '100%',
      borderRadius: 8,
      aspectRatio: 259 / 146,
      marginBottom: 3,
    },
    type: {
      color: Colors.white100,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderColor: Colors.white100,
      borderWidth: 1,
      borderRadius: 2,
      alignSelf: 'flex-start',
    },
  });

  const onPressActionButton = () => {};

  const buildContent = (dataWidget: object, index: number) => {
    if (dataWidget?.id === 'temda2') {
      return (
        <Text
          key={'image-' + index}
          style={[Styles.textRegular, {marginBottom: 32}]}>
          {dataWidget.data.en}
        </Text>
      );
    } else {
      return (
        <Image
          key={'image-' + index}
          style={styles.image}
          source={{
            uri: imagePath,
          }}
          resizeMode={'stretch'}
        />
      );
    }
  };

  const buildWidget = () => {
    const widgetContent = data?.map((row, index) => buildContent(row, index));

    return <View>{widgetContent}</View>;
  };

  const title = currentData?.title ?? '';
  const subTitle = currentData?.sub_title ?? '';
  const type = currentData?.type;
  const image = imagePath;
  const time = DateTime.getDiffDateTimeText(currentData?.created_at ?? '');
  const action = 'ACTION';
  useEffect(() => {
    logScreenView('NotificationDetailScreen');
  }, []);
  return (
    <Screen>
      <Header
        title={T('General__notifications', 'Notifications')}
        headerRight={<LanguageButton />}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{paddingBottom: insets.bottom}}>
        <Pressable onPress={() => {}} style={{flex: 1}}>
          {time && (
            <Text style={[Styles.textB2Regular, styles.timeText]}>{time}</Text>
          )}
          {haveImage && (
            <Image
              style={styles.image}
              source={{
                uri: image,
              }}
              resizeMode={'stretch'}
            />
          )}
          <OBSpacing height={13} />
          {title && (
            <Text style={[Styles.textH3Medium, {marginBottom: 16}]}>
              {title}
            </Text>
          )}
          {subTitle && (
            <Text style={[Styles.textRegular, {marginBottom: 16}]}>
              {subTitle}
            </Text>
          )}
          {buildWidget()}
          <OBSpacing height={20} />

          {type && (
            <Text style={[Styles.textC1Regular, styles.type]}>{type}</Text>
          )}
        </Pressable>
        <OBSpacing height={50} />
      </ScrollView>
      <BottomNextButton
        size={BottomNextButtonSize.Big}
        onPress={onPressActionButton}
        centerText={action}
        enabled={false}
      />
    </Screen>
  );
};

export default NotificationDetailScreen;
