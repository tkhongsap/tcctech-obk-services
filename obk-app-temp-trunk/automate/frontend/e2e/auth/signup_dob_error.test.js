const { afterEach } = require("node:test");

const { signUpActionSuites } = require("./action_suites");

const { signUpEmailInfo } = require("../mock/mock_data");

const signUpDobErrorCase = {
  dobEmptyCase: async () => {
    await expect(element(by.text("When is your birthday?"))).toBeVisible();
    await element(by.text("Continue")).tap();
  },

  dobCancelContinue: async () => {
    await expect(element(by.text("When is your birthday?"))).toBeVisible();
    await element(by.id("date-picker-id")).tap();
    await element(by.id("date-picker-cancel-id")).tap();
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
    await device.reloadReactNative();
  });

  afterEach(async () => {
    await detox.cleanup();
  });

  // blank case
  it("should display an error when the dob is empty and user click continue ", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpEmailInfo.email);
    await signUpActionSuites.confirmPasswordScreen(signUpEmailInfo.password);
    await signUpActionSuites.otpScreen(signUpEmailInfo.otp);
    await signUpActionSuites.successfulScreen();
    await signUpActionSuites.genderScreen(signUpEmailInfo.gender);
    await signUpActionSuites.firstNameScreen(signUpEmailInfo.firstName);
    await signUpActionSuites.middleNameScreen(signUpEmailInfo.middleName);
    await signUpActionSuites.lastNameScreen(signUpEmailInfo.lastName);
    await signUpDobErrorCase.dobEmptyCase();
    await expect(
      element(by.text("Please select your date of birth"))
    ).toBeVisible();
  });

  // click dob click cancel click continue
  it("should display an error when user click dob, click cancel, then click continue ", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpEmailInfo.email);
    await signUpActionSuites.confirmPasswordScreen(signUpEmailInfo.password);
    await signUpActionSuites.otpScreen(signUpEmailInfo.otp);
    await signUpActionSuites.successfulScreen();
    await signUpActionSuites.genderScreen(signUpEmailInfo.gender);
    await signUpActionSuites.firstNameScreen(signUpEmailInfo.firstName);
    await signUpActionSuites.middleNameScreen(signUpEmailInfo.middleName);
    await signUpActionSuites.lastNameScreen(signUpEmailInfo.lastName);
    await signUpDobErrorCase.dobCancelContinue();
    await expect(
      element(by.text("Please select your date of birth"))
    ).toBeVisible();
  });
});

module.exports = {
  signUpDobErrorCase,
};
