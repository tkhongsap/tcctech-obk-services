const { afterEach } = require("node:test");

const { signUpActionSuites, clearTextField } = require("./action_suites");

const signUpInfo = {
  email: "testmail@mail.com",
  password: "12345678",
  invalidOtp: "123456",
};

const signUpOtpErrorCase = {
  invalidOtp: async (invalidOtp) => {
    await expect(element(by.text("Confirm your email"))).toBeVisible();
    await element(by.id("otp-field-id")).tap();
    await element(by.id("otp-field-id")).typeText(invalidOtp);
  },
  invalidOtp3Times: async (invalidOtp) => {
    for (let i = 0; i < 3; i++) {
      await expect(element(by.text("Confirm your email"))).toBeVisible();
      const otpLength = 6;
      await clearTextField("otp-field-id", otpLength);
      await element(by.id("otp-field-id")).typeText(invalidOtp);
    }
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

  it("should display an error when the otp is incorrect", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpInfo.email);
    await signUpActionSuites.confirmPasswordScreen(signUpInfo.password);
    await signUpOtpErrorCase.invalidOtp(signUpInfo.invalidOtp);
    await expect(element(by.text("Invalid code"))).toBeVisible();
  });

  it("should redirect to announcement screen if otp is invalid 3 times", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpInfo.email);
    await signUpActionSuites.confirmPasswordScreen(signUpInfo.password);
    await signUpOtpErrorCase.invalidOtp3Times(signUpInfo.invalidOtp);
    await expect(
      element(by.text("Too many incorrect OTP attempts"))
    ).toBeVisible();
  });
});

module.exports = {
  signUpOtpErrorCase,
  signUpInfo,
};
