const appLanguage = {
  name: 'English',
  value: 'en',
  description: 'English',
};

const appLanguageTh = {
  name: 'ไทย',
  value: 'th',
  description: 'Thai',
};

const featureSwitch = {
  enable_firebase_inapp_messaging: false,
  enable_two_factor_authentication: false,
  enable_aqi_homescreen_and_menu: true,
  enable_building_service_homescreen_and_menu: true,
  enable_faq_section: false,
  enable_shuttle_bus: true,
  enable_valet_parking: true,
  enable_marcom_mainpage: true,
  enable_parking_payment: true,
  enable_parking_service: true,
  enable_parking_location: true,
  enable_sustainability: true,
  enable_residential: true,
  enable_wayfinding: true,
  enable_art_culture: true,
  enable_art_culture_map: false,
  enable_share_content: false,
  enable_bookmark_content: false,
  enable_what_is_happening: false,
  enable_artc_booking_ticket: false,
  enable_parking_reservation: false,
  enable_residential_home_automation: true,
  enable_residential_call_lift: false,
  enable_residential_guest_management: false,
  enable_residential_mail_and_parcel: false,
  enable_residential_live_chat: false,
  enable_residential_amenity_booking: false,
  enable_residential_bill_and_payment: false,
  enable_residential_contact_concierge: true,
  enable_residential_service_request: false,
  enable_residential_maintenance_and_repair: false,
  enable_residential_feedback: false,
  enable_residential_contact_directory: true,
  enable_residential_house_rules: true,
  enable_residential_my_property: true,
  enable_residential_car_park_payment: false,
  enable_residential_car_park_redemption: false,
  enable_wayfinding_bluedot_android: false,
  enable_wayfinding_bluedot_ios: false,
  enable_service_request_marcom: false,
  enable_import_physical_parking_ticket: true,
  enable_allow_location_while_using_app: false,
  enable_residential_questionnaire: false,
  enable_shopper: false,
  enable_shopper_valet: false,
  enable_shopper_find_my_car: false,
  enable_shopper_parking_ticket: false,
  enable_parking_redemption: false,
  enable_marcom_survey: false,
};

const smartParkingColor = [
  {name: 'One Bangkok Park', color: '#0B692C'},
  {name: 'Post 1928', color: '#E77334'},
  {name: 'The Storeys', color: '#FEC831'},
  {name: 'Parade', color: '#6CB3D8'},
  {name: 'One Bangkok Forum', color: '#CD2732'},
  {name: 'Z1', color: '#0B692C'},
  {name: 'Z2', color: '#6CB3D8'},
];

const enableSSOButton = {
  google: false,
  apple: false,
  microsoft: false,
};

const enableBuildingService = {
  service_request: true,
  air_conditioner_request: true,
  parking_redemption: true,
};

const appMaintenance = {
  ios: {
    under_maintenance: false,
    updated_at: '2024-02-21T09:46:14.701Z',
  },
  android: {
    under_maintenance: false,
    updated_at: '2024-02-21T09:46:14.701Z',
  },
  updated_by: 'Mtel  Mtel[3]',
  updated_at: '2024-02-21T09:46:14.701Z',
  message: {
    title: {
      en: 'Maintainance',
      th: 'กำลังอยู่ในระหว่างการปรับปรุงระบบ',
      cn: 'Maintainance',
    },
    body: {
      en: 'Maintainance',
      th: 'กำลังอยู่ในระหว่างการปรับปรุงระบบ',
      cn: 'Maintainance',
    },
  },
};

