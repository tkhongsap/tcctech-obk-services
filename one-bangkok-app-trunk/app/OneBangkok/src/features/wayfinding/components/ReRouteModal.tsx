import {t} from 'i18next';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {Icon} from '~/components/atoms';

const {height} = Dimensions.get('window');

type Props = {
  isShowModal: boolean;
  onClose: () => void;
  onReRoute: () => void;
};

const ReRouteModal = ({isShowModal, onClose, onReRoute}: Props) => {
  return (
    <View style={styles.container}>
      <Modal
        hasBackdrop={false}
        isVisible={isShowModal}
        onBackdropPress={onClose}
        style={styles.bottomModal}
        swipeDirection={['down']}
        onSwipeComplete={onClose}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}>
        <View style={styles.modalContent}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.iconWrapper}>
              <Icon type="redWarning" width={18} height={18} />
            </View>
            <View style={styles.wrongDirection}>
              <Text style={styles.title}>
                {t('Wrong_Direction', 'Wrong Direction')}
              </Text>
            </View>
          </View>
          <View>
            <View style={{marginLeft: 35}}>
              <Text style={styles.detail}>
                {t(
                  'Wrong_Direction_Desc',
                  "You're out of route need to Re-route",
                )}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onReRoute}>
            <View>
              <Text style={styles.buttonLabel}>
                {t('Re_Route_Button', 'Re-route')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0F4381',
    padding: 10,
    borderRadius: 5,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    minHeight: height * 0.2, // Adjust as needed
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#0F4381',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  textWrapper: {
    flexDirection: 'column',
    padding: 10,
    backgroundColor: 'green',
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  detail: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 20,
  },
  title: {
    color: '#000000',
    fontWeight: '500',
    fontSize: 16,
  },
  wrongDirection: {
    flexDirection: 'column',
    paddingTop: 10,
    marginLeft: 8,
  },
  iconWrapper: {
    flexDirection: 'column',
    paddingTop: 10,
  },
});

export default ReRouteModal;
