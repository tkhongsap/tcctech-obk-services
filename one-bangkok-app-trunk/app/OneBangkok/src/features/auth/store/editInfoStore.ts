import {hookstate, useHookstate} from '@hookstate/core';
import {Profile} from '~/models/Profile';
import {accountState} from '~/states/account/accountState';

interface EditInfoStateDTO {
  showDatePicker: boolean;
  isFocusing: boolean;
  dateOfBirth: Date | null;
  gender: 'male' | 'female' | 'nonbinary' | 'prefernottosay' | null | undefined;
  firstName: string | null | undefined;
  middleName: string | null | undefined;
  lastName: string | null | undefined;
  dateOfBirtheError: string;
}

const DEFAULT_STATE = {
  showDatePicker: false,
  isFocusing: false,
  dateOfBirth: null,
  gender: null,
  firstName: null,
  middleName: null,
  lastName: null,
  dateOfBirtheError: '',
};

const editInfoState = hookstate<EditInfoStateDTO>(DEFAULT_STATE);

const useEditInfoState = () => useHookstate(editInfoState);

const editInfoStateAction = {
  updateSelectedGender: (
    gender: 'male' | 'female' | 'nonbinary' | 'prefernottosay',
  ) => {
    editInfoState.gender.set(gender);
  },
  openDatePicker: () => editInfoState.showDatePicker.set(true),
  hideDatePicker: () => editInfoState.showDatePicker.set(false),
  updateDateOfBirth: (value: Date | null) =>
    editInfoState.dateOfBirth.set(value),
  updateFirstName: (value: string) => editInfoState.firstName.set(value),
  updateMiddleName: (value: string) => editInfoState.middleName.set(value),
  updateLastName: (value: string) => editInfoState.lastName.set(value),
  resetAndApplyDefaultValue: () => {
    editInfoState.set(value => {
      value.showDatePicker = false;
      value.isFocusing = false;
      if (accountState.profile.value?.dob != null) {
        value.dateOfBirth = new Date(accountState.profile.value.dob);
      }
      value.gender = accountState.profile.value?.gender;
      value.firstName = accountState.profile.value?.first_name;
      value.middleName = accountState.profile.value?.middle_name;
      value.lastName = accountState.profile.value?.last_name;
      return value;
    });
  },
  validateDateOfBirthError: () => {
    const [isValid, errors] = new Profile({
      dob: editInfoState.dateOfBirth.value,
    }).validateDOB();

    if (!isValid) {
      editInfoState.dateOfBirtheError.set(errors.dob?.messages[0] as string);
    }

    return isValid;
  },
  clearValue: () => {
    editInfoState.set(value => {
      value.showDatePicker = false;
      value.isFocusing = false;
      value.dateOfBirth = new Date();
      value.gender = null;
      value.firstName = '';
      value.middleName = '';
      value.lastName = '';
      return value;
    });
  },
};

export {editInfoState, editInfoStateAction, useEditInfoState};
