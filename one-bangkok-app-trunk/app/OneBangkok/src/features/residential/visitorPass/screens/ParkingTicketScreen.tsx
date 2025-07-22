import {Pressable, ScrollView, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {HeadText, Header} from '~/components/molecules';
import t from '~/utils/text';
import {Spacing, Text} from '~/components/atoms';
import dayjs from 'dayjs';
import ParkingTicketQrcode from '../components/ParkingTicketQrcode';
import qrTokenService from '~/services/QRTokenService';
import {get, isEmpty, isNull} from 'lodash';
import * as OB_BMS_SDK from 'ob-bms-sdk';
import {memberState} from '../store/member';
import getTheme from '~/utils/themes/themeUtils';
import Loading from '~/components/organisms/Loading';
import ParkingDetail from '../components/ParkingDetail';
import {WrappedResponseParkingTicketDataData} from 'ob-bms-sdk/dist/api';
import faqAction from '~/states/setting/faq/faqAction';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {DocumentDetailData} from '~/utils/ob_sdk/services/ob_document/index.interface';
import Markdown from 'react-native-marked';
import {Screen} from '~/components/templates';
// import {logScreenView} from '~/utils/logGA';
import {StackNavigation} from '~/navigations/AppNavigation';
import {useNavigation} from '@react-navigation/native';
import {logScreenView} from '~/utils/logGA';

interface IProps {
  qrValue: string;
  parkingTicketData?: WrappedResponseParkingTicketDataData | null;
}

export interface RateDetail {
  en: string;
  th: string;
}

const RenderQrCode = (props: IProps) => {
  const {parkingTicketData, qrValue} = props;
  if (!qrValue) return null;

  if (parkingTicketData) {
    return (
      <ParkingTicketQrcode
        qrValue={qrValue}
        parkingTicketData={parkingTicketData}
      />
    );
  } else {
    return <ParkingTicketQrcode qrValue={qrValue} />;
  }
};

const ParkingTicketScreen = () => {
  const [parkingTicketData, setParkingTicketData] =
    useState<WrappedResponseParkingTicketDataData>();

  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<DocumentDetailData>();

  const currentLanguage = appLanguageState.currentLanguage.get()
    ? appLanguageState.currentLanguage.get()
    : 'en';

  const generateQrCodeOfMember = async () => {
    const result = await qrTokenService.generate();
    const qrData = get(result, 'data');

    if (!isNull(qrData) && !isEmpty(qrData)) {
      const tokenString = JSON.stringify(qrData.token);
      setQrValue(tokenString);
    }
  };

  const fetchQrCodeOfMember = useCallback(async () => {
    const result = await qrTokenService.get();
    const qrData = get(result, 'data');
    if (isNull(qrData) || isEmpty(qrData)) {
      await generateQrCodeOfMember();
    } else {
      const tokenString = JSON.stringify(qrData.token);

      setQrValue(tokenString);
    }
  }, []);

  const fetchData = useCallback(async () => {
    await fetchQrCodeOfMember();

    const res = await OB_BMS_SDK.client.parkingTicketsIndex(
      'member_id',
      memberState.id.value,
    );
    if (res?.data?.data) {
      setParkingTicketData(
        res?.data?.data[0] as WrappedResponseParkingTicketDataData,
      );
    }
    setLoading(false);
  }, [fetchQrCodeOfMember]);

  useEffect(() => {
    fetchData();
    fetchTermsAndConditions();
  }, [fetchData, fetchQrCodeOfMember]);

  const fetchTermsAndConditions = useCallback(async () => {
    const document = await faqAction.getFaqDetail(
      'parking-terms-and-conditions',
      currentLanguage,
    );
    if (document) {
      setContent({
        document: {
          id: document.id!,
          title: document.title! as string,
          body: document.body! as string,
        },
      });
    }
  }, [currentLanguage]);
  useEffect(() => {
    logScreenView('ParkingRedemptionScreen');
  }, []);

  if (loading) {
    return (
      <Screen>
        <Loading isLoading={loading} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header leftAction="goBack" />
      <ScrollView className="w-full px-5">
        <Pressable>
          <HeadText
            taglineColor="muted"
            tagline={t('General__One_bangkok', 'One Bangkok')}
            title={t('General__My_parking_ticket', 'My Parking Ticket')}
          />
          <Text size="C1" weight="regular">{`${dayjs()
            .locale(currentLanguage)
            .format('dddd DD MMMM YYYY')} at ${dayjs().format('HH:mm')}`}</Text>
          <Spacing height={24} />
          <View className={`${getTheme('border-[1px] border-line')} px-4`}>
            <RenderQrCode
              qrValue={qrValue}
              parkingTicketData={parkingTicketData}
            />
            <Spacing height={16} />
            {parkingTicketData && <ParkingDetail data={parkingTicketData} />}
          </View>
          <Spacing height={32} />
          <TermAndCondition content={content} />
          <Spacing height={100} />
        </Pressable>
      </ScrollView>
    </Screen>
  );
};

export default ParkingTicketScreen;

const TermAndCondition = ({content}: {content?: DocumentDetailData}) => {
  return (
    <>
      {!isEmpty(content) && (
        <View>
          <Text className={'leading-[30.8px]'} weight="medium" size="H2">
            {content.document.title}
          </Text>
          <Markdown
            flatListProps={{scrollEnabled: false}}
            value={content.document.body}
            styles={{text: {fontFamily: 'OneBangkok-Regular'}}}
          />
        </View>
      )}
    </>
  );
};
