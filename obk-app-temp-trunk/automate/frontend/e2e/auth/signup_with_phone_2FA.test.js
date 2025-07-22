const { afterEach } = require("node:test");
const { signUpUser } = require("../mock/mock_data");
const { signUpActionSuites } = require("./action_suites");
const AccountDb = require("../database/ob-iam/account_db");

describe("Sign up with phone", () => {
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
    const identifier =
      signUpUser.countryCode + signUpUser.phone.replace(/^0+/, "");
    await db.deleteAccount(identifier);
  });

  it("should go to sign up screen and sign up with phone 2FA successfully", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpPhoneScreen(
      signUpUser.countryCode,
      signUpUser.phone
    );
    await signUpActionSuites.confirmPasswordScreen(signUpUser.password);
    await signUpActionSuites.otpScreen(signUpUser.otp);
    await signUpActionSuites.successfulScreen();
    await signUpActionSuites.genderScreen(signUpUser.genderSelectedId);
    await signUpActionSuites.firstNameScreen(signUpUser.firstName);
    await signUpActionSuites.middleNameScreen();
    await signUpActionSuites.lastNameScreen(signUpUser.lastName);
    await signUpActionSuites.dobScreen();
    await signUpActionSuites.endSignUpWith2FA();
    await signUpActionSuites.phoneSetUp2FaScreen(signUpUser.email);

    await expect(element(by.text("Confirm your email")));
    await expect(element(by.text(signUpUser.email)));
    await signUpActionSuites.otpScreen(signUpUser.otp);
    await signUpActionSuites.endSetUp2FaScreen();

    await expect(element(by.text(`Hi ${signUpUser.lastName},`))).toBeVisible();
  });
});
