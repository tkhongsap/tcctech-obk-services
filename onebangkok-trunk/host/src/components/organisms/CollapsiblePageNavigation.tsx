import React, {useRef} from 'react';

import {Animated, SafeAreaView, View} from 'react-native';

const {diffClamp} = Animated;

export const CollapsibleHead = ({headerHeight, translateY, children}: any) => {
  return (
    <Animated.View
      style={[
        {
          height: headerHeight,
          transform: [{translateY}],
        },
      ]}>
      {children}
    </Animated.View>
  );
};
export const CollapsibleBody = ({
  scrollY,
  translateY,
  headerHeight,
  translateYNumber,
  scrollToTop,
  onScrollToTop,
  components,
}: any) => {
  let returnComponent;
  if (Array.isArray(components)) {
    returnComponent = components.map((item: any, index: number) => {
      return React.cloneElement(item, {
        key: index,
        scrollY: scrollY,
        translateY: translateY,
        headerHeight: headerHeight,
        translateYNumber: translateYNumber,
        scrollToTop: scrollToTop,
        onScrollToTop: onScrollToTop,
        ...item.props,
      });
    });
  }
  returnComponent = React.cloneElement(components, {
    key: 'collapsible-body',
    scrollY: scrollY,
    translateY: translateY,
    headerHeight: headerHeight,
    translateYNumber: translateYNumber,
    scrollToTop: scrollToTop,
    onScrollToTop: onScrollToTop,
    ...components.props,
  });
  return <>{returnComponent}</>;
};

const CollapsiblePageNavigation = ({
  children,
  headerHeight,
  scrollToTop,
  onScrollToTop,
}: any) => {
  const scrollY = useRef(new Animated.Value(0));
  const translateYNumber = useRef();
  const scrollYClamped = diffClamp(scrollY.current, 0, headerHeight);
  const collapsibleHeader = children.find(
    (child: any) => child.type.name === 'CollapsibleHead',
  );
  const collapsibleBody = children.find(
    (child: any) => child.type.name === 'CollapsibleBody',
  );
  const headerContent = collapsibleHeader.props.children;
  const bodyComponents = collapsibleBody.props.children;

  const translateY = scrollYClamped.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
  });
  translateY.addListener(({value}) => {
    translateYNumber.current = value;
  });

  return (
    <SafeAreaView>
      <CollapsibleHead headerHeight={headerHeight} translateY={translateY}>
        {headerContent}
      </CollapsibleHead>
      <View style={{flex: 1}}>
        <CollapsibleBody
          scrollY={scrollY}
          translateY={translateY}
          headerHeight={headerHeight}
          translateYNumber={translateYNumber}
          components={bodyComponents}
          scrollToTop={scrollToTop}
          onScrollToTop={onScrollToTop}
        />
      </View>
    </SafeAreaView>
  );
};

export default CollapsiblePageNavigation;
