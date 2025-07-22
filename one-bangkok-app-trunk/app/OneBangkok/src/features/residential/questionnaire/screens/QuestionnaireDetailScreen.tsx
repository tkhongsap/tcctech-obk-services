import {Image, ScrollView, View} from 'react-native';
import {ScreenContainer} from '~/features/residential/components';
import {Header} from '~/features/residential/components/Header';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/navigations/AppNavigation';
import QuestionnaireAnswerShortAnswer from '../components/QuestionnaireAnswerShortAnswer';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {Spacing, Text} from '~/components/atoms';
import DatetimeParser from '../../utils/reformatter/datetime';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import dayjs from 'dayjs';
import t from '~/utils/text';
import QuestionnaireAnswerParagraph from '../components/QuestionnaireAnswerParagraph';
import QuestionnaireAnswerSingleSelection from '../components/QuestionnaireAnswerSingleSelection';
import QuestionnaireAnswerMultiSelection from '../components/QuestionnaireAnswerMultiSelection';
import QuestionnaireAnswerImages from '../components/QuestionnaireAnswerImages';

export type TQuestionnaire = {
  id: string;
  orgId: string;
  title: string;
  description: string;
  bannerImage: TQuestionnaireInlineImage;
  fromDate: string;
  toDate: string;
  duration: string;
  durationUnit: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
  status: number;
  sections: TQuestionnaireSection[];
};
export enum QuestionnaireQuestionType {
  SHORT_ANSWER = 1,
  PARAGRAPH = 2,
  SINGLE_SELECTION = 3,
  MULTIPLE_SELECTION = 4,
  IMAGE = 5,
}
type TQuestionnaireAnswer = {
  questionId: number;
  answer: string | null;
  selectedOptionId: number | null;
};
export type TQuestionnaireOption = {
  id: number;
  orgId: number;
  seqNo: number;
  questionId: number;
  questionnaireId: number;
  text: string;
  otherOption: boolean;
  createdBy: number;
  createdAt: number;
  updatedAt: number;
  updatedBy: number;
};
export type TQuestionnaireImage = {
  id: number;
  orgId: number;
  tenantId: number;
  questionId: number;
  questionnaireId: number;
  url: string;
  createdAt: number;
  createdBy: string;
  updatedAt: number;
  updatedBy: string;
};
export type TQuestionnaireQuestion = {
  id: number;
  orgId: number;
  seqNo: number;
  questionnaireId: number;
  type: QuestionnaireQuestionType;
  allowImageUpload: boolean;
  allowFileUpload: boolean;
  required: boolean;
  createdBy: number;
  createdAt: number;
  updatedAt: number;
  updatedBy: number;
  isDeleted: boolean;
  sectionId: number;
  question: string;
  minLength: number;
  maxLength: number;
  questionTypeName: string;
  options: TQuestionnaireOption[];
  answers: TQuestionnaireAnswer[];
  images: TQuestionnaireImage[];
  files: any[];
};

export type TQuestionnaireSection = {
  id: number;
  orgId: number;
  seqNo: number;
  questionnaireId: number;
  createdBy: number;
  createdAt: number;
  updatedAt: number;
  updatedBy: number;
  isDeleted: boolean;
  title: string;
  inlineImage: TQuestionnaireInlineImage;
  questions: TQuestionnaireQuestion[];
};
export type TQuestionnaireDetail = TQuestionnaire & {
  alreadySubmitted: boolean;
  submittedAt: string;
  sections: TQuestionnaireSection[];
};

