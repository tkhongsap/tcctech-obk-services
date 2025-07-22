import {View, StyleSheet} from 'react-native';
import React, {ReactElement} from 'react';
import {TabBar, TabView} from 'react-native-tab-view';
import {Colors} from '../constants/Colors';
import s from '../constants/Styles';
import {get} from 'lodash';

export interface ObTabViewData {
  key: string;
  title: string;
  content: ReactElement;
  onClick: Function;
}

type Props = {
  data: ObTabViewData[];
};

export default function OBTabView({data}: Props) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    tabStyle: {
      width: 'auto',
      height: 46,
      paddingHorizontal: 18,
      paddingBottom: 8,
      color: Colors.black100,
    },
    tabBar: {
      backgroundColor: '#00000000',
      shadowColor: '#00000000',
      borderBottomColor: Colors.black90,
      borderBottomWidth: 1,
    },
  });

  const [index, setIndex] = React.useState(0);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled={true}
      tabStyle={styles.tabStyle}
      indicatorStyle={{
        backgroundColor: Colors.white100,
        height: 1,
      }}
      navigationState={{index, routes}}
      activeColor={Colors.white100}
      inactiveColor={Colors.black20}
      style={styles.tabBar}
      labelStyle={s.textB1Medium}
      onTabPress={value => {
        const onClick = get(value, ['route', 'onClick']);

        if (onClick) {
          onClick();
        }
      }}
    />
  );

  const renderScene = ({route}: any) => {
    return data.find(obj => obj.key == route.key)!.content;
  };

  const [routes] = React.useState(data);

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        swipeEnabled={false}
      />
    </View>
  );
}
