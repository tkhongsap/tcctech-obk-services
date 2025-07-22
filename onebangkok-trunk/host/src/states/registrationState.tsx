import {hookstate} from '@hookstate/core';
import SignInTypes from '../constants/SignInTypes';

const registrationState = hookstate({
  type: SignInTypes.Email,
  email: '',
  areaCode: '+66',
  phone: '',
  gender: '',
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
});

export default registrationState;
