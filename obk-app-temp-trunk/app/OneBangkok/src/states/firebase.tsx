import {hookstate} from '@hookstate/core';

const appLanguage = {
  name: '',
  value: '',
  description: '',
};

const featureSwitch = {
  enable_firebase_inapp_messaging: false,
  enable_two_factor_authentication: false,
  enable_aqi_homescreen_and_menu: false,
  enable_building_service_homescreen_and_menu: false,
  enable_faq_section: false,
};

const smartParkingColor = {
  name: '',
  color: '',
};

const enableSSOButton = {
  google: false,
  apple: false,
  microsoft: false,
};

const enableBuildingService = {
  service_request: false,
  air_conditioner_request: false,
  parking_redemption: false,
};

const appMaintenance = {
  ios: {
    under_maintenance: false,
  },
  android: {
    under_maintenance: false,
  },
  updated_by: '',
  updated_at: '',
  message: {
    title: {
      en: '',
      th: '',
      cn: '',
    },
    body: {
      en: '',
      th: '',
      cn: '',
    },
  },
};

const appVersionUpdate = {
  ios: {
    force: true,
    version: '',
    updated_at: '',
    updated_by: '',
    message: {
      title: {
        en: '',
        th: '',
        cn: '',
      },
      body: {
        en: '',
        th: '',
        cn: '',
      },
    },
  },
  android: {
    force: true,
    version: '',
    updated_at: '',
    updated_by: '',
    message: {
      title: {
        en: '',
        th: '',
        cn: '',
      },
      body: {
        en: '',
        th: '',
        cn: '',
      },
    },
  },
};

const storeLink = {
  android: '',
  ios: '',
};

const homeContent = {
  background_image: '',
  enable_announcement: true,
};

const whitelistAnnouncement = {
  title: {
    en: '',
    th: '',
  },
  body: {
    en: '',
    th: '',
  },
};

const blacklistAnnouncement = {
  title: {
    en: '',
    th: '',
  },
  body: {
    en: '',
    th: '',
  },
};

const maintenanceWhiteList = {
  allow_whitelist: false,
  device_ids: [''],
};

const elevatorWaitingTime = 0;

const firebaseConfigState = hookstate({
  app_version: {
    version: '',
    force: true,
  },
  contract: {
    call_contract_center: '',
    email_contract_center: '',
  },
  app_language: [appLanguage],
  building_access: {
    lift_beacon_tag: 'string',
  },
  ...featureSwitch,
  smart_parking_color: [smartParkingColor],
  enable_sso_signin: enableSSOButton,
  enable_building_service: enableBuildingService,
  app_maintenance: appMaintenance,
  home_content: homeContent,
  app_version_update: appVersionUpdate,
  store_link: storeLink,
  whitelist_announcement: whitelistAnnouncement,
  blacklist_announcement: blacklistAnnouncement,
  elevator_waiting_time: elevatorWaitingTime,
  maintenance_whitelist: maintenanceWhiteList,
});

export default firebaseConfigState;
