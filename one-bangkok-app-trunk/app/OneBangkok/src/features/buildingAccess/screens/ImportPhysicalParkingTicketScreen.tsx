import {useIsFocused} from '@react-navigation/native';
import {first, last, size, split} from 'lodash';
import {useEffect, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {Header} from '~/components/molecules';
import {logScreenView} from '~/utils/logGA';
import React from 'react';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';

/***** for testing on local during debug only ********/
// simulator can not open the camera to get the parking ticket id
// so we need to mock data to skip this process
const isDebug = false;
const logId = "202507192021563201";
/*****************************************************/

const ImportPhysicalParkingTicketScreen = () => {
  const navigation = useNavigation();
  const [permissionStatus, setPermissionStatus] = useState('');
  const device = useCameraDevice('back');
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
    if (isDebug) {
        navigation.navigate('ImportPhysicalParkingDetailScreen', {
          logId: logId,
        });
    } else {
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
    }
  }, [permissionStatus]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (codes.length > 0) {
        try {
          const data = first(codes)?.value;
          const stringArray = split(data, '/');
          if (size(stringArray) !== 0) {
            const id = last(stringArray);
            if (id) {
              navigation.navigate('ImportPhysicalParkingDetailScreen', {
                logId: id,
              });
            }
          }
        } catch (error) {
          navigation.navigate('AnnouncementScreen', {
            type: 'invalid',
            title: t(
              'Announcement__Save_ticket__Invalid_tile',
              'Invalid parking ticket',
            ),
            message: t(
              'Announcement__Save_ticket__Invalid_description',
              'This parking ticket cannot be imported. This maybe due to this parking has previously been imported. Please check and try again. \n \nPlease contact our support',
            ),
            buttonText: t('General__Try_again', 'Try again'),
            screenHook: 'ImportPhysicalParkingDetailScreen',
            specialWidget: 'contactSupport',
          });
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
        {
        !isDebug && <Camera
          device={device!}
          isActive={isFocused}
          codeScanner={codeScanner}
          style={styles.camera}
        />
        }
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

export default ImportPhysicalParkingTicketScreen;
