import React, {useState, useEffect, ComponentType} from 'react';
import {View, Modal, Pressable, Text, StyleSheet} from 'react-native';
import Config from 'react-native-config';
import {TapGestureHandler, State} from 'react-native-gesture-handler';
import {useNavigation} from '~/navigations/AppNavigation';

//For testing
const withCountTap = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return (props: P) => {
    const [tapCount, setTapCount] = useState(0);
    const [lastTapTime, setLastTapTime] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
      if (tapCount === 5) {
        setModalVisible(true);
        setTapCount(0); // reset tap count
      }
    }, [tapCount]);

    const handleSingleTap = (event: any) => {
      if (
        event.nativeEvent.state === State.ACTIVE &&
        (Config.OB_ENV === 'dev' || Config.OB_ENV === 'uat')
      ) {
        const now = Date.now();
        if (lastTapTime && now - lastTapTime > 1000) {
          setTapCount(1); // reset tap count if more than 1 second has passed
        } else {
          setTapCount(tapCount + 1);
        }
        setLastTapTime(now);
      }
    };

    const handleNavigate = (name: any) => {
      navigation.navigate(name);
      setModalVisible(false);
    };

    return (
      <TapGestureHandler onHandlerStateChange={handleSingleTap}>
        <View style={{flex: 1}}>
          <WrappedComponent {...props} />
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Debug</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text
                    style={styles.textStyle}
                    onPress={() => handleNavigate('HomeScreen')}>
                    Home
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </TapGestureHandler>
    );
  };
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default withCountTap;
