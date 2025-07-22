import {assign} from 'lodash';

export interface ValidationErrorMessage {
  messages: string[];
}

export interface ValidationError<Attrs> {
  errors: {
    [key in keyof Attrs]?: ValidationErrorMessage;
  };
}

export type ValidationResult<T extends ValidationError<any>> = [
  isValid: boolean,
  errors: T['errors'],
];

export class Base<Attrs> {
  errors: ValidationError<Attrs>['errors'] = {};

  constructor() {}

  addError(key: keyof Attrs, message: string): void {
    if (this.errors[key]) {
      this.errors[key]?.messages.push(message);
    } else {
      assign(this.errors, {[key]: {messages: [message]}});
    }
  }

  resetErrors(): void {
    this.errors = {};
  }

  get validationResult(): ValidationResult<ValidationError<Attrs>> {
    return [this.isValid, this.errors];
  }

  get isValid(): boolean {
    return !Object.values(this.errors).some(
      // TODO: fix this any
      (error: any) => error.messages.length > 0,
    );
  }
}
