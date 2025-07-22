import {StyleSheet, useWindowDimensions} from 'react-native';
import React, {ComponentType, useEffect, useState} from 'react';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {Text} from '~/components/atoms';

export default function SmartParkingInfoTab({
  sceneMap,
  routes,
  defaultIndex = 0,
}: {
  sceneMap: {[key: string]: ComponentType<unknown>};
  routes: {key: string; title: any}[];
  defaultIndex?: number;
}) {
  const layout = useWindowDimensions();
  let renderScene = SceneMap(sceneMap);
  const [index, setIndex] = useState(defaultIndex);

  useEffect(() => {
    if (index > routes.length - 1) {
      setIndex(0);
    }
  }, [routes]);

  const renderTabBar = props => (<TabBar
      {...props}
      indicatorStyle={styles.indicatorStyle}
      style={styles.tabBar}
      activeColor="#464646"
      scrollEnabled={true}
      tabStyle={{
        width: 'auto',
        marginHorizontal: 24,
      }}
      navigationState={{index, routes}}
      renderLabel={({route, focused}) => (
        <Text size="B1" color={focused ? 'default' : 'muted-400'}>
          {route.title}
        </Text>
      )}
      android_ripple={{color: 'white'}}
    />
  );
    
  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    borderBlockColor: '#DCDCDC',
    borderBottomWidth: 1,
  },
  indicatorStyle: {
    backgroundColor: '#464646',
    height: 1,
  },
});
