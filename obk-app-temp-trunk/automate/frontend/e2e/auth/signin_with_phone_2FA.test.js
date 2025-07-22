const { afterEach } = require("node:test");
const { signInTestSuites } = require("./action_suites");
const { signInUserWith2fa } = require("../mock/mock_data");

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

  it("should go to sign in screen, sign in with phone go to 2FA screen and succeeded", async () => {
    await signInTestSuites.enterSignInScreenFromHome();
    await signInTestSuites.signInPhoneScreen(
      signInUserWith2fa.phone,
      signInUserWith2fa.password
    );
    await signInTestSuites.enter2FAScreen(
      signInUserWith2fa.lastName,
      signInUserWith2fa.otp
    );
    // Home
    await expect(
      element(by.text(`Hi ${signInUserWith2fa.lastName},`))
    ).toBeVisible();
  });
});

module.exports = {
  signInTestSuites,
};
