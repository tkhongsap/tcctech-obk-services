const { afterEach } = require("node:test");

const { signUpActionSuites } = require("./action_suites");
const { signUpUser, signInUserWith2fa } = require("../mock/mock_data");

const AccountDb = require("../database/ob-iam/account_db");
const OtpDb = require("../database/ob-iam/otp_db");

const signUpInfo = {
  email: "testkaaa@gmail.com",
  password: "12345678",
  otp: "000000",
  gender: "gender-male-id",
  firstName: "E2eFirstname",
  middleName: "E2eMiddlename",
  lastName: "E2eLastname",
  phone: "0812345678",
};

const signUp2FAErrorCase = {
  phoneEmpty: async () => {
    await expect(element(by.text("What is your phone number?"))).toBeVisible();
    await element(by.text("Continue")).tap();
  },

  phoneExist: async (phone) => {
    await expect(element(by.text("What is your phone number?"))).toBeVisible();
    await element(by.id("setup-2fa-phone-field")).tap();
    await element(by.id("setup-2fa-phone-field")).typeText(phone);
    await element(by.text("Continue")).tap();
  },
};

describe("Sign up", () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: { notifications: "YES", location: "always" },
    });
  });

  beforeEach(async () => {
    const accountDb = new AccountDb();
    const otpDb = new OtpDb();

    await accountDb.deleteAccount(signUpUser.email);
    await otpDb.deleteOtp(signUpUser.email);
    await device.reloadReactNative();
  });

  afterAll(async () => {
    const db = new AccountDb();
    await db.deleteAccount(signUpUser.email);
    await device.reloadReactNative();
  });

  it("should display phone for 2fa and if continue when is empty will show error", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpUser.email);
    await signUpActionSuites.confirmPasswordScreen(signUpUser.password);
    await signUpActionSuites.otpScreen(signUpUser.otp);
    await signUpActionSuites.successfulScreen();
    await signUpActionSuites.genderScreen(signUpUser.gender);
    await signUpActionSuites.firstNameScreen(signUpUser.firstName);
    await signUpActionSuites.middleNameScreen(signUpUser.middleName);
    await signUpActionSuites.lastNameScreen(signUpUser.lastName);
    await signUpActionSuites.dobScreen();
    await signUpActionSuites.endSignUpWith2FA();
    await signUp2FAErrorCase.phoneEmpty();
    await expect(
      element(by.text("Please, type your phone number"))
    ).toBeVisible();
  });

  it("should display phone for 2fa and if continue when phone number exist show error", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpUser.email);
    await signUpActionSuites.confirmPasswordScreen(signUpUser.password);
    await signUpActionSuites.otpScreen(signUpUser.otp);
    await signUpActionSuites.successfulScreen();
    await signUpActionSuites.genderScreen(signUpUser.gender);
    await signUpActionSuites.firstNameScreen(signUpUser.firstName);
    await signUpActionSuites.middleNameScreen(signUpUser.middleName);
    await signUpActionSuites.lastNameScreen(signUpUser.lastName);
    await signUpActionSuites.dobScreen();
    await signUpActionSuites.endSignUpWith2FA();
    await signUp2FAErrorCase.phoneExist(signInUserWith2fa.phone);
    await expect(
      element(by.text("This phone number is already registered"))
    ).toBeVisible();
  });
});

module.exports = {
  signUp2FAErrorCase,
  signUpInfo,
};