const appVersionUpdate = {
  ios: {
    force: true,
    version: '1.11.1',
    updated_at: '2024-05-08T11:06:05.346Z',
    updated_by: 'Wanput',
    message: {
      title: {en: 'Update Required', th: 'แอปต้องการการอัปเดต', cn: '需要更新'},
      body: {
        en: "To ensure you have the best experience and access to new features, it's necessary to update your app to the latest version. This update includes important bug fixes, performance enhancements, and exciting new features.",
        th: 'เพื่อให้คุณได้ประสบการณ์ที่ดีที่สุดและเข้าถึงคุณสมบัติใหม่ ๆ กรุณาอัปเดตแอปของคุณเป็นเวอร์ชันล่าสุด การอัปเดตนี้รวมถึงการแก้ไขข้อบกพร่องที่สำคัญ ปรับปรุงประสิทธิภาพ และคุณสมบัติใหม่ที่น่าตื่นเต้น',
        cn: '为了确保您拥有最佳体验并访问新功能，必须将您的应用程序更新到最新版本。此更新包括重要的错误修复，性能增强和令人兴奋的新功能。',
      },
    },
  },
  android: {
    force: true,
    version: '1.11.1',
    updated_at: '2024-02-21T07:27:56+0000',
    updated_by: 'Suppawit Satitsongtam',
    message: {
      title: {en: 'Update Required', th: 'แอปต้องการการอัปเดต', cn: '需要更新'},
      body: {
        en: "To ensure you have the best experience and access to new features, it's necessary to update your app to the latest version. This update includes important bug fixes, performance enhancements, and exciting new features.",
        th: 'เพื่อให้คุณได้ประสบการณ์ที่ดีที่สุดและเข้าถึงคุณสมบัติใหม่ ๆ กรุณาอัปเดตแอปของคุณเป็นเวอร์ชันล่าสุด การอัปเดตนี้รวมถึงการแก้ไขข้อบกพร่องที่สำคัญ ปรับปรุงประสิทธิภาพ และคุณสมบัติใหม่ที่น่าตื่นเต้น',
        cn: '为了确保您拥有最佳体验并访问新功能，必须将您的应用程序更新到最新版本。此更新包括重要的错误修复，性能增强和令人兴奋的新功能。',
      },
    },
  },
};

const storeLink = {
  ios: 'https://apps.apple.com/th/app/one-bangkok/id6475669593',
  android:
    'https://play.google.com/store/apps/details?id=com.onebangkok.prod&pcampaignid=web_share',
};

const homeContent = {
  background_image:
    'https://obk-prod-image.s3.ap-southeast-1.amazonaws.com/1729783724707_z13qko.png',
  enable_announcement: false,
};

const whitelistAnnouncement = {
  title: {en: 'Unauthorized', th: 'Unauthorized'},
  body: {
    en: 'Access is exclusive to whitelist members only, please select an alternative credential to proceed.',
    th: 'Access is exclusive to whitelist members only, please select an alternative credential to proceed.',
  },
};

const blacklistAnnouncement = {
  title: {en: 'Authorization expired', th: 'Authorization expired th'},
  body: {
    en: 'It seems like your email is no longer whitelisted. If you believe this is a mistake please contact your office manager or select an alternative credential to proceed',
    th: 'It seems like your email is no longer whitelisted. If you believe this is a mistake please contact your office manager or select an alternative credential to proceed',
  },
};

const maintenanceWhiteList = {
  allow_whitelist: true,
  device_ids: ['CE4A5B69-058A-4563-A996-40804BAAB407'],
};

const elevatorWaitingTime = 10;

const smartParkingDefaultFloor = 'B1';

const emergencyContact = {
  title: 'Personal escort',
  descriptionTh:
    'ขอใช้บริการพนักงานนำทาง ทีมงานของเรากำลังเดินทางไปช่วยเหลือ กรุณาอยู่ในตำแหน่งที่ท่านอยู่ในขณะนี้',
  descriptionEn:
    'Personal Escort Request. Our team is on the way to assist you. Please remain at your current location.',
  descriptionZh: '',
  phoneNumber: '024835555',
  updatedDate: '2024-10-11T14:18:43.3363979+07:00',
  updatedBy: 'EM TCC+7',
};

const sosContact = {
  title: 'SOS',
  descriptionTh:
    'แจ้งเตือนเหตุฉุกเฉิน ทีมรักษาความปลอดภัยได้รับการแจ้งเตือนแล้ว กรุณาสงบสติอารมณ์และรอคำแนะนำต่อไป',
  descriptionEn:
    'Emergency Alert Activated. Our security team has been notified and will assist you shortly. Please stay calm and await further instructions.',
  descriptionZh: '如遇紧急情况，请立即联系我们以快速解决问题。',
  phoneNumber: '024835519',
  updatedDate: '2020-03-16T09:17:00',
  updatedBy: 'Test System',
};

