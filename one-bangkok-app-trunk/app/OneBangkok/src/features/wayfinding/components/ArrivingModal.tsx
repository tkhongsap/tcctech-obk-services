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

const {width, height} = Dimensions.get('window');

type Props = {
  isShowModal: boolean;
  onClose: () => void;
};

const ArrivingModal = ({isShowModal, onClose}: Props) => {
  return (
    <Modal onBackdropPress={() => onClose()} isVisible={!!isShowModal}>
      <View style={styles.modal}>
        <TouchableOpacity
          onPress={() => onClose()}
          style={styles.closeButtonWrapper}>
          <Icon
            type="close"
            width={20}
            height={20}
            className="text-white font-bold text-xs"
          />
        </TouchableOpacity>
        <View style={styles.contentWrapper}>
          <Icon
            type="locationPin"
            width={80}
            height={80}
            className="text-white font-semibold text-xs mr-2"
          />
          <View style={styles.subtitleWrapper}>
            <Text style={styles.subtitle}>
              {t(
                'Arrived_At_destination',
                'You have arrived at your destination.',
              )}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontFamily: 'OneBangkok-Bold',
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    marginTop: 16,
  },
  subtitleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    maxHeight: height * 0.25,
    borderRadius: 10,
    maxWidth: width * 0.7,
    alignSelf: 'center',
    padding: 16,
  },
  contentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default ArrivingModal;
