import React, {useEffect, useState} from 'react';

import faqAction from '~/states/setting/faq/faqAction';
import {Header} from '~/components/molecules/Header';
import {Pressable, ScrollView} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/navigations/AppNavigation';
import {DocumentDetailData} from '~/utils/ob_sdk/services/ob_document/index.interface';
import {Screen} from '~/components/templates/Screen';
import Markdown from 'react-native-marked';
import t from '~/utils/text';
import appLanguageState from '~/states/appLanguage/appLanguageState';

type Props = NativeStackScreenProps<RootStackParamList, 'LegalScreen'>;

export const legalTypes = {
  AboutUs: 'setting-legal-about-us',
  PPC: 'setting-legal-pp',
  TnC: 'setting-legal-tnc',
  PDPA: 'setting-legal-pdpa',
};

export type LegalType = keyof typeof legalTypes;

const LegalScreen = ({
  route: {
    params: {title, type},
  },
}: Props) => {
  const [content, setContent] = useState<DocumentDetailData>();
  const [loading, setLoading] = useState(true);

  const currentLanguage = appLanguageState.currentLanguage.get();

  useEffect(() => {
    const getDocument = async () => {
      if (type) {
        const document = await faqAction.getFaqDetail(
          legalTypes[type],
          currentLanguage,
        );
        if (document) {
          setContent({
            document: {
              id: document.id!,
              title: document.title! as string,
              body: document.body! as string,
            },
          });
        }
        setLoading(false);
      }
    };
    getDocument();
  }, [type, currentLanguage]);

  return (
    <Screen isLoading={loading}>
      <Header
        leftAction="goBack"
        title={t(title, 'legal')}
        rightAction={'switchLanguage'}
      />
      {content && (
        <ScrollView className="px-6 w-full">
          <Pressable>
            <Markdown
              flatListProps={{scrollEnabled: false}}
              value={content.document.body}
              styles={{text: {fontFamily: 'OneBangkok-Regular'}}}
            />
          </Pressable>
        </ScrollView>
      )}
    </Screen>
  );
};

export default LegalScreen;
