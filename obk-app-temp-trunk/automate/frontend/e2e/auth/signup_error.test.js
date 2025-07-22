const { afterEach } = require("node:test");

const { signUpActionSuites } = require("./action_suites");

const signUpInfo = {
  wrongFormatEmail: "asdfghjkl;",
  emailExist: "e2e-test2@mail.com",
  phoneExist: "0812345678",
};

const signUpErrorCase = {
  // email empty
  emailEmpty: async () => {
    await expect(element(by.text("New account"))).toBeVisible();
    await element(by.text("Continue with email")).tap();
    await element(by.text("Continue with email")).tap();
  },

  // incorrect format email

  wrongFormatEmail: async (wrongFormatEmail) => {
    await expect(element(by.text("New account"))).toBeVisible();
    await element(by.id("signup-email")).tap();
    await element(by.id("signup-email")).typeText(wrongFormatEmail);
    await element(by.text("Continue with email")).tap();
    await element(by.text("Continue with email")).tap();
  },

  // email already exist
  emailExist: async (emailExist) => {
    await expect(element(by.text("New account"))).toBeVisible();
    await element(by.id("signup-email")).tap();
    await element(by.id("signup-email")).typeText(emailExist);
    await element(by.text("Continue with email")).tap();
    await element(by.text("Continue with email")).tap();
  },

  // phone empty
  phoneEmpty: async () => {
    await element(by.text("Phone")).tap();
    await element(by.text("Continue with phone")).tap();
    await element(by.text("Continue with phone")).tap();
  },

  // phone already exist
  phoneExist: async (phoneExist) => {
    await element(by.text("Phone")).tap();
    await element(by.id("signup-phone")).typeText(phoneExist);
    await element(by.text("Continue with phone")).tap();
    await element(by.text("Continue with phone")).tap();
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

  it("should display an error when email empty and click continue", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpErrorCase.emailEmpty();
    await expect(element(by.text("Please, type in your email"))).toBeVisible();
  });

  it("should display an error when enter wrong format email and continue", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpErrorCase.wrongFormatEmail(signUpInfo.wrongFormatEmail);
    await expect(element(by.text("Please complete your email"))).toBeVisible();
  });

  it("should display an error when email already exist and press continue", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpErrorCase.emailExist(signUpInfo.emailExist);
    await expect(
      element(by.text("This email is already registered"))
    ).toBeVisible();
  });

  it("should display an error when phone is empty and press continue", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpErrorCase.phoneEmpty();
    await expect(
      element(by.text("Please, type your phone number"))
    ).toBeVisible();
  });
  it("should display an error when phone is already exist and press continue", async () => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpErrorCase.phoneExist(signUpInfo.phoneExist);
    await expect(
      element(by.text("This phone number is already registered"))
    ).toBeVisible();
  });
});

module.exports = {
  signUpErrorCase,
  signUpInfo,
};
