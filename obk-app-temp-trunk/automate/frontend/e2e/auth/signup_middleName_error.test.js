const { afterEach } = require("node:test");
const { signUpActionSuites, clearTextField } = require("./action_suites");

const signUpInfo = {
  email: "e2e-middlename@mail.com",
  password: "12345678",
  otp: "000000",
  gender: "gender-male-id",
  firstName: "E2eFirstname",
  middleName: "E2eMiddlename",
  specialCharacter: "!@#$%^&*()_+",
  emoji: "😀😊😆",
};

const signUpMiddleNameErrorCase = {
  middleNameEmptyCase: async () => {
    // blank case
    await expect(element(by.text("What is your middle name?"))).toBeVisible();
    await element(by.text("Create new account")).tap();
    await element(by.text("Continue")).tap();
  },

  //----- special character case will need to recheck after refactor ------- //
  middleNameSpecialCharacterCase: async (specialCharacter) => {
    await element(by.id("middle-name-id")).tap();
    await element(by.id("middle-name-id")).typeText(specialCharacter);
    await element(by.text("Create new account")).tap();
    await element(by.text("Continue")).tap();
  },

  // ----- emoji case will need to recheck after refactor ------- //
  //   const specialCharacterLength = specialCharacter.length;
  // await element(by.id("middle-name-id")).tap();
  // await clearTextField("middle-name-id", specialCharacterLength);
  // await element(by.id("middle-name-id")).typeText(emoji);
  // await element(by.text("Create new account")).tap();
  // await element(by.text("Continue")).tap();
  // await expect(
  //   element(by.text("Middle name must not contain special character"))
  // ).toBeVisible();
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

  it("should display an error when the middle name is empty", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpInfo.email);
    await signUpActionSuites.confirmPasswordScreen(signUpInfo.password);
    await signUpActionSuites.otpScreen(signUpInfo.otp);
    await signUpActionSuites.successfulScreen();
    await signUpActionSuites.genderScreen(signUpInfo.gender);
    await signUpActionSuites.firstNameScreen(signUpInfo.firstName);
    // blank case
    await signUpMiddleNameErrorCase.middleNameEmptyCase();
    await expect(
      element(by.text("Please, type in your middle name"))
    ).toBeVisible();
  });

  it("should display an error when the middle name has special characters", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpInfo.email);
    await signUpActionSuites.confirmPasswordScreen(signUpInfo.password);
    await signUpActionSuites.otpScreen(signUpInfo.otp);
    await signUpActionSuites.successfulScreen();
    await signUpActionSuites.genderScreen(signUpInfo.gender);
    await signUpActionSuites.firstNameScreen(signUpInfo.firstName);
    await signUpMiddleNameErrorCase.middleNameSpecialCharacterCase(
      signUpInfo.specialCharacter
    );
    await expect(
      element(by.text("Middle name must not contain special character"))
    ).toBeVisible();
  });
});

module.exports = {
  signUpMiddleNameErrorCase,
  signUpInfo,
};
