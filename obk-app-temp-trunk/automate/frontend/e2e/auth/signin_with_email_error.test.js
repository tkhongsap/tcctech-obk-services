const { afterEach } = require("node:test");
const { signInUserWith2fa } = require("../mock/mock_data");
const { signInTestSuites, clearTextField } = require("./action_suites");

const signInTestSuitesErrorCase = {
  signInEmailScreen: async (
    wrongFormatEmail,
    email,
    wrongPassword,
    password
  ) => {
    const emailLength = email.length;
    // sign in screen
    await expect(element(by.text("Sign in"))).toBeVisible();
    await expect(element(by.text("Welcome back!"))).toBeVisible();

    // tap continue without adding any input
    await element(by.text("Continue with email")).tap();
    await expect(element(by.text("Please, type in your email"))).toBeVisible();

    // add email but wrong format email

    await element(by.id("signin-email-id")).tap();
    await element(by.id("signin-email-id")).typeText(wrongFormatEmail);
    await element(by.text("Welcome back!")).tap();
    await element(by.text("Continue with email")).tap();
    await expect(element(by.text("Please complete your email"))).toBeVisible();

    // add email press continue with no password

    await element(by.id("signin-email-id")).tap();
    await clearTextField("signin-email-id", emailLength);
    await element(by.id("signin-email-id")).typeText(email);
    await element(by.text("Welcome back!")).tap();
    await element(by.text("Continue with email")).tap();
    await expect(
      element(by.text("Email and password don't match."))
    ).toBeVisible();

    // correct email with wrong password

    await element(by.id("signin-password-id")).tap();
    await element(by.id("signin-password-id")).typeText(wrongPassword);
    await element(by.text("Welcome back!")).tap();
    await element(by.text("Continue with email")).tap();
    await expect(
      element(by.text("Email and password don't match."))
    ).toBeVisible();

    // right format to go to the next page
    await element(by.id("signin-password-id")).tap();
    await element(by.id("signin-password-id")).typeText(password);
    await element(by.text("Welcome back!")).tap();
    await element(by.text("Continue with email")).tap();
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

  it("should go to sign in screen, press continue with no email, add wrong format email, add email but no password, add email but wrong password, go to otp screen, add invalid otp code", async () => {
    await signInTestSuites.enterSignInScreenFromHome();
    await signInTestSuitesErrorCase.signInEmailScreen(
      signInUserWith2fa.wrongFormatEmail,
      signInUserWith2fa.email,
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
