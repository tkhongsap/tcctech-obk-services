const { afterEach } = require("node:test");

const { signUpActionSuites, clearTextField } = require("./action_suites");

const signUpInfo = {
  email: "e2e-firstname@mail.com",
  password: "12345678",
  otp: "000000",
};

const signUpGenderErrorCase = {
  genderEmpty: async () => {
    await expect(element(by.text("What is your gender?"))).toBeVisible();
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

  it("should display an error when the user press continue without choosing gender", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpInfo.email);
    await signUpActionSuites.confirmPasswordScreen(signUpInfo.password);
    await signUpActionSuites.otpScreen(signUpInfo.otp);
    await signUpActionSuites.successfulScreen();
    await signUpGenderErrorCase.genderEmpty();
    await expect(
      element(
        by.text(
          "Please, select one option or click on “Skip” button to proceed."
        )
      )
    ).toBeVisible();
  });
});

module.exports = {
  signUpGenderErrorCase,
  signUpInfo,
};
