import React from 'react';
import {View} from 'react-native';
import t from '~/utils/text';
import GenderFormItem from '~/features/auth/components/GenderFormItem';
import getTheme from '~/utils/themes/themeUtils';
import {Text, Spacing} from '~/components/atoms';
import {isEmpty} from 'lodash';
import {useFormContext} from 'react-hook-form';
import {HeadText} from '~/components/molecules';

const EditGenderForm = () => {
  const {formState, setValue, clearErrors} = useFormContext();
  const GENDER = 'gender';
  const isError = !isEmpty(formState?.errors[GENDER]);

  const updateSelectedGender = (gender: string) => {
    setValue(GENDER, gender);
    clearErrors(GENDER);
  };
  return (
    <View>
      <HeadText
        tagline={t('General__Create_new_account', 'Create new account')}
        title={t('Signup__Personal_gender__Header', 'What is your gender?')}
        description={t(
          'Signup__Personal_gender__Caption',
          'This will not be visible to anyone. We use this information to improve our in-app suggestions. Feel free to skip this question if you prefer not to say.',
        )}
        descriptionSpacing={16}
        taglineWeight='bold'
      />
      <View className="h-[24px]" />
      <GenderFormItem
        type={'female'}
        testID="gender-female-id"
        onPress={() => {
          updateSelectedGender('female');
        }}
      />
      <Spacing height={12} />
      <GenderFormItem
        type={'male'}
        testID="gender-male-id"
        onPress={() => {
          updateSelectedGender('male');
        }}
      />
      <Spacing height={12} />
      <GenderFormItem
        type={'nonbinary'}
        testID="gender-nonbinary-id"
        onPress={() => {
          updateSelectedGender('nonbinary');
        }}
      />
      <Spacing height={12} />
      <GenderFormItem
        type={'prefernottosay'}
        testID="gender-prefernottosay-id"
        onPress={() => {
          updateSelectedGender('prefernottosay');
        }}
      />
      <Text className={getTheme('text-error')}>
        {isError && (formState?.errors[GENDER]?.message as string)}
      </Text>
    </View>
  );
};

export default EditGenderForm;