export type TQuestionnaireInlineImage = {
  id: number;
  entityId: number;
  entityType: string;
  s3Url: string;
  title: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
  orgId: number;
  s3Path: string;
  record_id: string;
  source_rid: string;
  refImageUrl: string;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'QuestionnaireDetailScreen'
>;

const QuestionnaireDetailScreen = ({route: {params}}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [questionnaire, setQuestionnaire] = useState<TQuestionnaire>();
  const [aspectRatio, setAspectRatio] = useState(1);
  const [loadImageError, setLoadImageError] = useState(false);

  useEffect(() => {
    preload(params.questionnaire.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const preload = async (questionnaireId: string) => {
    try {
      setIsLoading(true);
      await getQuestionnaire(questionnaireId);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestionnaire = async (id: string) => {
    const {data} = await serviceMindService.questionnaireDetail(id);
    const questionnaireDetail = {
      ...data.data,
      sections: (data.data.sections || []).filter(
        (section: any) => !section.isDeleted,
      ),
    } as TQuestionnaire;
    if (
      questionnaireDetail?.bannerImage &&
      questionnaireDetail.bannerImage !== null &&
      questionnaireDetail.bannerImage.s3Url &&
      questionnaireDetail.bannerImage.s3Url !== ''
    ) {
      Image.getSize(
        questionnaireDetail.bannerImage.s3Url,
        (width, height) => {
          setAspectRatio(width / height);
        },
        _ => {
          setLoadImageError(true);
        },
      );
    }
    setQuestionnaire(questionnaireDetail);
  };

  const DateAvailable = (date: {from: number; to: number}) => {
    if (!date.from || !date.to) {
      return;
    }
    const language =
      appLanguageState.currentLanguage.get() ||
      appLanguageState.defaultLanguage.get();
    const start = dayjs(date.from);
    const end = dayjs(date.to);
    const isSameDay = start.isSame(end, 'day');
    const isSameMonth = start.isSame(end, 'month');
    const isSameYear = start.isSame(end, 'year');
    let dateString = '';

    if (isSameDay) {
      dateString = DatetimeParser.toDMY({
        language,
        timestamp: start.valueOf(),
      });
    } else if (!isSameMonth) {
      dateString = `${DatetimeParser.toDMY({
        language,
        timestamp: start.valueOf(),
      })} - ${DatetimeParser.toDMY({
        language,
        timestamp: end.valueOf(),
      })}`;
    } else if (!isSameYear) {
      dateString = `${start
        .locale(language)
        .format('DD MMMM')} - ${DatetimeParser.toDMY({
        language,
        timestamp: end.valueOf(),
      })}`;
    } else {
      dateString = `${start
        .locale(language)
        .format('DD')} - ${DatetimeParser.toDMY({
        language,
        timestamp: end.valueOf(),
      })}`;
    }

    return dateString;
  };

  return (
    <ScreenContainer
      bgColor="#ffffff"
      barStyle="dark-content"
      isLoading={isLoading}>
      <Header
        leftAction="goBack"
        title={t('Residential_Questionnaire', 'Questionnaire')}
        bgColor="bg-white"
        titleColor="dark-gray"
        // leftColor="#292929"
      />
      <Spacing height={24} />
      <View className="w-full flex-1 bg-white">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="pb-5">
            <View className="px-5">
              <View>
                <Text
                  weight="medium"
                  color="default"
                  size="H3"
                  className="max-w-[310px]">
                  {params.questionnaire.title}
                </Text>
                <Text
                  weight="medium"
                  color="subtitle-muted"
                  size="B2"
                  className="max-w-[280px]">
                  {DateAvailable({
                    from: Number(params.questionnaire.fromDate),
                    to: Number(params.questionnaire.toDate),
                  })}
                </Text>
                {/* {questionnaire?.bannerImage !== null &&
                  !loadImageError &&
                  !!questionnaire?.bannerImage?.s3Url && // <-- Add this check
                  questionnaire?.bannerImage?.s3Url !== '' && (
                    <Fragment key={questionnaire?.bannerImage.id}>
                      <Spacing height={24} />
                      <Image
                        source={{uri: questionnaire?.bannerImage.s3Url}}
                        style={{width: '100%', aspectRatio}}
                        resizeMethod="scale"
                        resizeMode="cover"
                      />
                    </Fragment>
                  )} */}
              </View>
            </View>
          </View>
          <View className="flex flex-col p-4 h-full">
            {questionnaire?.sections?.map(
              (section, index) =>
                index >= 0 && (
                  <View
                    className="border border-line-light mb-[12px]"
                    key={section.id}>
                    <Text
                      weight="medium"
                      color="default"
                      size="B1"
                      className="p-4 max-w-[310px]">
                      {section.title}
                    </Text>
                    {section.questions !== null &&
                      section.questions.map(question => {
                        switch (question.type) {
                          case QuestionnaireQuestionType.SHORT_ANSWER:
                            return (
                              <QuestionnaireAnswerShortAnswer
                                key={question.id}
                                question={question}
                              />
                            );
                          case QuestionnaireQuestionType.PARAGRAPH:
                            return (
                              <QuestionnaireAnswerParagraph
                                key={question.id}
                                question={question}
                              />
                            );
                          case QuestionnaireQuestionType.SINGLE_SELECTION:
                            return (
                              <QuestionnaireAnswerSingleSelection
                                key={question.id}
                                question={question}
                              />
                            );
                          case QuestionnaireQuestionType.MULTIPLE_SELECTION:
                            return (
                              <QuestionnaireAnswerMultiSelection
                                key={question.id}
                                question={question}
                              />
                            );
                          case QuestionnaireQuestionType.IMAGE:
                            return (
                              <QuestionnaireAnswerImages
                                key={question.id}
                                question={question}
                              />
                            );
                          default:
                            return null;
                        }
                      })}
                  </View>
                ),
            )}
            <Spacing height={80} />
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
};

export default QuestionnaireDetailScreen;
