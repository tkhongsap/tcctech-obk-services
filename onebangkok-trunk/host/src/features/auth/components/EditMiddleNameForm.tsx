import React from 'react';
import {View} from 'react-native';
import t from '~/utils/text';
import {Spacing} from '~/components/atoms';
import {TextInput} from '~/components/molecules/TextInput';
import {TextValidations} from '~/utils/validation';
import {useFormContext} from 'react-hook-form';
import {editInfoStateAction} from '../store/editInfoStore';
import {HeadText} from '~/components/molecules';

const EditMiddleNameForm = ({currentStep}: {currentStep: number}) => {
  const {clearErrors, watch} = useFormContext();

  return (
    <View>
      <HeadText
        tagline={t('General__Create_new_account', 'Create new account')}
        title={t(
          'Signup__Personal_middle_name__Header',
          'What is your middle name?',
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
        testID="middle-name-id"
        placeholder={t('General__Your_middle_name', 'Your middle name')}
        name="middleName"
        onFocus={() => clearErrors('middleName')}
        persistentValue={true}
        rules={{
          onChange: () => {
            editInfoStateAction.updateMiddleName(watch('middleName'));
          },
          validate: (value: string) => {
            if (currentStep === 2) {
              if (TextValidations(value)) {
                return t(
                  'General__Middle_name_error_1',
                  'Middle name must not contain special character',
                );
              }
            }
          },
        }}
      />
    </View>
  );
};

export default EditMiddleNameForm;
