import {Animated} from 'react-native';

export const AnimtedAppBar = (props: any) => {
  props = {
    translateY: 0,
    ...props,
  };

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'transparent',
        width: '100%',
        //for animation
        height: 120,
        transform: [{translateY: props.translateY}],
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        elevation: 4,
        zIndex: 1,
      }}>
      {props.children}
    </Animated.View>
  );
};
