import {ScrollView, StyleSheet, View, useWindowDimensions} from 'react-native';
import React, {useState} from 'react';
import t from '~/utils/text';
import {Spacing, Text} from '~/components/atoms';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {HeadText, Header, StickyButton} from '~/components/molecules';
import {useNavigation} from '~/navigations/AppNavigation';
import getTheme from '~/utils/themes/themeUtils';
import RequestServiceList from '../components/RequestServiceList';
import {Screen} from '~/components/templates';
import {HeaderImage} from '~/components/molecules/HeaderImage';
import {createRequestServiceAction} from '../store/requestService';

const RequestServiceScreen = () => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {key: 'first', title: t('General__Current', 'Current')},
    {key: 'second', title: t('General__Past', 'Past')},
  ]);

  const FirstRoute = () => <RequestServiceList setIndex={setIndex} />;

  const SecondRoute = () => (
    <RequestServiceList status="done" setIndex={setIndex} />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicatorStyle}
      style={styles.tabBar}
      activeColor="#464646"
      renderLabel={({route, focused}) => (
        <Text size="B1" color={focused ? 'default' : 'muted-400'}>
          {route.title}
        </Text>
      )}
    />
  );
  return (
    <Screen>
      <HeaderImage
        defaultImage={require('../../../assets/images/bg_request_service.png')}>
        <Header
          leftAction="goBack"
          onPressLeftAction={() => navigation.goBack()}
          bgColor={getTheme('bg-transparent')}
          leftColor={'#ffffff'}
        />
        <Spacing height={8} />
        <View className="px-5">
          <HeadText
            tagline={t('General__One_bangkok', 'One Bangkok')}
            title={t('General__Service_request', 'Service request')}
            description={t(
              'Building__service__List__Description',
              'Easily create service tickets for requesting resolution of any issue you encounter',
            )}
            titleColor="default-inverse"
            taglineColor="sky-blue"
            descriptionColor="line"
            descriptionSpacing={16}
          />
        </View>
      </HeaderImage>
      <ScrollView className="w-full" scrollEnabled={false}>
        <View className={getTheme('bg-default flex w-full px-5')}>
          <Spacing height={24} />
          <View
            className={getTheme('flex w-full')}
            style={{height: layout.height / 1.65}}>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              renderTabBar={renderTabBar}
              onIndexChange={setIndex}
              initialLayout={{width: layout.width}}
              lazy
            />
          </View>
        </View>
      </ScrollView>
      <StickyButton
        title={t('General__Create_new_ticket', 'Create new ticket')}
        rightIcon="next"
        onPress={() => {
          createRequestServiceAction.reset();
          navigation.navigate('CreateRequestServiceScreen');
        }}
      />
    </Screen>
  );
};
export default RequestServiceScreen;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    borderBlockColor: '#989898',
    borderBottomWidth: 1,
  },
  indicatorStyle: {
    backgroundColor: '#464646',
    height: 1,
  },
});
