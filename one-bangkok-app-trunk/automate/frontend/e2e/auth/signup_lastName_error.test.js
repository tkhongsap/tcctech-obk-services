const { afterEach } = require("node:test");

const { signUpActionSuites, clearTextField } = require("./action_suites");

const signUpInfo = {
  email: "e2e-middlename@mail.com",
  password: "12345678",
  otp: "000000",
  gender: "gender-male-id",
  firstName: "E2eFirstname",
  middleName: "E2eMiddlename",
  lastName: "E2eLastname",
  specialCharacter: "!@#$%^&*()_+",
  emoji: "😀😊😆",
};

const signUpLastNameErrorCase = {
  lastNameEmptyCase: async () => {
    // blank case
    await expect(element(by.text("What is your last name?"))).toBeVisible();
    await element(by.text("Create new account")).tap();
    await element(by.text("Continue")).tap();
  },

  //----- special character case will need to recheck after refactor ------- //
  lastNameSpecialCharacterCase: async (specialCharacter) => {
    await element(by.id("last-name-id")).tap();
    await element(by.id("last-name-id")).typeText(specialCharacter);
    await element(by.text("Create new account")).tap();
    await element(by.text("Continue")).tap();

    // ----- emoji case will need to recheck after refactor ------- //
    // const specialCharacterLength = specialCharacter.length;
    // await element(by.id("last-name-id")).tap();
    // await clearTextField("last-name-id", specialCharacterLength);
    // await element(by.id("last-name-id")).typeText(emoji);
    // await element(by.text("Create new account")).tap();
    // await element(by.text("Continue")).tap();
    // await expect(
    //   element(by.text("Last name must not contain special character"))
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

  it("should display an error when the last name is empty", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpInfo.email);
    await signUpActionSuites.confirmPasswordScreen(signUpInfo.password);
    await signUpActionSuites.otpScreen(signUpInfo.otp);
    await signUpActionSuites.successfulScreen();
    await signUpActionSuites.genderScreen(signUpInfo.gender);
    await signUpActionSuites.firstNameScreen(signUpInfo.firstName);
    await signUpActionSuites.middleNameScreen(signUpInfo.middleName);
    await signUpLastNameErrorCase.lastNameEmptyCase();
    await expect(
      element(by.text("Please, type in your last name"))
    ).toBeVisible();
  });

  it("should display an error when the last name has special characters", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpInfo.email);
    await signUpActionSuites.confirmPasswordScreen(signUpInfo.password);
    await signUpActionSuites.otpScreen(signUpInfo.otp);
    await signUpActionSuites.successfulScreen();
    await signUpActionSuites.genderScreen(signUpInfo.gender);
    await signUpActionSuites.firstNameScreen(signUpInfo.firstName);
    await signUpActionSuites.middleNameScreen(signUpInfo.middleName);
    await signUpLastNameErrorCase.lastNameSpecialCharacterCase(
      signUpInfo.specialCharacter
    );
    await expect(
      element(by.text("Last name must not contain special character"))
    ).toBeVisible();
  });
});

module.exports = {
  signUpLastNameErrorCase,
  signUpInfo,
};
