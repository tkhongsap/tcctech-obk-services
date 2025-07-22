const { afterEach } = require("node:test");
const { signUpUser } = require("../mock/mock_data");
const { signUpActionSuites } = require("./action_suites");
const AccountDb = require("../database/ob-iam/account_db");

describe("Sign up with email with 2FA", () => {
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
  afterAll(async () => {
    const db = new AccountDb();
    await db.deleteAccount(signUpUser.email);
  });
  it("should go to sign up screen and sign up with email with 2FA successfully", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(signUpUser.email);
    await signUpActionSuites.confirmPasswordScreen(signUpUser.password);
    await signUpActionSuites.otpScreen(signUpUser.otp, signUpUser.email);
    await signUpActionSuites.successfulScreen();
    await signUpActionSuites.genderScreen(signUpUser.genderSelectedId);
    await signUpActionSuites.firstNameScreen(signUpUser.firstName);
    await signUpActionSuites.middleNameScreen();
    await signUpActionSuites.lastNameScreen(signUpUser.lastName);
    await signUpActionSuites.dobScreen();

    // announcement screen
    await expect(element(by.text("Account created")));
    await signUpActionSuites.endSignUpWith2FA();
    await signUpActionSuites.emailSetUp2FaScreen(
      signUpUser.countryCode,
      signUpUser.phone
    );
    await expect(element(by.text("Confirm your phone")));
    await expect(
      element(
        by.text(signUpUser.countryCode + signUpUser.phone.replace(/^0+/, ""))
      )
    );
    await signUpActionSuites.otpScreen(signUpUser.otp);
    await signUpActionSuites.endSetUp2FaScreen();
    // Home
    await expect(element(by.text(`Hi ${signUpUser.lastName},`))).toBeVisible();
  });
});
