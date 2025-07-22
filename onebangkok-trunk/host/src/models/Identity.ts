import {get, isEmpty} from 'lodash';

import t from '~/utils/text';

import {Base, ValidationResult} from './base';
import {combineNumberWithCC} from '~/utils/identifier';
import * as OB_IAM_SDK from 'ob-iam-sdk';

interface IdentityAttribute {
  identifier: string;
  provider: string;
  countryCode?: string;
}

interface IdentityValidationResult extends ValidationResult<Identity> {}

export class Identity extends Base<IdentityAttribute> {
  identifier: string;
  provider: string;
  countryCode?: string;

  constructor(attrs: IdentityAttribute) {
    super();

    this.identifier = attrs.identifier;
    this.provider = attrs.provider;
  }

  // note: `isOpposite` to true will check for the opposite of the default condition for uniqueness validation logic in different scenarios.
  async validateEmail(
    withUniqueness: boolean = true,
    isOpposite: boolean = true,
  ): Promise<IdentityValidationResult> {
    this.resetErrors();
    this.validateEmailIsEmpty();
    this.validateEmailFormat();
    this.isValid &&
      withUniqueness &&
      (await this.validateEmailUniqueness(isOpposite));

    return [this.isValid, this.errors];
  }

  validateEmailFormat(): IdentityValidationResult {
    if (!this.identifier.isEmail()) {
      this.addError(
        'identifier',
        t('General__Complete_email', 'Please complete your email'),
      );
    }

    return [this.isValid, this.errors];
  }

  async validateEmailUniqueness(
    isOpposite: boolean,
  ): Promise<IdentityValidationResult> {
    const res = await OB_IAM_SDK.client.identityValidate(
      this.identifier.toLocaleLowerCase(),
      'email',
    );

    const errorCode = get(res, ['data', 'error', 'code']);
    if (errorCode && isOpposite) {
      this.addError('identifier', errorCode);
    }

    const emailExists = get(res, ['data', 'data', 'result']);

    if (isOpposite && emailExists) {
      this.addError(
        'identifier',
        t('General__Email_registered', 'This email is already registered'),
      );
    } else if (!isOpposite && !emailExists) {
      this.addError(
        'identifier',
        t(
          'Reset_password__Reset_password_email__Supporting_text',
          'Email not found',
        ),
      );
    }

    return [this.isValid, this.errors];
  }

  async validatePhone(
    withUniqueness: boolean = true,
    isOpposite: boolean = true,
    countryCode: string = '+66',
  ): Promise<IdentityValidationResult> {
    this.resetErrors();
    this.validatePhoneIsEmpty(countryCode);
    this.validatePhoneFormat();
    this.isValid &&
      withUniqueness &&
      (await this.validatePhoneUniqueness(isOpposite, countryCode));

    return [this.isValid, this.errors];
  }

  validatePhoneFormat(): IdentityValidationResult {
    if (
      combineNumberWithCC(
        this.countryCode!,
        this.identifier,
      ).isPhoneNumberWithCC()
    ) {
      this.addError(
        'identifier',
        t('General__Type_phone_number', 'Please, type your phone number'),
      );
    }
    return [this.isValid, this.errors];
  }

  async validatePhoneUniqueness(
    isOpposite: boolean,
    countryCode: string,
  ): Promise<IdentityValidationResult> {
    const res = await OB_IAM_SDK.client.identityValidate(
      this.identifier,
      'phone',
      countryCode,
    );

    const errorCode = get(res, ['data', 'error', 'code']);
    if (errorCode && isOpposite) {
      this.addError('identifier', errorCode);
    }

    const phoneExists = get(res, 'data.data.result');
    if (isOpposite && phoneExists) {
      this.addError(
        'identifier',
        t(
          'General__Phone_registered',
          'This phone number is already registered',
        ),
      );
    } else if (!isOpposite && !phoneExists) {
      this.addError(
        'identifier',
        t(
          'Reset_password__Reset_password_phone__Supporting_text',
          'Phone number not found',
        ),
      );
    }

    return [this.isValid, this.errors];
  }

  validatePhoneIsEmpty(contryCode = '+66'): IdentityValidationResult {
    const phoneNumbeWihtoutCC = this.identifier.replace(contryCode, '');

    if (isEmpty(phoneNumbeWihtoutCC)) {
      this.addError(
        'identifier',
        t('General__Type_phone_number', 'Please, type your phone number'),
      );
    }

    return [this.isValid, this.errors];
  }
  validateEmailIsEmpty(): IdentityValidationResult {
    if (isEmpty(this.identifier)) {
      this.addError(
        'identifier',
        t('General__Type_email', 'Please, type in your email'),
      );
    }
    return [this.isValid, this.errors];
  }
}
