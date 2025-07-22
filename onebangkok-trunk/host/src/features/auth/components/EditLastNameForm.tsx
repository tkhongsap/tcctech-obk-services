import React from 'react';
import {View} from 'react-native';
import t from '~/utils/text';
import {Spacing} from '~/components/atoms';
import {TextInput} from '~/components/molecules/TextInput';
import {TextValidations} from '~/utils/validation';
import {useFormContext} from 'react-hook-form';
import {editInfoStateAction} from '../store/editInfoStore';
import {HeadText} from '~/components/molecules';

const EditLastNameForm = ({currentStep}: {currentStep: number}) => {
  const {clearErrors, watch} = useFormContext();

  return (
    <View>
      <HeadText
        tagline={t('General__Create_new_account', 'Create new account')}
        title={t(
          'Signup__Personal_last_name__Header',
          'What is your last name?',
        )}
        description={t(
          'Signup__Personal_middle_name__Caption',
          'We will use this information to identify and personalise the communication with you.',
        )}
        descriptionSpacing={16}
        taglineWeight='bold'
      />
      <Spacing height={24} />
      <TextInput
        testID="last-name-id"
        placeholder={t('General__Your_last_name', 'your last name')}
        name="lastName"
        onFocus={() => clearErrors('lastName')}
        persistentValue={true}
        rules={{
          onChange: () => {
            editInfoStateAction.updateLastName(watch('lastName'));
          },
          required: t(
            'General__Last_name_error_1',
            'Please type in your last name',
          ),
          validate: (value: string) => {
            if (currentStep === 3) {
              if (TextValidations(value)) {
                return t(
                  'General__Last_name_error_2',
                  'Last name must not contain special character',
                );
              }
            }
          },
        }}
      />
    </View>
  );
};

export default EditLastNameForm;
