import {View, TouchableOpacity, Platform, Alert} from 'react-native';
import React, {useState} from 'react';
import {Text} from '~/components/atoms';
import {useModal} from '~/features/residential/components/ResidentialModal';
import {useNavigation} from '~/navigations/AppNavigation';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import qrTokenService from '~/services/QRTokenService';
import NetInfo from '@react-native-community/netinfo';

const ResidentialRedemptionParkingTicketModal = () => {
  const [_, modalAction] = useModal();
  const [isConnected, setIsConnected] = useState(true);
  const navigation = useNavigation();

  const isNetConnected = async () => {
    return (await NetInfo.fetch()).isConnected;
  };
  const requestCameraPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      if (result === RESULTS.GRANTED) return true;
      else if (result === RESULTS.DENIED) {
      } else if (result === RESULTS.BLOCKED) {
      }
    } catch (error) {
      console.error('Error requesting camera:', error);
    }
    return false;
  };
  const onPressExploreCamera = async () => {
    // Android section
    if (Platform.OS === 'android') {
      const isGranted = await requestCameraPermission();
      // Inform: Need camera is disabled screen
      if (!isGranted) navigation.navigate('ResidentialCameraDisableScreen');
      // To: QRCode scanner
      //navigation.navigate('ResidentialParkingRedemptionScreen');
      else return;
    } else {
      //navigation.navigate('ResidentialParkingRedemptionScreen');
    }

    //navigation.navigate('CameraDisableScreen');
  };
  const onPressRedeemForMySelf = async () => {
    const {data} = await qrTokenService.get();
    const token = data?.token.id ?? 'mock-token-1234567890';
    if (token) {
      modalAction.hide();
      navigation.navigate('ParkingRedemptionDetailScreen', {
        token,
        internalQr: true,
      });
    }
  };

  return (
    <View
      className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 24}}>
      <View>
        <Text size="B1" weight="medium">
          Redemption Parking Ticket
        </Text>
        <Text size="B1" weight="regular" color="mist-gray-700">
          Select "Redeem for Myself" or "Redeem for Visitor."
        </Text>
      </View>
      <View style={{gap: 12}}>
        {/* <TouchableOpacity
          className="p-4 border border-fire-engine-red-dark flex-row justify-center"
          onPress={() => onPressDelete && onPressDelete()}>
          <Text size="B1" weight="medium" color="fire-engine-red">
            Delete
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onPressCancel && onPressCancel();
            modalAction.hide();
          }}
          className="p-4 border border-navy-dark flex-row justify-center">
          <Text size="B1" weight="medium" className="text-navy-dark">
            Cancel
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={onPressRedeemForMySelf}
          className="p-4 border border-[#BDBDBD] flex-row justify-center">
          <Text size="B1" weight="medium" color="dark-gray">
            Redeem for Myself
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            const connected = await isNetConnected();
            if (!connected) {
              navigation.navigate('ResidentialInternetNotConnectionScreen');
              return;
            }
            await onPressExploreCamera();
            modalAction.hide();
          }}
          className="p-4 border border-[#BDBDBD] flex-row justify-center">
          <Text size="B1" weight="medium" color="dark-gray">
            Redeem for Visitor
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-4 border border-fire-engine-red-dark flex-row justify-center"
          onPress={() => {
            modalAction.hide();
          }}>
          <Text size="B1" weight="medium" color="fire-engine-red">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResidentialRedemptionParkingTicketModal;
