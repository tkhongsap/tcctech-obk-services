// Mock react-native-fs
jest.mock('react-native-fs', () => ({
  readFile: jest.fn().mockImplementation((path) => {
    if (path.includes('en.json')) {
      return Promise.resolve(JSON.stringify({ test: 'Test' }));
    }
    if (path.includes('th.json')) {
      return Promise.resolve(JSON.stringify({ test: 'ทดสอบ' }));
    }
    if (path.includes('cs.json')) {
      return Promise.resolve(JSON.stringify({ test: '测试' }));
    }
    return Promise.resolve('{}');
  }),
  writeFile: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock translation function directly
jest.mock('../src/utils/text', () => ({
  __esModule: true,
  default: jest.fn((key, fallback) => fallback),
  parse: jest.fn(() => ({})),
}));

// Mock i18next
jest.mock('i18next', () => ({
  t: jest.fn((key, fallback) => fallback || key),
  use: jest.fn().mockReturnThis(),
  init: jest.fn(),
}));

// Mock instanceServiceMind
jest.mock('../src/services/residentialService/ServiceMindService', () => ({
  instanceServiceMind: {
    interceptors: {
      request: {
        use: jest.fn(),
      },
    },
  },
}));

// Mock Firebase messaging
jest.mock('@react-native-firebase/messaging', () => ({
  onMessage: jest.fn(),
  setBackgroundMessageHandler: jest.fn(),
}));

// Mock Firebase in-app messaging
jest.mock('@react-native-firebase/in-app-messaging', () => ({
  setMessagesDisplaySuppressed: jest.fn(),
  setAutomaticDataCollectionEnabled: jest.fn(),
}));

// Mock Firebase remote config
jest.mock('@react-native-firebase/remote-config', () => ({
  fetch: jest.fn(),
  activate: jest.fn(),
  getValue: jest.fn(() => ({ asString: () => '' })),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  // @ts-ignore
  GestureHandlerRootView: ({children}) => children,
}));

// Mock react-native-device-info
jest.mock('react-native-device-info', () => ({
  getUniqueId: jest.fn(() => 'unique-id-mock'),
}));

// Mock @react-native-community/netinfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

// Mock react-native-notifier
jest.mock('react-native-notifier', () => ({
  // @ts-ignore
  NotifierWrapper: ({children}) => children,
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  // @ts-ignore
  SafeAreaProvider: ({children}) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureMessage: jest.fn(),
}));

// Mock Firebase analytics
jest.mock('@react-native-firebase/analytics', () => ({
  logEvent: jest.fn(),
}));

// Mock react-native-permissions
jest.mock('react-native-permissions', () => ({
  PERMISSIONS: {
    IOS: {
      CAMERA: 'ios.permission.CAMERA',
      PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY',
    },
    ANDROID: {
      CAMERA: 'android.permission.CAMERA',
      READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
    },
  },
  RESULTS: {
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    GRANTED: 'granted',
    BLOCKED: 'blocked',
  },
  request: jest.fn(() => Promise.resolve('granted')),
  check: jest.fn(() => Promise.resolve('granted')),
}));

// Mock Google Sign-In
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockReturnValue(Promise.resolve(true)),
    signIn: jest.fn().mockReturnValue(Promise.resolve()),
    signOut: jest.fn().mockReturnValue(Promise.resolve()),
    isSignedIn: jest.fn().mockReturnValue(Promise.resolve(false)),
    getCurrentUser: jest.fn().mockReturnValue(Promise.resolve(null)),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 1,
    IN_PROGRESS: 2,
    PLAY_SERVICES_NOT_AVAILABLE: 3,
  },
}));

// Mock Azure Auth
jest.mock('react-native-azure-auth', () => {
  return jest.fn().mockImplementation(() => ({
    webAuth: {
      authorize: jest.fn().mockResolvedValue({ accessToken: 'mockAccessToken' }),
      clearSession: jest.fn().mockResolvedValue(true),
    },
    auth: {
      authorize: jest.fn().mockResolvedValue({ accessToken: 'mockAccessToken' }),
      clearSession: jest.fn().mockResolvedValue(true),
    },
  }));
});

// Mock appLanguageState
jest.mock('../src/states/appLanguage/appLanguageState', () => ({
  currentLanguage: {
    get: jest.fn(() => 'en'), // Mock the current language
  },
}));

// Mock react-native-share
jest.mock('react-native-share', () => ({
  open: jest.fn(() => Promise.resolve()),
  shareSingle: jest.fn(() => Promise.resolve()),
  Social: {
    FACEBOOK: 'facebook',
    TWITTER: 'twitter',
    WHATSAPP: 'whatsapp',
  },
}));

// Mock react-native-bluetooth-state-manager
jest.mock('react-native-bluetooth-state-manager', () => ({
  EVENT_BLUETOOTH_STATE_CHANGE: 'bluetoothStateChange',
  getState: jest.fn(() => Promise.resolve('PoweredOn')),
  onStateChange: jest.fn((callback) => {
    callback('PoweredOn');
    return () => {}; // Return a function to simulate unsubscribe
  }),
}));

// Mock react-native-vision-camera
jest.mock('react-native-vision-camera', () => ({
  useCameraDevices: jest.fn(() => ({
    back: { id: 'back', name: 'Back Camera' },
    front: { id: 'front', name: 'Front Camera' },
  })),
  Camera: jest.fn().mockImplementation(({ children }) => children),
  useCodeScanner: jest.fn(() => ({
    onCodeScanned: jest.fn(),
  })),
}));

// Mock react-native-compressor
jest.mock('react-native-compressor', () => ({
  Image: {
    compress: jest.fn(() => Promise.resolve('compressedImagePath')),
  },
  Video: {
    compress: jest.fn(() => Promise.resolve('compressedVideoPath')),
  },
  Audio: {
    compress: jest.fn(() => Promise.resolve('compressedAudioPath')),
  },
}));

// Mock react-native-blob-util
jest.mock('react-native-blob-util', () => ({
  fs: {
    dirs: {
      DocumentDir: '/mocked/document/dir',
    },
    readFile: jest.fn(() => Promise.resolve('mocked file content')),
    writeFile: jest.fn(() => Promise.resolve()),
  },
  config: jest.fn(() => ({
    fetch: jest.fn(() => Promise.resolve({ path: () => '/mocked/path' })),
  })),
  session: jest.fn(() => ({
    dispose: jest.fn(),
  })),
}));

// Mock react-native-reanimated-carousel
jest.mock('react-native-reanimated-carousel', () => ({
  Carousel: jest.fn().mockImplementation(({ children }) => children),
}));

// Mock @react-native-camera-roll/camera-roll
jest.mock('@react-native-camera-roll/camera-roll', () => ({
  CameraRoll: {
    save: jest.fn(() => Promise.resolve('mockedUri')),
    getPhotos: jest.fn(() => Promise.resolve({ edges: [] })),
  },
  useCameraRoll: jest.fn(() => ({
    photos: [],
    saveToCameraRoll: jest.fn(),
    getPhotos: jest.fn(),
  })),
}));

// Mock react-native-draggable-flatlist
jest.mock('react-native-draggable-flatlist', () => ({
  default: jest.fn().mockImplementation(({ children }) => children),
  RenderItemParams: jest.fn(),
}));

// Mock react-native-sensors
jest.mock('react-native-sensors', () => {
  const mockSensor = {
    subscribe: jest.fn(() => ({
      unsubscribe: jest.fn(),
    })),
  };

  return {
    SensorTypes: {
      accelerometer: 'accelerometer',
      gyroscope: 'gyroscope',
      magnetometer: 'magnetometer',
      barometer: 'barometer',
    },
    setUpdateIntervalForType: jest.fn(),
    accelerometer: mockSensor,
    gyroscope: mockSensor,
    magnetometer: mockSensor,
    barometer: mockSensor,
  };
});

// Mock @react-native-community/geolocation
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn((successCallback, errorCallback) => {
    successCallback({
      coords: {
        latitude: 37.78825,
        longitude: -122.4324,
      },
    });
  }),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  stopObserving: jest.fn(),
}));

// Mock react-native-document-picker
jest.mock('react-native-document-picker', () => ({
  pick: jest.fn(() => Promise.resolve([{ uri: 'mockedUri', type: 'mockedType', name: 'mockedName' }])),
  types: {
    allFiles: 'allFiles',
    images: 'images',
    plainText: 'plainText',
  },
}));

// Mock react-native-view-shot
jest.mock('react-native-view-shot', () => ({
  captureRef: jest.fn(() => Promise.resolve('mockedImageUri')),
})); 

// Mock IconComponent
jest.mock('../src/components/atoms/Icon', () => ({
  __esModule: true,
  default: () => <div />, // Return a simple mock component
}));

// Mock BackIconButton component directly
jest.mock('../src/features/booking/components/BackIconButton', () => ({
  __esModule: true,
  // @ts-ignore
  default: (props) => (
    <div 
    // @ts-ignore
      onPress={() => props.onClick && props.onClick()}
      accessibilityLabel="Back Button"
      testID="back-button"
    >
      Back Button
    </div>
  ),
}));

// Mock AppNavigation completely without requiring the actual module
jest.mock('../src/navigations/AppNavigation', () => ({
  // Mock navigation functions and hooks
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
  
  // Mock screens
  screens: [
    { name: 'Screen1', component: jest.fn() },
    { name: 'Screen2', component: jest.fn() },
  ],
  
  // Mock withLanguageUpdate
  withLanguageUpdate: jest.fn((component) => component),
  
  // Mock applyLanguageUpdateHOC
  applyLanguageUpdateHOC: jest.fn((screens) => {
    // Mock screens with name property
    const mockScreens = screens.map((screen: { name: any; }, index: number) => ({
      ...screen,
      name: screen.name || `Screen${index + 1}`,
    }));
    return mockScreens.reduce((result: { [x: string]: any; }, screen: { name: string | number; }) => {
      result[screen.name] = screen; // Mock the behavior to return the screen as is
      return result;
    }, {});
  }),
  
  // Mock any other exports from AppNavigation that are used in your test
  RootStackParamList: {},
}));