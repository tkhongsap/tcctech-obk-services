const user = {
  email: "e2e-test3@mail.com",
  phone: "0812345678",
  countryCode: "+66",
  password: "12345678",
  firstName: "E2eFirstname",
  otp: "000000",
  middleName: "",
  lastName: "E2eLastname",
  genderSelectedId: "gender-male-id",
};

const signUpUser = {
  email: "temp-e2e-test@mail.com",
  password: "12345678",
  countryCode: "+66",
  phone: "08181818181",
  firstName: "E2eFirstname",
  otp: "000000",
  middleName: "",
  lastName: "E2eLastname",
  genderSelectedId: "gender-male-id",
  gender: "gender-male-id",
};

const signUpEmailInfo = {
  email: "temp-e2e-test3@mail.com",
  password: "12345678",
  otp: "000000",
  gender: "gender-male-id",
  firstName: "E2eFirstname",
  middleName: "E2eMiddlename",
  lastName: "E2eLastname",
};
const signInUserWithout2fa = {
  email: "e2e-test@mail.com",
  password: "12345678",
  firstName: "E2eFirstname",
  middleName: "",
  lastName: "E2eLastname",
  genderSelectedId: "gender-male-id",
  countryCode: "+66",
  phone: "0818181818111",
  otp: "000000",
};

const signInUserWith2fa = {
  email: "e2e-test2@mail.com",
  password: "12345678",
  firstName: "E2eFirstname",
  middleName: "",
  lastName: "E2eLastname",
  genderSelectedId: "gender-male-id",
  countryCode: "+66",
  phone: "0818181818112",
  otp: "000000",
  wrongFormatEmail: "e2e-test",
  wrongPassword: "87654321",
  wrongOtp: "888888",
};

module.exports = {
  user,
  signUpUser,
  signUpEmailInfo,
  signInUserWithout2fa,
  signInUserWith2fa,
};
