const { afterEach } = require("node:test");

const { signUpActionSuites, clearTextField } = require("./action_suites");

const signUpInfo = {
  email: "e2e-firstname@mail.com",
  password: "12345678",
  otp: "000000",
  gender: "gender-male-id",
  firstName: "E2eFirstname",
  specialCharacter: "!@#$%^&*()_+",
  emoji: "😀😊😆",
};

const signUpFirstNameErrorCase = {
  firstNameEmptyCase: async () => {
    // blank case
    await expect(element(by.text("What is your first name?"))).toBeVisible();
    await element(by.text("Create new account")).tap();
    await element(by.text("Continue")).tap();
  },

  //----- special character case will need to recheck after refactor ------- //

  firstNameSpecialCharacterCase: async (specialCharacter) => {
    await element(by.id("first-name-id")).tap();
    await element(by.id("first-name-id")).typeText(specialCharacter);
    await element(by.text("Create new account")).tap();
    await element(by.text("Continue")).tap();

    //----- emoji case will need to recheck after refactor ------- //
    // const specialCharacterLength = specialCharacter.length;
    // await element(by.id("first-name-id")).tap();
    // await clearTextField("first-name-id", specialCharacterLength);
    // await element(by.id("first-name-id")).typeText(emoji);
    // await element(by.text("Create new account")).tap();
    // await element(by.text("Continue")).tap().toBeVisible();
    // await expect(
    //   element(by.text("First name must not contain special character"))
    // ).toBeVisible();
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

  it("should display an error when the first name is empty", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpInfo.email);
    await signUpActionSuites.confirmPasswordScreen(signUpInfo.password);
    await signUpActionSuites.otpScreen(signUpInfo.otp);
    await signUpActionSuites.successfulScreen();
    await signUpActionSuites.genderScreen(signUpInfo.gender);
    await signUpFirstNameErrorCase.firstNameEmptyCase();
    await expect(
      element(by.text("Please, type in your first name"))
    ).toBeVisible();
  });

  it("should display an error when the first name has special characters", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpInfo.email);
    await signUpActionSuites.confirmPasswordScreen(signUpInfo.password);
    await signUpActionSuites.otpScreen(signUpInfo.otp);
    await signUpActionSuites.successfulScreen();
    await signUpActionSuites.genderScreen(signUpInfo.gender);
    await signUpFirstNameErrorCase.firstNameSpecialCharacterCase(
      signUpInfo.specialCharacter
    );
    await expect(
      element(by.text("First name must not contain special character"))
    ).toBeVisible();
  });
});

module.exports = {
  signUpFirstNameErrorCase,
  signUpInfo,
};
