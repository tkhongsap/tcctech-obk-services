import React from 'react';
import {View} from 'react-native';
import t from '~/utils/text';
import {
  editInfoState,
  editInfoStateAction,
  useEditInfoState,
} from '~/features/auth/store/editInfoStore';
import {Spacing} from '~/components/atoms';
import {DatePickerField, HeadText} from '~/components/molecules';
import {dayjs, Dayjs} from '~/utils/dayjs';
import {isEmpty} from 'lodash';

const EditDateOfBirthForm = () => {
  const {dateOfBirth} = editInfoState;
  const {dateOfBirtheError} = useEditInfoState();

  const handleOnChange = (date: Dayjs) => {
    editInfoStateAction.updateDateOfBirth(date.toDate());
  };

  const dateValue = dateOfBirth.value ? dayjs(dateOfBirth.value) : null;

  return (
    <View>
      <HeadText
        tagline={t('General__Create_new_account', 'Create new account')}
        title={t('Signup__Personal_dob__Header', 'When is your birthday?')}
        description={t(
          'Signup__Personal_dob__Caption',
          'We do not want to miss the chance to send you a happy birthday.',
        )}
        descriptionSpacing={16}
        taglineWeight='bold'
      />
      <Spacing height={24} />
      <DatePickerField
        testID="date-picker-id"
        value={dateValue}
        placeholder={t('General__Your_birthday', 'Your birthday')}
        onChange={handleOnChange}
        helperText={dateOfBirtheError.value}
        error={!isEmpty(dateOfBirtheError.value)}
        onPress={() => editInfoState.dateOfBirtheError.set('')}
        defaultYear={!dateValue ? 2000 : undefined}
      />
    </View>
  );
};

export default EditDateOfBirthForm;
