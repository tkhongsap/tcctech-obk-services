const { afterEach } = require("node:test");

const { signUpActionSuites } = require("./action_suites");

const signUpInfo = {
  email: "testemail@gmail.com",
  sevenChars: "1234567",
  password: "12345678",
};

const signUpPasswordError = {
  //empty
  passwordEmpty: async () => {
    await waitFor(element(by.text("Set up password")))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.text("Continue")).tap();
  },

  // less than 7 chars
  lessThanEightChars: async (sevenChars) => {
    await waitFor(element(by.text("Set up password")))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.id("signup-password-id")).tap();
    await element(by.id("signup-password-id")).typeText(sevenChars);
    await element(by.text("Continue")).tap();
  },

  //confirm password empty and not match
  confirmPasswordEmpty: async (password) => {
    await waitFor(element(by.text("Set up password")))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.id("signup-password-id")).tap();
    await element(by.id("signup-password-id")).typeText(password);
    await element(by.text("Continue")).tap();
  },

  //continue without terms and condition

  notAcceptTC: async (password) => {
    await waitFor(element(by.text("Set up password")))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.id("signup-password-id")).tap();
    await element(by.id("signup-password-id")).typeText(password);
    await element(by.text("Continue")).tap();
    await element(by.id("signup-confirm-password-id")).tap();
    await element(by.id("signup-confirm-password-id")).typeText(password);
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

  it("should display an error when password is empty and press continue", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpInfo.email);
    await signUpPasswordError.passwordEmpty();
    await expect(
      element(by.text("The password must contain at least 8 characters"))
    ).toBeVisible();
  });

  it("should display an error when password is less than 8 characters", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpInfo.email);
    await signUpPasswordError.lessThanEightChars(signUpInfo.sevenChars);
    await expect(
      element(by.text("The password must contain at least 8 characters"))
    ).toBeVisible();
  });

  it("should display an error when password filled but confirm password is empty and click continue", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpInfo.email);
    await signUpPasswordError.confirmPasswordEmpty(signUpInfo.password);
    await expect(
      element(by.text("Password and confirmed password don’t match"))
    ).toBeVisible();
  });

  it("should display an error when user don’t press accept terms and conditions", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpInfo.email);
    await signUpPasswordError.notAcceptTC(signUpInfo.password);
    await expect(
      element(
        by.text("Please accept the Terms and Conditions and Privacy Statement")
      )
    ).toBeVisible();
  });
});

module.exports = {
  signUpPasswordError,
  signUpInfo,
};
