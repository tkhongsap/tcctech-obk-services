import React from 'react';
import t from '~/utils/text';

import {Pressable, ScrollView, StyleSheet} from 'react-native';
import {Spacing} from '~/components/atoms';
import {TextInput} from '~/components/molecules/TextInput';
import {Colors} from '~/constants/Colors';
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';
import {HeadText, StickyButton} from '~/components/molecules';
import {
  createRequestServiceAction,
  useCreateRequestServiceState,
} from '../store/requestService';

interface CreateRSSecondPageProps {
  onNextStep: Function;
}

const CreateRSSecondPage = ({onNextStep}: CreateRSSecondPageProps) => {
  const {title, description} = useCreateRequestServiceState();

  const {...methods} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      title: title.value,
      description: description.value,
    },
  });
  const handleOnPress: SubmitHandler<FieldValues> = async data => {
    createRequestServiceAction.setValueRSSecondPage(
      data.title,
      data.description,
    );
    onNextStep && onNextStep();
  };

  return (
    <>
      <ScrollView className="w-screen px-4 py-8">
        <Pressable>
          <HeadText
            tagline={t('General__Description', 'Description')}
            title={t(
              'General__Issue_provide_detail',
              'Could you provide more details about the issue?',
            )}
            titleSize="H3"
            titleClamps="leading-[26.4]"
          />
          <FormProvider {...methods}>
            <Spacing height={24} />

            <TextInput
              name={'title'}
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor={Colors.black40}
              placeholder={t('General__Title', 'Title')}
              labelText={t('General__Title', 'Title')}
              onFocus={() => methods.clearErrors('title')}
              maxLength={50}
              rules={{
                required: t('General__Serivce_title_error', 'Please enter the service title'),
              }}
            />

            <Spacing height={24} />

            <TextInput
              name={'description'}
              style={{height: 205, textAlignVertical: 'top'}}
              multiline
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor={Colors.black40}
              placeholder={t('General__Description', 'Description')}
              labelText={t('General__Description', 'Description')}
              maxLength={250}
              onFocus={() => methods.clearErrors('description')}
            />

            <Spacing height={24} />
          </FormProvider>
          <Spacing height={80} />
        </Pressable>
      </ScrollView>

      <StickyButton
        title={t('General__Next', 'Next')}
        onPress={methods.handleSubmit(handleOnPress)}
        rightIcon="next"
      />
    </>
  );
};
export default CreateRSSecondPage;

const styles = StyleSheet.create({
  disable: {
    borderColor: '#EFEFEF',
    borderWidth: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 0,
    height: 48,
    textAlign: 'left',
  },
});
