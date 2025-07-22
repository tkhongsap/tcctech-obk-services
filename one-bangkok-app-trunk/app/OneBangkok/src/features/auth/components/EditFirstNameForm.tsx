import React from 'react';
import {View} from 'react-native';
import {Spacing} from '~/components/atoms';
import {TextInput} from '~/components/molecules/TextInput';
import t from '~/utils/text';
import {useFormContext} from 'react-hook-form';
import {TextValidations} from '~/utils/validation';
import {editInfoStateAction} from '../store/editInfoStore';
import {HeadText} from '~/components/molecules';

const EditFirstNameForm = ({currentStep}: {currentStep: number}) => {
  const {clearErrors, watch} = useFormContext();

  return (
    <View>
      <HeadText
        tagline={t('General__Create_new_account', 'Create new account')}
        title={t(
          'Signup__Personal_first_name__Header',
          'What is your first name?',
        )}
        description={t(
          'Signup__Personal_middle_name__Caption',
          'We will use this information to identify and personalise the communication with you.',
        )}
        descriptionSpacing={16}
        taglineWeight="bold"
      />
      <Spacing height={24} />
      <TextInput
        testID="first-name-id"
        placeholder={t('General__Your_first_name', 'Your first name')}
        name="firstName"
        onFocus={() => clearErrors('firstName')}
        persistentValue={true}
        rules={{
          onChange: () => {
            editInfoStateAction.updateFirstName(watch('firstName'));
          },
          required: t(
            'General__First_name_error_2',
            'Please type in your first name',
          ),
          validate: value => {
            if (currentStep === 1) {
              if (TextValidations(value)) {
                return t(
                  'General__First_name_error_3',
                  'First name must not contain special character',
                );
              }
            }
          },
        }}
      />
    </View>
  );
};

export default EditFirstNameForm;
