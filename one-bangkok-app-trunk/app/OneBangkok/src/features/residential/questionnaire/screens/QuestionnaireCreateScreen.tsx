import {Dimensions, ScrollView, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import DynamicStepContainers from '~/components/DynamicStepContainer';
import t from '~/utils/text';
import {ScreenContainer} from '~/components/templates';
import {Header} from '../../components/Header';
import {StickyButton} from '../../components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {
  QuestionnaireQuestionType,
  TQuestionnaire,
  // TQuestionnaireDetail,
} from './QuestionnaireDetailScreen';
import QuestionShortAnswer from '../components/QuestionShortAnswer';
import QuestionImageRender from '../components/QuestionImageRender';
import QuestionParagraph from '../components/QuestionParagraph';
import QuestionSingleSelection, {
  TCustomQuestionnaireOption,
} from '../components/QuestionSingleSelection';
import QuestionMultipleSelection, {
  TCustomQuestionnaireMultipleOption,
} from '../components/QuestionMultipleSelection';
import QuestionImage from '../components/QuestionImage';
import {FormProvider, useForm} from 'react-hook-form';
import {HeadText} from '~/components/molecules';
import {Spacing} from '~/components/atoms';
import {useModal} from '../../components/ResidentialModal';
import QuestionnaireConfirmAnswerModal from '../components/QuestionnaireConfirmAnswerModal';
import {StackActions} from '@react-navigation/native';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import {set} from 'lodash';

