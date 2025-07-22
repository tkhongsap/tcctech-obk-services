const { afterEach } = require("node:test");

const { signInTestSuites } = require("./action_suites");
const { signInUserWith2fa } = require("../mock/mock_data");

const signInTestSuitesErrorCase = {
  signInPhoneScreen: async (phone, wrongPassword, password) => {
    // sign in screen
    await expect(element(by.text("Sign in"))).toBeVisible();
    await expect(element(by.text("Welcome back!"))).toBeVisible();
    await element(by.text("Phone")).tap();

    // tap continue without adding any input

    await element(by.text("Continue with phone")).tap();
    await expect(
      element(by.text("Please, type your phone number"))
    ).toBeVisible();

    // add phone press continue with no password

    await element(by.id("signin-phone-id")).tap();
    await element(by.id("signin-phone-id")).typeText(phone);
    await element(by.text("Welcome back!")).tap();
    await element(by.text("Continue with phone")).tap();
    await expect(
      element(by.text("Phone number and password don't match."))
    ).toBeVisible();

    // correct phone with wrong password

    await element(by.id("signin-phone-password-id")).tap();
    await element(by.id("signin-phone-password-id")).typeText(wrongPassword);
    await element(by.text("Welcome back!")).tap();
    await element(by.text("Continue with phone")).tap();
    await expect(
      element(by.text("Phone number and password don't match."))
    ).toBeVisible();

    // right format to go to the next page
    await element(by.id("signin-phone-password-id")).tap();
    await element(by.id("signin-phone-password-id")).typeText(password);
    await element(by.text("Welcome back!")).tap();
    await element(by.text("Continue with phone")).tap();
  },

  enter2FAScreen: async (lastName, otp, wrongOtp) => {
    await waitFor(element(by.text("Two-Factor Authentication")))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id("otp-field-id")).tap();
    await element(by.id("otp-field-id")).typeText(wrongOtp);
    await expect(element(by.text("Invalid code"))).toBeVisible();
  },
};

describe("Sign in", () => {
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

  it("should go to sign in screen, press continue with no phone, add wrong format phone, add phone but no password, add phone but wrong password, go to otp screen, add invalid otp code", async () => {
    await signInTestSuites.enterSignInScreenFromHome();
    await signInTestSuitesErrorCase.signInPhoneScreen(
      signInUserWith2fa.phone,
      signInUserWith2fa.wrongPassword,
      signInUserWith2fa.password
    );
    await signInTestSuitesErrorCase.enter2FAScreen(
      signInUserWith2fa.lastName,
      signInUserWith2fa.otp,
      signInUserWith2fa.wrongOtp
    );
  });
});

module.exports = {
  signInTestSuitesErrorCase,
};
