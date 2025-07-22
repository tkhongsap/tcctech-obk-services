/* eslint-disable no-extend-native */
import 'react';

declare global {
  interface String {
    isEmail(): boolean;
    isPhone(): boolean;
    isPhoneNumberWithCC(): boolean;
  }
}

String.prototype.isEmail = function () {
  let reg = /^\w+([.-]?\w+)+(\+?\d?)*@\w+([.-]?\w+)*(\.\w\w+)+$/;
  return reg.test(this.toString());
};

String.prototype.isPhone = function () {
  let reg = /^[0-9]*$/;
  return reg.test(this.toString());
};

String.prototype.isPhoneNumberWithCC = function () {
  let reg = /^[+]{1}[0-9]*$/;
  return reg.test(this.toString());
};