const directoryContact = [
  {
    categoryId: '35087196-0100-489a-bdb5-c7fd2c6bd4e0',
    category: 'Fire Station',
    contactList: [],
    createdBy: 'test1',
    createdAt: '2024-10-15T17:34:53.2084032+00:00',
    updatedBy: 'test1',
    updatedAt: '2024-10-15T17:34:53.2084139+00:00',
  },
  {
    categoryId: 'c801a343-ab7e-4115-a73f-4ad2c5388e42',
    category: 'Police Station',
    contactList: [],
    createdBy: null,
    createdAt: '0001-01-01T00:00:00',
    updatedBy: 'ponrat',
    updatedAt: '2024-10-22T16:57:06.0909774+00:00',
  },
  {
    categoryId: '6ae6926d-5680-4be8-a4e2-7fa5034707f9',
    category: 'BMO Office Tower',
    contactList: [
      {
        id: 'ad7eb906-e5ae-4b0f-bb3c-d38c10dd3f88',
        phonenumber: '024835563',
        nameEn: 'Tower 3 (Contact no.1)',
        nameTh:
          '\\u0E1D\\u0E48\\u0E32\\u0E22\\u0E1A\\u0E23\\u0E34\\u0E2B\\u0E32\\u0E23\\u0E2D\\u0E32\\u0E04\\u0E32\\u0E23\\u0E2A\\u0E33\\u0E19\\u0E31\\u0E01\\u0E07\\u0E32\\u0E19\\u0E17\\u0E32\\u0E27\\u0E40\\u0E27\\u0E2D\\u0E23\\u0E4C 3 (\\u0E25\\u0E33\\u0E14\\u0E31\\u0E1A 1)',
        nameZh: '-',
        updatedAt: '16/10/2024 00:36:13',
        updatedBy: 'test1',
        seq: -1,
      },
      {
        id: 'c2fc9e5e-b5c0-4370-a0e1-9b9591774297',
        phonenumber: '024835564',
        nameEn: 'Tower 3 (Contact no.2)',
        nameTh:
          '\\u0E1D\\u0E48\\u0E32\\u0E22\\u0E1A\\u0E23\\u0E34\\u0E2B\\u0E32\\u0E23\\u0E2D\\u0E32\\u0E04\\u0E32\\u0E23\\u0E2A\\u0E33\\u0E19\\u0E31\\u0E01\\u0E07\\u0E32\\u0E19\\u0E17\\u0E32\\u0E27\\u0E40\\u0E27\\u0E2D\\u0E23\\u0E4C 3 (\\u0E25\\u0E33\\u0E14\\u0E31\\u0E1A 2)',
        nameZh: '-',
        updatedAt: '16/10/2024 00:38:36',
        updatedBy: 'test1',
        seq: -1,
      },
      {
        id: 'aec646e3-d10a-4ac8-9050-073306a7f3df',
        phonenumber: '024835583',
        nameEn: 'Tower 4 (Contact no.1)',
        nameTh:
          '\\u0E1D\\u0E48\\u0E32\\u0E22\\u0E1A\\u0E23\\u0E34\\u0E2B\\u0E32\\u0E23\\u0E2D\\u0E32\\u0E04\\u0E32\\u0E23\\u0E2A\\u0E33\\u0E19\\u0E31\\u0E01\\u0E07\\u0E32\\u0E19\\u0E17\\u0E32\\u0E27\\u0E40\\u0E27\\u0E2D\\u0E23\\u0E4C 4 (\\u0E25\\u0E33\\u0E14\\u0E31\\u0E1A 1)',
        nameZh: '-',
        updatedAt: '16/10/2024 00:39:15',
        updatedBy: 'test1',
        seq: -1,
      },
      {
        id: 'd252f011-c47a-4a10-b5fd-86202d274602',
        phonenumber: '024835584',
        nameEn: 'Tower 4 (Contact no.2)',
        nameTh:
          '\\u0E1D\\u0E48\\u0E32\\u0E22\\u0E1A\\u0E23\\u0E34\\u0E2B\\u0E32\\u0E23\\u0E2D\\u0E32\\u0E04\\u0E32\\u0E23\\u0E2A\\u0E33\\u0E19\\u0E31\\u0E01\\u0E07\\u0E32\\u0E19\\u0E17\\u0E32\\u0E27\\u0E40\\u0E27\\u0E2D\\u0E23\\u0E4C 4 (\\u0E25\\u0E33\\u0E14\\u0E31\\u0E1A 2)',
        nameZh: '-',
        updatedAt: '24/10/2024 17:24:22',
        updatedBy: 'OneBangkok SuperAdmin',
        seq: -1,
      },
    ],
    createdBy: null,
    createdAt: '0001-01-01T00:00:00',
    updatedBy: 'test1',
    updatedAt: '2024-10-15T17:39:49.8377111+00:00',
  },
];

