const signInTestSuites = {
  enterSignInScreenFromHome: async () => {
    await waitFor(element(by.text("See more")))
      .toBeVisible()
      .withTimeout(5000);

    // home screen
    await element(by.text("See more")).tap();

    // sign in or sign drawer
    await element(by.text("I already have an account")).tap();
  },

  signInEmailScreen: async (email, password) => {
    // sign in screen
    await expect(element(by.text("Sign in"))).toBeVisible();
    await expect(element(by.text("Welcome back!"))).toBeVisible();

    await element(by.id("signin-email-id")).tap();
    await element(by.id("signin-email-id")).typeText(email);

    await element(by.id("signin-password-id")).tap();
    await element(by.id("signin-password-id")).typeText(password);

    await waitFor(element(by.text("Continue with email")))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.text("Welcome back!")).tap();
    await element(by.text("Continue with email")).tap();
  },

  signInPhoneScreen: async (phone, password) => {
    // sign in screen
    await expect(element(by.text("Sign in"))).toBeVisible();
    await expect(element(by.text("Welcome back!"))).toBeVisible();

    await element(by.text("Phone")).tap();

    await element(by.id("signin-phone-id")).tap();
    await element(by.id("signin-phone-id")).typeText(phone);

    await element(by.id("signin-phone-password-id")).tap();
    await element(by.id("signin-phone-password-id")).typeText(password);

    await waitFor(element(by.text("Continue with phone")))
      .toBeVisible()
      .withTimeout(5000);

    // might need to change this one in the future
    await element(by.text("Welcome back!")).tap();
    await element(by.text("Continue with phone")).tap();
  },

  endSignInWithNo2FA: async (lastName) => {
    await element(by.text(`Hi ${lastName},`));
  },

  enter2FAScreen: async (lastName, otp) => {
    await waitFor(element(by.text("Two-Factor Authentication")))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id("otp-field-id")).tap();
    await element(by.id("otp-field-id")).typeText(otp);

    await element(by.text(`Hi ${lastName},`)).toBeVisible;
  },
};

