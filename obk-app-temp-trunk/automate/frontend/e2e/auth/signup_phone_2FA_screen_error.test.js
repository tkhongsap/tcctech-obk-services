const { signUpUser } = require("../mock/mock_data");
const { signUpActionSuites } = require("./action_suites");
const AccountDb = require("../database/ob-iam/account_db");
const OtpDb = require("../database/ob-iam/otp_db");

const signUpInfo = {
  email: "jaynaxissa@gmail.com",
  password: "12345678",
  otp: "000000",
  gender: "gender-male-id",
  firstName: "E2eFirstname",
  middleName: "E2eMiddlename",
  lastName: "E2eLastname",
  phone: "081235678",
  wrongFormat: "asfnlo",
};

const signUp2FAErrorCase = {
  emailEmpty: async () => {
    await expect(element(by.text("What is your email?"))).toBeVisible();
    await element(by.text("Continue")).tap();
    await element(by.text("Continue")).tap();
  },

  wrongFormat: async (wrongFormat) => {
    await expect(element(by.text("What is your email?"))).toBeVisible();
    await element(by.id("setup-2fa-email-field")).tap();
    await element(by.id("setup-2fa-email-field")).typeText(wrongFormat);
    await element(by.text("Continue")).tap();
  },

  emailExist: async (email) => {
    await expect(element(by.text("What is your email?"))).toBeVisible();
    await element(by.id("setup-2fa-email-field")).tap();
    await element(by.id("setup-2fa-email-field")).typeText(email);
    await element(by.text("Continue")).tap();
  },
};

describe("Sign up with phone", () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: { notifications: "YES", location: "always" },
    });
  });

  beforeEach(async () => {
    const identifier =
      signUpUser.countryCode + signUpUser.phone.replace(/^0+/, "");
    const accountDb = new AccountDb();
    const otpDb = new OtpDb();

    await accountDb.deleteAccount(identifier);
    await otpDb.deleteOtp(identifier);
    await device.reloadReactNative();
  });

  afterAll(async () => {
    const identifier =
      signUpUser.countryCode + signUpUser.phone.replace(/^0+/, "");
    const db = new AccountDb();
    await db.deleteAccount(identifier);
    await device.reloadReactNative();
  });

  it("should go to sign up screen and sign up with phone 2FA error empty email", async () => {
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
    await signUp2FAErrorCase.emailEmpty();
    await expect(element(by.text("Please, type in your email"))).toBeVisible();
  });

  it("should go to sign up screen and sign up with phone 2FA error email wrong format", async () => {
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

    await signUp2FAErrorCase.wrongFormat(signUpInfo.wrongFormat);
    await expect(element(by.text("Please complete your email"))).toBeVisible();
  });

  it("should go to sign up screen and sign up with phone 2FA error input exist email", async () => {
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

    await signUp2FAErrorCase.emailExist(signUpInfo.email);
    await expect(
      element(by.text("This email is already registered"))
    ).toBeVisible();
  });
});
