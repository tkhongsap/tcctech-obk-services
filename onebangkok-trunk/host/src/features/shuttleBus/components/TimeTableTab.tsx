import {StyleSheet, View} from 'react-native';
import React, {ComponentType, useEffect, useState} from 'react';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {Text} from '~/components/atoms';

export default function TimeTableTab({
  sceneMap,
  routes,
  selectedIndex,
}: {
  sceneMap: {[key: string]: ComponentType<unknown>};
  routes: {key: string; title: any}[];
  selectedIndex: number;
}) {
  const [index, setIndex] = useState(selectedIndex);
  const [containerWidth, setContainerWidth] = useState(0);
  const renderScreen = SceneMap(sceneMap);

  useEffect(() => {
    setIndex(selectedIndex);
  }, [routes]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicatorStyle}
      style={styles.tabBar}
      activeColor="#464646"
      renderLabel={({route, focused}) => (
        <View style={styles.tabContainer}>
          <Text size="B1" color={focused ? 'default' : 'muted-400'}>
            {route.title}
          </Text>
        </View>
      )}
      android_ripple={{color: 'white'}}
      tabStyle={[styles.tabStyle, {width: containerWidth / 2}]}
    />
  );

  return (
    <View
      style={styles.container}
      onLayout={event => {
        const {width} = event.nativeEvent.layout;
        setContainerWidth(width);
      }}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScreen}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{width: containerWidth}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: 'white',
    borderBlockColor: '#DCDCDC',
    borderBottomWidth: 1,
  },
  indicatorStyle: {
    backgroundColor: '#464646',
    height: 1,
  },
  tabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabStyle: {
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 16,
  },
  tabTextActive: {
    color: '#000',
  },
  tabTextInactive: {
    color: '#999',
  },
});
