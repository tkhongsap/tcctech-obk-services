import {View} from 'react-native';
import React from 'react';
import {Spacing, Text} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import t from '~/utils/text';
import QRCode from 'react-native-qrcode-svg';
import {IParkingTicket} from '../screens/ParkingTicketScreen';

interface IProps {
  qrValue: string;
  parkingTicketData?: IParkingTicket;
}
const ParkingTicketQrcode = (props: IProps) => {
  const {parkingTicketData, qrValue} = props;
  if (parkingTicketData) {
    return (
      <View className={`${getTheme('w-full items-center px-4 py-6')}`}>
        <View>
          <View className="flex items-center ">
            <Text weight="medium" size="H1">
              {t('no_key', `${parkingTicketData.plate_number}`)}
            </Text>
            <Text color="muted" size="B2">
              {t('General__License_plate', 'License Plate')}
            </Text>
            <Spacing height={16} />
          </View>
        </View>
        <Spacing height={24} />
        <QRCode size={200} value={qrValue} />
      </View>
    );
  } else {
    return (
      <View className={`${getTheme('w-full items-center px-4 py-6')}`}>
        <QRCode size={200} value={qrValue} />
        <Spacing height={24} />
        <Text className="w-full text-center">
          {t('General__Scan_qr_parking', 'Scan this QR code at the parking gate')}
        </Text>
      </View>
    );
  }
};

export default ParkingTicketQrcode;
