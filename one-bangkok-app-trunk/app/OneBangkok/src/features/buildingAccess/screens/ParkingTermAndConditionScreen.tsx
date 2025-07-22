import {Pressable, ScrollView, View} from 'react-native';
import React from 'react';
import {isEmpty} from 'lodash';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/navigations/AppNavigation';
import {Text} from '~/components/atoms';
import Markdown from 'react-native-marked';
import {Screen} from '~/components/templates';
import {Header} from '~/components/molecules';
import t from '~/utils/text';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ParkingTermAndConditionScreen'
>;
const ParkingTermAndConditionScreen = ({
  route: {
    params: {documentDetailData},
  },
}: Props) => {
  return (
    <Screen>
      <Header
        leftAction="goBack"
        title={t('General__Smart_parking', 'Smart Parking')}
      />
      <ScrollView className="w-full px-5">
        <Pressable>
          {!isEmpty(documentDetailData) && (
            <View>
              <Text className={'leading-[30.8px]'} weight="medium" size="H2">
                {documentDetailData.document.title}
              </Text>
              <Markdown
                flatListProps={{scrollEnabled: false}}
                value={documentDetailData.document.body}
                styles={{text: {fontFamily: 'OneBangkok-Regular'}}}
              />
            </View>
          )}
        </Pressable>
      </ScrollView>
    </Screen>
  );
};

export default ParkingTermAndConditionScreen;