type TQuestionnaireOptionAnswer = {
  shortAnswer: string;
  paragraph: string;
  singleOptions: TCustomQuestionnaireOption[];
  multiOptions: TCustomQuestionnaireMultipleOption[];
  images: string[];
};
type TQuestionRecords = Record<number, TQuestionnaireOptionAnswer>;
type TQuestionnaireSubmitSelectedOption = {
  optionId: number;
  answer: string;
};
export type TQuestionnaireSubmitQuestion = {
  questionId: number;
  answer: string | null;
  selectedOptionIds: TQuestionnaireSubmitSelectedOption[] | number | null;
  images: string[];
  files: string[];
};
export type TQuestionnaireSubmit = {
  tenantId: string;
  questionnaireId: number;
  sections: {
    sectionId: number;
    questions: TQuestionnaireSubmitQuestion[];
  }[];
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'QuestionnaireCreateScreen'
>;

const defaultModel = {
  shortAnswer: '',
  paragraph: '',
  singleSelection: undefined,
  multiOptions: [],
  images: ['', ''],
};
const QuestionnaireCreateScreen = ({route: {params}}: Props) => {
  const navigation = useNavigation();
  const {...methods} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldUnregister: true,
  });
  const [_, modalActions] = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [questionnaire, setQuestionnaire] = useState<TQuestionnaire>();
  const [step, setStep] = useState(0);
  const [model, setModel] = useState<TQuestionRecords>();
  const [validationError, setValidationError] = useState<Object | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [bottomPadding, setBottomPadding] = useState(0);

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
    try {
      const {data} = await serviceMindService.questionnaireDetail(id);
      const questionnaireDetail = {
        ...data.data,
        sections: (data.data.sections || []).filter(
          (section: any) => !section.isDeleted,
        ),
      } as TQuestionnaire;

      setQuestionnaire(questionnaireDetail);
      const initialModel: TQuestionRecords =
        questionnaireDetail.sections.reduce((acc, section, index) => {
          if (section.questions && section.questions.length > 0) {
            acc[index] = {
              ...defaultModel,
              singleOptions: section.questions
                .filter(
                  q => q.type === QuestionnaireQuestionType.SINGLE_SELECTION,
                )
                .flatMap(
                  q =>
                    q.options?.map(option => ({
                      ...option,
                      selected: false,
                      otherOptionValue: '',
                      questionId: q.id,
                    })) || [],
                ),
              multiOptions: section.questions
                .filter(
                  q => q.type === QuestionnaireQuestionType.MULTIPLE_SELECTION,
                )
                .flatMap(
                  q =>
                    q.options?.map(option => ({
                      ...option,
                      selected: false,
                      otherOptionValue: '',
                      questionId: q.id,
                    })) || [],
                ),
            };
          }
          return acc;
        }, {} as TQuestionRecords);
      setModel(initialModel);
    } catch (error) {
      console.error('Error fetching questionnaire:', error);
    }
  };

  const onPressLeftAction = () => {
    if (isLoading) return;
    setValidationError(null);
    if (step >= 1) {
      scrollViewRef.current?.scrollTo({x: 0, animated: true});
      setStep(prev => {
        return prev - 1;
      });
    } else navigation.goBack();
  };

  const handleFocus = () => {
    const screenHeight = Dimensions.get('window').height / 3;
    setBottomPadding(screenHeight);
  };

  const handleBlur = () => {
    setBottomPadding(0);
  };

  const validateStep = (): boolean => {
    if (!questionnaire || !model) return true;
    const section = questionnaire.sections[step];
    if (!section || !section.questions) return true;
    const errors: Record<string, any> = {};
    for (const question of section.questions) {
      if (!question.required || question.isDeleted) continue;
      switch (question.type) {
        case QuestionnaireQuestionType.SHORT_ANSWER:
          if (!model[step].shortAnswer?.trim()) {
            errors[question.id] = {
              type: QuestionnaireQuestionType.SHORT_ANSWER,
              message: t(
                'Residential__Questionnaire_Validate',
                'Please answer the question',
              ),
            };
          }
          break;
        case QuestionnaireQuestionType.PARAGRAPH:
          if (!model[step].paragraph?.trim()) {
            errors[question.id] = {
              type: QuestionnaireQuestionType.PARAGRAPH,
              message: t(
                'Residential__Questionnaire_Validate',
                'Please answer the question',
              ),
            };
          }
          break;
        case QuestionnaireQuestionType.SINGLE_SELECTION:
          if (!model[step].singleOptions?.some(opt => opt.selected)) {
            errors[question.id] = {
              type: QuestionnaireQuestionType.SINGLE_SELECTION,
              message: t(
                'Residential__Questionnaire_Validate',
                'SINGLE_SELECTION Please answer the question',
              ),
            };
          }
          break;
        case QuestionnaireQuestionType.MULTIPLE_SELECTION:
          if (!model[step].multiOptions?.some(opt => opt.selected)) {
            errors[question.id] = {
              type: QuestionnaireQuestionType.MULTIPLE_SELECTION,
              message: t(
                'Residential__Questionnaire_Validate',
                'MULTIPLE_SELECTION Please answer the question',
              ),
            };
          }
          break;
        case QuestionnaireQuestionType.IMAGE:
          if (!model[step].images?.some(img => img && img !== '')) {
            errors[question.id] = {
              type: QuestionnaireQuestionType.IMAGE,
              message: t(
                'Residential__Questionnaire_Validate_Image',
                'Please add a photo',
              ),
            };
          }
          break;
        default:
          break;
      }
    }
    if (Object.keys(errors).length > 0) {
      setValidationError(errors);
      return false;
    }
    setValidationError(null);
    return true;
  };

  const onPressSticky = async () => {
    handleBlur();
    if (!validateStep()) return;
    const stepLength = questionnaire?.sections.length ?? 0;
    if (step < stepLength - 1 && step >= 0) {
      scrollViewRef.current?.scrollTo({x: 0, animated: true});
      setStep(prev => {
        return prev + 1;
      });
    }
    if (step >= stepLength - 1) openConfirmAnswerModal();
  };

  const openConfirmAnswerModal = () => {
    modalActions.setContent(
      <QuestionnaireConfirmAnswerModal
        onPressConfirm={() => {
          modalActions.hide();
          onsubmit();
        }}
      />,
    );
    modalActions.show();
  };

  const onSetModel = (
    step: number,
    key: keyof TQuestionnaireOptionAnswer,
    value: any,
  ) => {
    setModel(prev => {
      if (!prev) return {};
      const updated = prev;
      updated[step] = {...updated[step], [key]: value};
      return updated;
    });
    setValidationError(null); // Clear validation error on any change
  };

  const onsubmit = async () => {
    try {
      setIsLoading(true);
      const tenantId = await residentialTenantAction.getTenantId();

      const {status} = await serviceMindService.questionnaireSubmit({
        tenantId: String(tenantId),
        questionnaireId: parseInt(params.questionnaire.id),
        sections: mapModelToSubmitQuestions(model ?? []),
      });
      if (status === 200) {
        navigateToSuccessScreen();
      } else {
        navigateToErrorScreen();
      }
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setIsLoading(false);
    }
  };

  const mapModelToSubmitQuestions = (
    model: TQuestionRecords,
  ): {sectionId: number; questions: TQuestionnaireSubmitQuestion[]}[] => {
    const questionnaireQuestions = questionnaire?.sections ?? [];
    return questionnaireQuestions.map((q, index) => {
      const questions = Array.isArray(q.questions)
        ? q.questions.map(question => {
            switch (question.type) {
              case QuestionnaireQuestionType.SHORT_ANSWER:
                return {
                  questionId: question.id,
                  answer: model[index].shortAnswer || null,
                  selectedOptionIds: null,
                  images: [],
                  files: [],
                };
              case QuestionnaireQuestionType.PARAGRAPH:
                return {
                  questionId: question.id,
                  answer: model[index].paragraph || null,
                  selectedOptionIds: null,
                  images: [],
                  files: [],
                };
              case QuestionnaireQuestionType.SINGLE_SELECTION:
                const selected = model[index].singleOptions.find(
                  e => e.selected,
                );
                let selectedOptionIds:
                  | TQuestionnaireSubmitSelectedOption[]
                  | number
                  | null = null;
                if (selected) {
                  if (selected.otherOption) {
                    selectedOptionIds = [
                      {
                        optionId: selected.id,
                        answer: selected.otherOptionValue,
                      },
                    ];
                  } else {
                    selectedOptionIds = [
                      {
                        optionId: selected.id,
                        answer: '',
                      },
                    ];
                  }
                }
                return {
                  questionId: question.id,
                  answer: null,
                  selectedOptionIds,
                  images: [],
                  files: [],
                };
              case QuestionnaireQuestionType.IMAGE:
                return {
                  questionId: question.id,
                  answer: null,
                  selectedOptionIds: null,
                  images: model[index].images.filter(
                    e => e !== '' && e !== undefined,
                  ),
                  files: [],
                };
              case QuestionnaireQuestionType.MULTIPLE_SELECTION:
                return {
                  questionId: question.id,
                  answer: null,
                  selectedOptionIds: model[index].multiOptions
                    .filter(e => e.selected)
                    .map(e => ({
                      optionId: e.id,
                      answer: e.otherOptionValue ?? '',
                    })),
                  images: [],
                  files: [],
                };

              default:
                return {
                  questionId: question.id,
                  answer: model[index].shortAnswer || null,
                  selectedOptionIds: null,
                  images: [],
                  files: [],
                };
            }
          })
        : [];
      return {
        sectionId: q.id,
        questions,
      };
    });
  };

  const navigateToErrorScreen = () => {
    navigation.navigate('AnnouncementResidentialScreen', {
      type: 'error',
      title: t('Residential__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Residential__Announcement__Error_generic__Body',
        'Please wait a bit before trying again',
      ),
      buttonText: t('Residential__Back_to_explore', 'Back to explore'),
      screenHook: 'QuestionnaireCreateScreen',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('ResidentialHomeScreen'),
    });
  };

  const navigateToSuccessScreen = () => {
    navigation.dispatch(
      StackActions.replace('AnnouncementResidentialScreen', {
        type: 'success',
        title: t(
          'Residential_Questionnaire_Submit_success_title',
          'Thank you for taking the \ttime to provide your \tinput',
        ),
        message: t(
          'Residential_Questionnaire_Submit_success_desc',
          'Your responses have been successfully \nsubmitted.',
        ),
        buttonText: t('Residential__Home_Automation__Done', 'Done'),
        screenHook: 'QuestionnaireHomeScreen',
        buttonColor: 'dark-teal',
        onPressBack: () => navigation.navigate('QuestionnaireHomeScreen'),
      }),
    );
  };

  return (
    <>
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
          onPressLeftAction={onPressLeftAction}
        />
        {/* {questionnaire && model && ( */}
        {questionnaire && model && (
          <View className="w-full flex-1">
            <View className="flex flex-row">
              <View className={`px-[8px] pt-4 w-full`}>
                <DynamicStepContainers
                  totalSteps={questionnaire.sections.length}
                  currentStep={step}
                  handleStepPress={setStep}
                  disabled={isLoading}
                />
              </View>
            </View>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: bottomPadding,
              }}
              ref={scrollViewRef}>
              <View className="px-4">
                <HeadText
                  titleSize="H3"
                  title={questionnaire.sections[step].title}
                  tagline={questionnaire.title}
                  taglineColor="subtitle-muted"
                  descriptionSpacing={8}
                  tagSpacing={5}
                  titleClamps="leading-[1.75]"
                />
                <Spacing height={12} />
              </View>
              {questionnaire.sections[step].inlineImage && (
                <View className="px-4 mt-6">
                  <QuestionImageRender
                    inlineImage={questionnaire.sections[step].inlineImage}
                  />
                </View>
              )}
              {questionnaire.sections[step].questions != null &&
                questionnaire.sections[step].questions.map(question => (
                  <View
                    key={question.id}
                    className="w-screen px-4 bg-[#FDFDFD]">
                    <FormProvider {...methods}>
                      <>
                        {question.type ===
                          QuestionnaireQuestionType.SHORT_ANSWER && (
                          <QuestionShortAnswer
                            question={question}
                            inlineImage={
                              questionnaire.sections[step].inlineImage
                            }
                            required={question.required}
                            validationError={validationError}
                            onFocus={() => methods.clearErrors('subject')}
                            shortAnswer={model[step].shortAnswer}
                            onShortAnswerChange={v =>
                              onSetModel(step, 'shortAnswer', v)
                            }
                          />
                        )}
                        {question.type ===
                          QuestionnaireQuestionType.PARAGRAPH && (
                          <QuestionParagraph
                            question={question}
                            onFocus={() => {
                              handleFocus();
                              methods.clearErrors('comment');
                            }}
                            onBlur={() => handleBlur()}
                            required={question.required}
                            validationError={validationError}
                            paragraph={model[step].paragraph}
                            onParagraphChange={v =>
                              onSetModel(step, 'paragraph', v)
                            }
                          />
                        )}
                        {question.type ===
                          QuestionnaireQuestionType.SINGLE_SELECTION && (
                          <QuestionSingleSelection
                            question={question}
                            onFocus={() => {
                              handleFocus();
                              methods.clearErrors('otherValue');
                            }}
                            options={model[step].singleOptions}
                            onOptionsChange={v =>
                              onSetModel(step, 'singleOptions', v)
                            }
                            onBlur={() => handleBlur()}
                            required={question.required}
                            validationError={validationError}
                          />
                        )}
                        {question.type ===
                          QuestionnaireQuestionType.MULTIPLE_SELECTION && (
                          <QuestionMultipleSelection
                            question={question}
                            onFocus={() => {
                              handleFocus();

                              methods.clearErrors('otherValue');
                            }}
                            options={model[step].multiOptions}
                            required={question.required}
                            onOptionsChange={v =>
                              onSetModel(step, 'multiOptions', v)
                            }
                            onBlur={() => handleBlur()}
                            validationError={validationError}
                          />
                        )}
                        {question.type === QuestionnaireQuestionType.IMAGE && (
                          <QuestionImage
                            question={question}
                            onFocus={() => methods.clearErrors('subject')}
                            images={model[step].images}
                            required={question.required}
                            validationError={validationError}
                            onImagesChange={v => onSetModel(step, 'images', v)}
                          />
                        )}
                      </>
                    </FormProvider>
                  </View>
                ))}
              <Spacing height={132} />
            </ScrollView>
          </View>
        )}
      </ScreenContainer>
      {validationError && (
        <View style={{paddingHorizontal: 16, paddingTop: 8}}>
          <HeadText titleSize="H6" titleColor="error" />
        </View>
      )}
      <StickyButton
        title={t('Residential_Questionnaire_Next', 'Next')}
        className="bg-dark-teal-dark"
        rightIcon="next"
        iconHeight={20}
        iconWidth={20}
        disabled={isLoading}
        onPress={methods.handleSubmit(onPressSticky)}
      />
    </>
  );
};

export default QuestionnaireCreateScreen;
