import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import Pagination from './Pagination';
import BlockUnit, {BLOCK_UNIT_MARGIN_RIGHT} from './BlockUnit';
import {deviceWidth, isTablet} from '../utils/device';
import {
  residentialHomeAutomationId,
  UnitDetail,
} from '~/states/residentialTenant/residentialTenantState';
import appLanguageState from '~/states/appLanguage/appLanguageState';

interface BlockUnitListProps {
  defaultUnit: string;
  properties: UnitDetail[];
  onActiveIndexChange: (
    index: number,
    houseNumber: string,
    propertyUnitId: string,
    projectId: string,
  ) => void;
  activeIndex: number;
}

const BlockUnitList: React.FC<{data: BlockUnitListProps}> = ({data}) => {
  const {defaultUnit, properties, onActiveIndexChange} = data;
  const [activeIndex, setActiveIndex] = useState(data.activeIndex);
  const prevIndexRef = useRef<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null); // Ref for ScrollView
  const language =
    appLanguageState.currentLanguage.value ||
    appLanguageState.defaultLanguage.value;

  const paddingHorizontal = 26;
  const gap = 10;
  const blockUnitWidth = isTablet
    ? 780 - paddingHorizontal - gap
    : deviceWidth - paddingHorizontal; // Include the gap

  useEffect(() => {
    const defaultIndex = properties.findIndex(
      property => property.houseNumber === defaultUnit,
    );
    if (defaultIndex !== -1 && defaultIndex !== activeIndex) {
      setActiveIndex(defaultIndex);
      prevIndexRef.current = defaultIndex;
      residentialHomeAutomationId.set(properties[defaultIndex].homeId);
      onActiveIndexChange(
        defaultIndex,
        properties[defaultIndex].houseNumber,
        properties[defaultIndex].propertyUnitId,
        properties[defaultIndex].projectId,
      );
    }
  }, [defaultUnit, properties, activeIndex, onActiveIndexChange]);

  useEffect(() => {
    if (
      scrollViewRef.current &&
      activeIndex !== prevIndexRef.current &&
      activeIndex !== 0
    ) {
      const offsetX =
        (blockUnitWidth + BLOCK_UNIT_MARGIN_RIGHT + 2) * activeIndex;
      scrollViewRef.current.scrollTo({x: offsetX, animated: true});
      prevIndexRef.current = activeIndex;
    }
  }, [activeIndex, blockUnitWidth, gap]);

  const handleScroll = useCallback(
    (event: any) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / (blockUnitWidth + gap));
      if (index !== prevIndexRef.current) {
        setActiveIndex(index);
        prevIndexRef.current = index;
        residentialHomeAutomationId.set(properties[index].homeId);
        onActiveIndexChange(
          index,
          properties[index].houseNumber,
          properties[index].propertyUnitId,
          properties[index].projectId,
        );
      }
    },
    [blockUnitWidth, gap, onActiveIndexChange, properties],
  );

  return (
    <View>
      <ScrollView
        ref={scrollViewRef} // Attach ref to ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        pagingEnabled
        snapToAlignment="center"
        scrollEnabled={properties.length > 1}>
        {properties.map((unit, index) => (
          <BlockUnit
            key={index}
            title={unit.houseNumber}
            image={unit.backgroundUrl}
            subtitle={
              language === 'th' ? unit.projectsNameThai : unit.projectsName
            }
            logo={unit.iconUrl}
            isActive={index === activeIndex}
            isShowLogo={!unit.hideLogoFromFrontEnd}
          />
        ))}
      </ScrollView>
      {properties.length > 1 && (
        <Pagination
          numberOfIndicators={properties.length}
          activeIndex={activeIndex}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 12,
  },
  activeBlock: {
    borderColor: '#014541',
  },
});

export default BlockUnitList;
