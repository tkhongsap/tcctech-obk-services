import t from '~/utils/text';

import {Base, ValidationResult} from './base';
import {TextValidation} from '~/utils/validation';

interface ProfileAttribute {
  gender?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dob?: Date | null;
}

export class Profile extends Base<ProfileAttribute> {
  gender?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dob?: Date | null;

  constructor(attrs: ProfileAttribute) {
    super();

    this.gender = attrs.gender;
    this.firstName = attrs.firstName;
    this.middleName = attrs.middleName;
    this.lastName = attrs.lastName;
    this.dob = attrs.dob;
  }

  validateFirstName = (): ValidationResult<Profile> => {
    if (TextValidation.isEmpty(this?.firstName)) {
      this.addError(
        'firstName',
        t('General__First_name_error_2', 'Please type in your first name'),
      );
    }

    if (TextValidation.hasSpecialCharacter(this?.firstName)) {
      this.addError(
        'firstName',
        t(
          'General__First_name_error_3',
          'First name must not contain special character',
        ),
      );
    }

    return [this.isValid, this.errors];
  };

  validateMiddleName = (): ValidationResult<Profile> => {
    if (TextValidation.isEmpty(this?.middleName)) {
      this.addError(
        'middleName',
        t('General__Middle_name_error_2', 'Please, type in your middle name'),
      );
    }

    if (TextValidation.hasSpecialCharacter(this?.middleName)) {
      this.addError(
        'middleName',
        t(
          'General__Middle_name_error_1',
          'Middle name must not contain special character',
        ),
      );
    }

    return [this.isValid, this.errors];
  };

  validateLastName = (): ValidationResult<Profile> => {
    if (TextValidation.isEmpty(this?.lastName)) {
      this.addError(
        'lastName',
        t('General__Last_name_error_1', 'Please type in your last name'),
      );
    }

    if (TextValidation.hasSpecialCharacter(this?.lastName)) {
      this.addError(
        'lastName',
        t(
          'General__Last_name_error_2',
          'Last name must not contain special character',
        ),
      );
    }

    return [this.isValid, this.errors];
  };
  validateDOB = (): ValidationResult<Profile> => {
    if (!this?.dob) {
      this.addError(
        'dob',
        t('General__Dob_error_1', 'Please select your date of birth'),
      );
    }

    return [this.isValid, this.errors];
  };
}
