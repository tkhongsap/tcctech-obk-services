const { afterEach } = require("node:test");
const { signUpUser } = require("../mock/mock_data");
const { signUpActionSuites } = require("./action_suites");
const AccountDb = require("../database/ob-iam/account_db");

describe("Sign up with email", () => {
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
  it("should go to sign up screen and sign up with email successfully", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    // sign up screen
    await expect(element(by.text("Sign up"))).toBeVisible();
    await expect(element(by.text("New account"))).toBeVisible();
    await signUpActionSuites.signUpEmailScreen(signUpUser.email);
    await signUpActionSuites.confirmPasswordScreen(signUpUser.password);

    // otp screen
    await expect(element(by.text("Confirm your email")));
    await expect(element(by.text(signUpUser.email)));
    await signUpActionSuites.otpScreen(signUpUser.otp, signUpUser.email);

    // successful screen
    await expect(element(by.text("Your email")));
    await expect(element(by.text("is confirmed !")));
    await signUpActionSuites.successfulScreen();

    // profile info screen
    // gender page
    await expect(element(by.text("What is your gender?")));
    await signUpActionSuites.genderScreen(signUpUser.genderSelectedId);

    // first name
    await expect(element(by.text("What is your first name?")));
    await signUpActionSuites.firstNameScreen(signUpUser.firstName);

    // middle name
    await expect(element(by.text("What is your middle name?")));
    await signUpActionSuites.middleNameScreen();

    // last name
    await expect(element(by.text("What is your last name?")));
    await signUpActionSuites.lastNameScreen(signUpUser.lastName);

    // your birthday
    await expect(element(by.text("When is your birthday?")));
    await signUpActionSuites.dobScreen();

    // announcement screen
    await expect(element(by.text("Account created")));
    await signUpActionSuites.endSignUpWithNo2FA(signUpUser.lastName);
    // Home
    await expect(element(by.text(`Hi ${signUpUser.lastName},`)));
  });
});
