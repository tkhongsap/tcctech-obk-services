import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import {Header, useModal} from '~/components/molecules';
import {useNavigation} from '~/navigations/AppNavigation';
import {
  useCameraDevice,
  Camera,
  useCodeScanner,
} from 'react-native-vision-camera';
import t from '~/utils/text';
import {first, get, last, size, split} from 'lodash';
import {Confirmation} from '~/components/organisms/GenericModal';
import {useIsFocused} from '@react-navigation/native';
import {logScreenView} from '~/utils/logGA';

const ErrorModal = ({
  onContinue,
  onCancel,
}: {
  onContinue: Function;
  onCancel: Function;
}) => {
  return (
    <Confirmation
      title={t('General__Something_went_wrong', 'Something went wrong')}
      description={t(
        'Drawer__Redemption__Description',
        'We’re unable to scan the parking ticket. Please check you camera before trying again.',
      )}
      onContinue={() => {
        onContinue();
      }}
      onCancel={() => {
        onCancel();
      }}
    />
  );
};

const ParkingRedemptionScreen = () => {
  const navigation = useNavigation();
  const [permissionStatus, setPermissionStatus] = useState('');
  const device = useCameraDevice('back');
  const [_modalState, modalActions] = useModal();
  const isFocused = useIsFocused();

  const checkPermission = () => {
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.CAMERA).then(result => {
        setPermissionStatus(result);
      });
    } else {
      request(PERMISSIONS.ANDROID.CAMERA).then(result => {
        setPermissionStatus(result);
      });
    }
  };

  useEffect(() => {
    checkPermission();
    const intervalId = setInterval(() => {
      if (permissionStatus !== 'granted') {
        checkPermission();
      } else {
        clearInterval(intervalId); // Stop checking when permission is granted
      }
    }, 5000); // Check every 5 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [permissionStatus]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (codes.length > 0) {
        const data = first(codes)?.value;

        try {
          const jsonData = JSON.parse(data!);
          const id = get(jsonData, ['id']);
          if (id) {
            navigation.navigate('ParkingRedemptionDetailScreen', {
              token: id,
              internalQr: true,
            });
          } else {
            modalActions.setContent(
              <ErrorModal
                onContinue={() => {
                  modalActions.hide();
                }}
                onCancel={() => {
                  modalActions.hide();
                  navigation.navigate('BuildingServiceScreen');
                }}
              />,
            );
            modalActions.show();
          }
        } catch (error) {
          const stringArray = split(data, '/');
          if (size(stringArray) !== 0) {
            const id = last(stringArray);
            navigation.navigate('ParkingRedemptionDetailScreen', {
              token: id!,
              internalQr: false,
            });
          } else {
            modalActions.setContent(
              <ErrorModal
                onContinue={() => {
                  modalActions.hide();
                }}
                onCancel={() => {
                  modalActions.hide();
                  navigation.navigate('BuildingServiceScreen');
                }}
              />,
            );
            modalActions.show();
          }
        }
      }
    },
  });
  useEffect(() => {
    logScreenView('ParkingRedemptionScreen');
  }, []);
  return (
    <View style={styles.container}>
      <Header
        title={t('General__Scan_qr', 'Scan QR Code')}
        leftAction="goBack"
      />
      <View style={styles.cameraContainer}>
        <Camera
          device={device!}
          isActive={isFocused}
          codeScanner={codeScanner}
          style={styles.camera}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFE',
  },
  cameraContainer: {
    height: '85%',
    width: '90%',
    borderRadius: 4,
    overflow: 'hidden',
    alignContent: 'center',
    alignSelf: 'center',
  },
  camera: {
    height: '100%',
  },
});
export default ParkingRedemptionScreen;
