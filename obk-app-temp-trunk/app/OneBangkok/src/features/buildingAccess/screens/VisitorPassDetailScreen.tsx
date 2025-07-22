import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  // Share,
} from 'react-native';
import React, {useCallback} from 'react';
import {Screen} from '~/components/templates';
import {Header} from '~/components/molecules/Header';
import t from '~/utils/text';
import {Spacing, Text} from '~/components/atoms';
import DetailCard from '../components/DetailCard';
import dayjs from 'dayjs';
import {Button, useModal} from '~/components/molecules';
import {Confirmation} from '~/components/organisms/GenericModal';
import TextDetailCard from '../components/TextDetailCard';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, StackNavigation} from '~/navigations/AppNavigation';
import {memberAction, memberState} from '../store/member';
import {useNavigation} from '@react-navigation/native';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import getTheme from '~/utils/themes/themeUtils';
import DateTime from '~/utils/datetime';
import {createVisitorPassAction} from '../store';
import Config from 'react-native-config';
import Share from 'react-native-share';
import {find} from 'lodash';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'VisitorPassDetailScreen'
>;
const ExpireTag = () => {
  return (
    <View
      className={getTheme(
        'flex justify-center items-center px-[24px] bg-error-200 h-[48px] w-full',
      )}>
      <Text color="fire-engine-red">
        {t('General__Visitor_pass_expired', 'Visitor pass expired')}
      </Text>
    </View>
  );
};
const VisitorPassDetailScreen = ({
  route: {
    params: {visitorPassDetail},
  },
}: Props) => {
  const [_modalState, modalActions] = useModal();
  const navigation = useNavigation<StackNavigation>();

  const visitorsDestroy = async () => {
    const result = await memberAction.deleteVisitorPass(
      visitorPassDetail.visitor_schedule.id,
    );
    if (result) {
      modalActions.hide();
      navigation.navigate('VisitorPassScreen');
    }
  };

  const handleOnPressDelete = () => {
    modalActions.setContent(
      <Confirmation
        title={t('General__Delete_visitor_pass', 'Delete visitor pass')}
        description={t(
          'Drawer__Delete_visitor_pass__Body',
          'Are you sure you want to Delete this visitor pass? The visitor will not have access to the building anymore',
        )}
        textConfirmButton={t(
          'General__Delete_visitor_pass',
          'Delete visitor pass',
        )}
        ConfirmButtonColor="danger"
        onContinue={() => visitorsDestroy()}
        onCancel={() => modalActions.hide()}
        ConfirmButtonOutlined={true}
      />,
    );
    modalActions.show();
  };

  const handleOnPressReactivate = () => {
    createVisitorPassAction.set({
      name: visitorPassDetail.visitor.name,
      companyName: visitorPassDetail.visitor.company_name,
      reference: visitorPassDetail.visitor.reference,
      email: visitorPassDetail.visitor.email,
      floorId: visitorPassDetail.visitor_schedule.floor_id,
      towerId: visitorPassDetail.visitor_schedule.tower_id,
    });

    navigation.navigate('CreateVisitorPassScreen');
  };
  const state = useHookstate(appLanguageState);
  const defaultSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const mapTowerAndFloorName = () => {
    const _towerList = memberState.towers.value ?? [];
    const indexTower = _towerList
      .map(e => e.id)
      .indexOf(visitorPassDetail.visitor_schedule.tower_id);

    const location = find(_towerList[indexTower].locations, {
      id: visitorPassDetail.visitor_schedule.floor_id,
    });
    const floorId = location.floor_id;
    const towerNameFallback = _towerList[indexTower].display_name
      ? _towerList[indexTower].display_name['en']
      : _towerList[indexTower].name;

    const floor = find(_towerList[indexTower].floors, {id: floorId});
    const floorNameFallback = floor.display_name
      ? floor.display_name['en']
      : floor.name;

    const towerName =
      _towerList[indexTower].display_name[defaultSelected] ?? towerNameFallback;
    const floorName = floor.display_name[defaultSelected] ?? floorNameFallback;
    return {towerName, floorName};
  };
  const {towerName, floorName} = mapTowerAndFloorName();
  const isExpire = dayjs(visitorPassDetail.to).isBefore(
    DateTime.getCurrentDateTime(),
  );
  const isDeleted = visitorPassDetail.visitor_schedule.deleted_at;
  const consent = visitorPassDetail.consent !== false;
  const showShareButton = !isExpire && consent && !isDeleted;
  const isShowReactivate = isExpire || isDeleted;
  const isOutlinedButton = !isExpire && !isDeleted;

  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const baseWebviewUrl = Config.WEB_VIEW_URL;
    const webviewUrl = `${baseWebviewUrl}?visit_schedule_id=${visitorPassDetail.visit_schedule_id}`;
    try {
      await Share.open({
        url: webviewUrl,
      });
    } catch (error: any) {
      console.log('user does not share');
      // Alert.alert(error.message);
    }
  }, [visitorPassDetail]);

  return (
    <Screen>
      <Header
        leftAction="goBack"
        title={t('General__Visitor_information', 'Visitor information')}
        iconHeight={25}
        iconWidth={25}
      />
      <ScrollView className="w-full px-6">
        <TouchableWithoutFeedback>
          <View className="flex w-full">
            <Spacing height={40} />
            {isShowReactivate && <ExpireTag />}
            {/* remove for demo on 8 jan 2024 */}
            {/* <Spacing height={24} />
            <Image
              source={{
                uri: mockData.img,
              }}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                borderRadius: IMAGE_SIZE / 2,
              }}
            /> */}
            <Spacing height={24} />
            <Text size="H3" weight="medium">
              {visitorPassDetail.visitor.name}
            </Text>
            <Spacing height={6} />
            <Text size="B2" color="muted-400">
              {visitorPassDetail.visitor.company_name}
            </Text>
            <Spacing height={24} />
            <DetailCard
              header={t('General__Personal_info', 'Personal information')}>
              <>
                <TextDetailCard
                  label={t('General__Name', 'Name')}
                  text={visitorPassDetail.visitor.name}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Email', 'Email')}
                  text={visitorPassDetail.visitor.email}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Company_name', 'Company name')}
                  text={visitorPassDetail.visitor.company_name}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Id_passport', 'ID number/Passport number')}
                  text={visitorPassDetail.visitor.reference}
                />
              </>
            </DetailCard>
            <Spacing height={24} />
            <DetailCard header={t('General__Access_detail', 'Access details')}>
              <>
                <TextDetailCard
                  label={t('General__Valid_on', 'Valid on')}
                  text={dayjs(visitorPassDetail.from)
                    .locale(defaultSelected)
                    .format('dddd DD MMMM YYYY')}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Time', 'Time')}
                  text={`${dayjs(visitorPassDetail.from).format(
                    'HH:mm',
                  )} - ${dayjs(visitorPassDetail.to).format('HH:mm')}`}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Building', 'Building')}
                  text={towerName}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Floor', 'Floor')}
                  text={floorName}
                />
              </>
            </DetailCard>

            <Spacing height={24} />
            <View className="flex w-full">
              {showShareButton && (
                <>
                  <View className="flex w-full">
                    <Button
                      title={t('General__Share', 'Share')}
                      onPress={handlePress}
                    />
                  </View>
                  <Spacing height={24} />
                </>
              )}
              <Button
                title={
                  isShowReactivate
                    ? t('General__Reactivate', 'Reactivate')
                    : t('General__Delete_visitor_pass', 'Delete visitor pass')
                }
                color={isShowReactivate ? 'light-gray' : 'error'}
                outlined={isOutlinedButton}
                onPress={
                  isShowReactivate
                    ? handleOnPressReactivate
                    : handleOnPressDelete
                }
              />
            </View>
            <Spacing height={40} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </Screen>
  );
};

export default VisitorPassDetailScreen;