const paymentSuccessCountDown = 60;
const heartbeatInterval = 30000;
const heartbeatTimeout = 5000;
const ignoreWayfindingCategories: {externalId: string}[] = [];
const wayfindingAmenitiesShortcut: {
  name: {en: string; th: string; zh: string};
  tag: string;
}[] = [
  {
    name: {en: 'Information', th: 'จุดประชาสัมพันธ์', zh: 'Information'},
    tag: 'Information Counter',
  },
  {
    name: {en: 'Restroom', th: 'ห้องน้ำ', zh: 'Restroom'},
    tag: 'restroom',
  },
  {
    name: {en: 'Shuttle Bus', th: 'รถบัสรับ - ส่ง', zh: 'Shuttle Bus'},
    tag: 'Shuttle',
  },
  {
    name: {en: 'MRT', th: 'MRT', zh: 'MRT'},
    tag: 'MRT',
  },
  {
    name: {en: 'Nursing', th: 'ห้องให้นมบุตร', zh: 'Nursing'},
    tag: 'Nursing',
  },
  {
    name: {en: 'Prayer', th: 'ห้องละหมาด', zh: 'Prayer'},
    tag: 'Prayer',
  },
];

const remoteConfigDefaults: any = {
  is_firebase: false,
  app_version: {
    ios: {
      version: '1.13.0',
      updated_at: '2024-07-24T00:00:33.754Z',
    },
    android: {
      version: '1.13.0',
      updated_at: '2024-07-24T00:00:33.754Z',
    },
  },
  contract: {
    call_contract_center: '02-483-5555',
    email_contract_center: 'contactcenter@onebangkok.com',
  },
  app_language: [appLanguage, appLanguageTh],
  building_access: {
    lift_beacon_tag: 'onebangkokapp-frasersprope-lcc',
  },
  ...featureSwitch,
  smart_parking_color: smartParkingColor,
  enable_sso_signin: enableSSOButton,
  enable_building_service: enableBuildingService,
  app_maintenance: appMaintenance,
  directory_contact: directoryContact,
  emergency_contact: emergencyContact,
  sos_contact: sosContact,
  home_content: homeContent,
  app_version_update: appVersionUpdate,
  store_link: storeLink,
  whitelist_announcement: whitelistAnnouncement,
  blacklist_announcement: blacklistAnnouncement,
  elevator_waiting_time: elevatorWaitingTime,
  maintenance_whitelist: maintenanceWhiteList,
  smart_parking_default_floor: smartParkingDefaultFloor,
  payment_success_count_down: paymentSuccessCountDown,
  parking_reservation: {
    late_entry: 30,
    parking_fee: 100,
    timeout_blocker_connection: 30,
    reservation_time_picker_interval: 15,
    reservation_max_time_picker: 24,
    blocker_test_page: false,
  },
  ignore_wayfinding_categories: ignoreWayfindingCategories,
  wayfinding_amenities_shortcut: wayfindingAmenitiesShortcut,
  heartbeat_interval: heartbeatInterval,
  heartbeat_timeout: heartbeatTimeout,
  receipt_fetching_time: 3000,
};

export default remoteConfigDefaults;
