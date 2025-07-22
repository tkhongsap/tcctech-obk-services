import React, {useCallback, useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/navigations/AppNavigation';
import legalAction, {DocumentDetail} from '~/states/setting/legal/legalAction';
import {Pressable, ScrollView} from 'react-native';
import {Header} from '~/components/molecules/Header';
import {Screen} from '~/components/templates';
import Markdown from 'react-native-marked';
import t from '~/utils/text';
import appLanguageState from '~/states/appLanguage/appLanguageState';

type Props = NativeStackScreenProps<RootStackParamList, 'LegalDocumentScreen'>;

export default function LegalDocumentScreen({
  route: {
    params: {header, category},
  },
}: Props) {
  const [documentDetail, setDocumentDetail] = useState<DocumentDetail>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const currentLanguage = appLanguageState.currentLanguage.get();
  const getDocumentDetail = useCallback(async () => {
    try {
      const slug = 'legal-' + category;
      const document = await legalAction.getDocumentDetail(
        slug,
        currentLanguage,
      );
      if (document) {
        setDocumentDetail({
          id: document.id!,
          title: document.title as string,
          body: document.body as string,
        });
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log('Get document detail error: ' + err);
    }
  }, [category, currentLanguage]);

  useEffect(() => {
    getDocumentDetail();
  }, [getDocumentDetail]);

  return (
    <Screen isLoading={isLoading}>
      <Header
        leftAction="goBack"
        title={t(header, 'legal')}
        rightAction={'switchLanguage'}
      />
      {documentDetail && (
        <ScrollView className="px-6 w-full">
          <Pressable>
            <Markdown
              flatListProps={{scrollEnabled: false}}
              value={documentDetail.body}
              styles={{text: {fontFamily: 'OneBangkok-Regular'}}}
            />
          </Pressable>
        </ScrollView>
      )}
    </Screen>
  );
}
