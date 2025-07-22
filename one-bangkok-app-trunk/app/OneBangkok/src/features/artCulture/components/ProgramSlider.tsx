import React from 'react';
import ProgramSliderItem from './ProgramSliderItem';
import {Dimensions, StyleSheet, View} from 'react-native';
import {IArtCType, IProgram} from '~/models/ArtCulture';
import Swiper from 'react-native-swiper';

interface IProgramSlider {
  items: IProgram[];
  autoplay: number;
  artCTypes: IArtCType[];
}

const ProgramSlider = ({items, autoplay, artCTypes}: IProgramSlider) => {
  const styles = StyleSheet.create({
    subBox: {
      width: Dimensions.get('window').width / 2 - 16,
      height: 80,
      borderRadius: 10,
    },
    subBoxFont: {
      fontSize: 18,
      lineHeight: 18,
      color: 'white',
      textAlign: 'center',
    },
    linearGradient: {
      flex: 1,
    },
    wrapperBanner: {
      height: 600,
      backgroundColor: '#000000',
    },
    dot: {
      backgroundColor: '#454541',
      width: 25,
      height: 3,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3,
    },
    activeDot: {
      backgroundColor: '#f5f5f4',
      width: 100,
      height: 3,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3,
    },
  });

  return (
    <View>
      {items.length > 0 ? (
        <Swiper
          style={styles.wrapperBanner}
          autoplay
          autoplayTimeout={autoplay}
          loop={true}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}>
          {items.map(item => (
            <View key={`slide-item-${item.artCTypeId}-${item.id}`}>
              <ProgramSliderItem
                item={item}
                artCType={artCTypes.find(aItem => item.artCTypeId === aItem.id)}
              />
            </View>
          ))}
        </Swiper>
      ) : (
        <View className="w-full h-[600px] bg-jet-black-light" />
      )}
    </View>
  );
};

export default ProgramSlider;
