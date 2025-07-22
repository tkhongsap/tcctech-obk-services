import {Pressable, ScrollView, useWindowDimensions, View} from 'react-native';
import React, {useMemo} from 'react';
import {isEmpty} from 'lodash';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/navigations/AppNavigation';
import {Spacing} from '~/components/atoms';
import {Screen} from '~/components/templates';
import {Header} from '~/components/molecules';
import RenderHtml from 'react-native-render-html';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialCarParkTermAndConditionScreen'
>;
const ResidentialCarParkTermAndConditionScreen = ({
  route: {
    params: {documentDetailData},
  },
}: Props) => {
  const {width} = useWindowDimensions();

  const tagsStyles = useMemo(
    () => ({
      p: {
        color: '#292929',
        width: '100%',
        marginBottom: 0,
        lineHeight: 25,
        fontSize: 16,
      },
      h1: {
        color: '#292929',
        margin: 0,
      },
      h2: {
        color: '#292929',
        margin: 0,
      },
      h3: {
        color: '#292929',
        margin: 0,
      },
      h4: {
        color: '#292929',
        margin: 0,
      },
      h5: {
        color: '#292929',
        margin: 0,
      },
      h6: {
        color: '#292929',
        margin: 0,
      },
      li: {
        marginTop: -18.3,
      },
    }),
    [],
  );

  const defaultTextProps = {
    style: {
      fontFamily: 'OneBangkok-Regular',
    },
  };

  return (
    <Screen>
      <Header leftAction="goBack" title={documentDetailData?.document.title} />
      <ScrollView className="w-full px-5">
        <Pressable>
          {!isEmpty(documentDetailData) && (
            <View>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: documentDetailData.document.body,
                }}
                tagsStyles={tagsStyles}
                defaultTextProps={defaultTextProps}
              />
              <Spacing height={50} />
            </View>
          )}
        </Pressable>
      </ScrollView>
    </Screen>
  );
};

export default ResidentialCarParkTermAndConditionScreen;
