const { afterEach } = require("node:test");
const { signInTestSuites } = require("./action_suites");
const { signInUserWithout2fa } = require("../mock/mock_data");

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

  it("should go to sign in screen, sign in with phone without 2fa and succeeded", async () => {
    await signInTestSuites.enterSignInScreenFromHome();
    await signInTestSuites.signInPhoneScreen(
      signInUserWithout2fa.phone,
      signInUserWithout2fa.password
    );
    await signInTestSuites.endSignInWithNo2FA(signInUserWithout2fa.lastName);
    // Home
    await expect(
      element(by.text(`Hi ${signInUserWithout2fa.lastName},`))
    ).toBeVisible();
  });
});

module.exports = {
  signInTestSuites,
};