const signUpActionSuites = {
  enterSignUpScreenFromHome: async () => {
    await waitFor(element(by.text("See more")))
      .toBeVisible()
      .withTimeout(5000);

    // home screen
    await element(by.text("See more")).tap();

    // sign in or sign drawer
    await element(by.text("Sign up for free now")).tap();
  },
  signUpEmailScreen: async (email) => {
    await element(by.id("signup-email")).tap();
    await element(by.id("signup-email")).typeText(email);

    await waitFor(element(by.text("Continue with email")))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.text("New account")).tap();
    await element(by.text("Continue with email")).tap();
  },
  signUpPhoneScreen: async (countryCode, phone) => {
    await element(by.id("sign-up-phone-tab")).tap();
    await element(by.id("signup-phone")).typeText(phone);
    await element(by.id("phone-country-code")).tap();
    await element(by.id("phone-country-code")).tap();

    await waitFor(element(by.id(`country-code-${countryCode}`)))
      .toBeVisible()
      .whileElement(by.id("country-code-list"))
      .scroll(50, "down");
    await element(by.id(`country-code-${countryCode}`)).tap();
    await element(by.id("modal-country-code-done")).tap();
    await waitFor(element(by.text("Continue with phone")))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.text("New account")).tap();
    await element(by.text("Continue with phone")).tap();
  },
  confirmPasswordScreen: async (password) => {
    // setup password screen
    await waitFor(element(by.text("Set up password")))
      .toBeVisible()
      .withTimeout(2000);

    await element(by.id("signup-password-id")).tap();
    await element(by.id("signup-password-id")).typeText(password);

    await element(by.text("Set up password")).tap();

    await element(by.id("signup-confirm-password-id")).tap();
    await element(by.id("signup-confirm-password-id")).typeText(password);

    await element(by.text("Set up password")).tap();

    await element(by.id("tnc-id")).tap();

    await element(by.text("Continue")).tap();
  },
  otpScreen: async (otp) => {
    await element(by.id("otp-field-id")).tap();
    await element(by.id("otp-field-id")).typeText(otp);
  },
  successfulScreen: async () => {
    await element(by.text("Continue")).tap();
  },
  genderScreen: async (genderSelectedId) => {
    await element(by.id(genderSelectedId)).tap();
    await element(by.text("Continue")).tap();
  },
  firstNameScreen: async (firstName) => {
    await element(by.id("first-name-id")).tap();
    await element(by.id("first-name-id")).typeText(firstName);
    await element(by.text("Create new account")).tap();
    await element(by.text("Continue")).tap();
  },
  middleNameScreen: async () => {
    await element(by.text("Create new account")).tap();
    await element(by.text("Skip")).tap();
  },
  lastNameScreen: async (lastName) => {
    await element(by.id("last-name-id")).tap();
    await element(by.id("last-name-id")).typeText(lastName);
    await element(by.text("Create new account")).tap();
    await element(by.text("Continue")).tap();
  },
  dobScreen: async () => {
    await element(by.id("date-picker-id")).tap();
    await waitFor(element(by.id("date-picker-done-id")))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.id("date-picker-done-id")).tap();
    await waitFor(element(by.text("Continue")))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.text("Continue")).tap();
  },
  endSignUpWithNo2FA: async () => {
    await element(by.text("Explore")).tap();
  },
  signUpEmailFlow: async (_user) => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpEmailScreen(_user.email);
    await signUpActionSuites.confirmPasswordScreen(_user.password);
    await signUpActionSuites.otpScreen(_user.otp);
    await signUpActionSuites.successfulScreen();
    await signUpActionSuites.genderScreen(_user.genderSelectedId);
    await signUpActionSuites.firstNameScreen(_user.firstName);
    await signUpActionSuites.middleNameScreen();
    await signUpActionSuites.lastNameScreen(_user.lastName);
    await signUpActionSuites.dobScreen();
    await signUpActionSuites.endSignUpWithNo2FA(_user.lastName);
  },
  signUpPhoneFlow: async (_user) => {
    await signUpActionSuites.enterSignUpScreenFromHome();
    await signUpActionSuites.signUpPhoneScreen(_user.countryCode, _user.phone);
    await signUpActionSuites.confirmPasswordScreen(_user.password);
    await signUpActionSuites.otpScreen(_user.otp);
    await signUpActionSuites.successfulScreen();
    await signUpActionSuites.genderScreen(_user.genderSelectedId);
    await signUpActionSuites.firstNameScreen(_user.firstName);
    await signUpActionSuites.middleNameScreen();
    await signUpActionSuites.lastNameScreen(_user.lastName);
    await signUpActionSuites.dobScreen();
    await signUpActionSuites.endSignUpWithNo2FA(_user.lastName);
  },
  endSignUpWith2FA: async () => {
    await element(by.id("completed-sign-up-setup-2fa")).tap();
  },
  emailSetUp2FaScreen: async (countryCode, phone) => {
    await element(by.id("setup-2fa-phone-field")).tap();
    await element(by.id("setup-2fa-phone-field")).typeText(phone);
    await element(by.id("phone-country-code")).tap();
    await element(by.id("phone-country-code")).tap();

    await waitFor(element(by.id(`country-code-${countryCode}`)))
      .toBeVisible()
      .whileElement(by.id("country-code-list"))
      .scroll(50, "down");
    await element(by.id(`country-code-${countryCode}`)).tap();
    await element(by.id("modal-country-code-done")).tap();
    await element(by.text("Continue")).tap();
  },
  phoneSetUp2FaScreen: async (email) => {
    await element(by.id("setup-2fa-email-field")).tap();
    await element(by.id("setup-2fa-email-field")).typeText(email);
    await element(by.id("continue")).tap();
  },
  endSetUp2FaScreen: async () => {
    await element(by.text("Explore")).tap();
  },
};

const signOutActionSuites = {
  getToAccountSettingFromHome: async () => {
    await element(by.id("home-menu-id")).tap();
    await element(by.id("drawer-settings-id")).tap();
    await element(by.id("settings-my-account-id")).tap();
  },
  signOut: async () => {
    await element(by.id("account-info-scroll-view-id")).scrollTo("bottom");
    await element(by.id("account-info-sign-out-id")).tap();
    await element(by.id("account-info-confirm-sign-out-id")).tap();
  },
};

const clearTextField = async (elementId, textLength) => {
  for (let i = 0; i < textLength; i++) {
    await element(by.id(elementId)).tapBackspaceKey();
  }
};

module.exports = {
  signInTestSuites,
  signUpActionSuites,
  signOutActionSuites,
  clearTextField,
};
