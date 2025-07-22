import React, {useRef} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {StyleSheet, View} from 'react-native';

interface IProps {
  children: React.ReactNode;
  snapPoints?: Array<string | number>;
}

interface IBottomSheetBackgroundProps {
  style?: any;
}

const BottomSheetBackground = ({style}: IBottomSheetBackgroundProps) => {
  return <View style={[{...styles.customBackground}, {...style}]} />;
};

const BottomSheetContent = ({
  children,
  snapPoints = ['23%', '60%'],
}: IProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      style={styles.container}
      backgroundComponent={BottomSheetBackground}>
      <View className="flex-1 px-4 pt-4">{children}</View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
    borderRadius: 0,
    backgroundColor: 'white',
    position: 'relative',
  },
  contentContainer: {},
  customBackground: {
    backgroundColor: 'white',
    borderRadius: 0,
  },
});

export default BottomSheetContent;
