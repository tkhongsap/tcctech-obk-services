import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  CommonActions,
  NavigationProp,
  useNavigation as originalUseNavigation,
} from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import SignUpSuccessfulScreen from '../screens/SignUpSuccessfulScreen';
import DrawerNavigation from './DrawerNavigation';
import LanguageSettingsScreen from '../features/setting/screens/LanguageScreen';
import withLanguageUpdate from '../components/WithLanguageUpdate';
import AccountInfoScreen from '../features/account/screens/AccountInfoScreen';
import FaqScreen from '../features/setting/screens/FaqScreen';
import SignInScreen from '../features/auth/screens/SignInScreen';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import ThemeScreen from '~/screens/ThemeScreen';
import ProfileInfoScreen from '~/features/auth/screens/ProfileInfoScreen';
import SignUpScreen from '~/features/auth/screens/SignUpScreen';
import SignUpConfirmPasswordScreen from '~/features/auth/screens/SignUpConfirmPasswordScreen';
import SignUpCompleteScreen from '~/features/auth/screens/SignUpCompleteScreen';
import AnnouncementScreen from '~/screens/AnnouncementScreen';
import {AnnouncementType, SpecialWidgetType} from '~/components/Announcement';
import ForgottenPasswordScreen from '~/features/auth/screens/ForgottenPasswordScreen';
import Setup2FAScreen from '~/features/auth/screens/Setup2FAScreen';
import ResetPasswordScreen from '~/features/auth/screens/ResetPasswordScreen';
import PasswordChangedScreen from '~/features/auth/screens/PasswordChangedScreen';
import {Config2FAScreen} from '~/features/setting/screens';
import HomeScreen from '~/features/home/screens/HomeScreen';
import LegalDocumentScreen from '~/features/auth/screens/LegalDocumentScreen';
import {OTPVerificationScreen} from '~/features/otp/screens/OTPVerificationScreen';
import TermsAndConScreen from '~/features/auth/screens/TermsAndConScreen';
import SettingScreen from '~/features/setting/screens/SettingScreen';
import {HeaderProps, Modal, buttonColorVariant} from '~/components/molecules';
import FaqQuestionScreen from '~/features/setting/screens/FaqQuestionScreen';
import CurrentPasswordScreen from '~/features/account/screens/CurrentPasswordScreen';
import FaqAnswerScreen from '~/features/setting/screens/FaqAnswerScreen';
import LegalScreen, {LegalType} from '~/features/setting/screens/LegalSceen';
import EditDobScreen from '~/features/account/screens/EditDobScreen';
import ChangeOrSetPasswordScreen from '~/features/account/screens/ChangeOrSetPasswordScreen';
import EditGenderScreen from '~/features/account/screens/EditGenderScreen';
import AddIdentityScreen from '~/features/account/screens/AddIdentityScreen';
import ChangeNameScreen from '~/features/account/screens/ChangeNameScreen';
import IdentityDetailScreen from '~/features/account/screens/IdentityDetailScreen';
import NotificationDetailScreen from '~/features/notification/screens/NotificationDetailScreen';
import AskToSignUpScreen from '~/features/home/screens/AskToSignUpScreen';
import AllNotificationsScreen from '~/features/notification/screens/AllNotificationsScreen';
import NotificationGroupScreen from '~/features/notification/screens/NotificationGroupScreen';
import CreateVisitorPassScreen from '~/features/buildingAccess/screens/CreateVisitorPassScreen';
import VisitorPassScreen from '~/features/buildingAccess/screens/VisitorPassScreen';
import VisitorPassDetailScreen from '~/features/buildingAccess/screens/VisitorPassDetailScreen';
import CreateVPThirdPage from '~/features/buildingAccess/components/createVPThirdPage';
import CallElevatorScreen from '~/features/buildingAccess/screens/CallElevatorScreen';
import SmartParkingScreen from '~/features/buildingAccess/screens/SmartParkingScreen';
import ElevatorWaitingScreen from '~/features/buildingAccess/screens/ElevatorWaitingScreen';
import ElevatorDestinationScreen from '~/features/buildingAccess/screens/ElevatorDestinationScreen';
import ParkingTicketScreen from '~/features/buildingAccess/screens/ParkingTicketScreen';
import BuildingAccessQrScreen from '~/features/buildingAccess/screens/BuildingAccessQrScreen';
import ChangeDefaultFloorScreen from '~/features/account/screens/ChangeDefaultFloorScreen';
import BuildingServiceScreen from '~/features/buildingAccess/screens/BuildingServiceScreen';
import ParkingRedemptionScreen from '~/features/buildingAccess/screens/ParkingRedemptionScreen';
import ParkingRedemptionDetailScreen from '~/features/buildingAccess/screens/ParkingRedemptionDetailScreen';
import RequestServiceScreen from '~/features/buildingAccess/screens/RequestServiceScreen';
import CreateRequestServiceScreen from '~/features/buildingAccess/screens/CreateRequestServiceScreen';
import RequestServiceDetailScreen from '~/features/buildingAccess/screens/RequestServiceDetailScreen';
import {
  SensorIndicatorData,
  ServiceRequestData,
  WrappedResponseACRequestResponseData,
} from 'ob-bms-sdk/dist/api';
import AirQualityScreen from '~/features/airQuality/screens/AirQualityScreen';
import AirQualityDetailScreen from '~/features/airQuality/screens/AirQualityDetailScreen';
import AirConditionerRequestScreen from '~/features/buildingAccess/screens/AirConditionerRequestScreen';
import CreateAirConditionerRequestScreen from '~/features/buildingAccess/screens/CreateAirConditionerRequestScreen';
import AirConditionerRequestDetailScreen from '~/features/buildingAccess/screens/AirConditionerRequestDetailScreen';
import MaintenanceScreen from '~/screens/MaintenanceScteen';
import AppVersionUpdateScreen from '~/screens/AppVersionUpdateScreen';
import NoInternetConnectionScreen from '~/features/general/screens/NoInternetConnectionScreen';
import AnnouncementContactScreen from '~/features/buildingAccess/components/AnnouncementContactScreen';
import {AnnouncementContactType} from '~/components/AnnouncementContact';
import AirQualityDetailInfoScreen from '~/features/airQuality/screens/AirQualityDetailInfoScreen';
import {
  MessageGetIndexResult,
  NotificationSettingResult,
} from 'ob-notification-sdk/dist/api';
import MapScreen from '~/features/shuttleBus/screens/MapScreen';

import {DocumentDetailData} from '~/utils/ob_sdk/services/ob_document/index.interface';
import ParkingTermAndConditionScreen from '~/features/buildingAccess/screens/ParkingTermAndConditionScreen';
const applyLanguageUpdateHOC = (screens: React.ComponentType<any>[]) => {
  return screens.reduce((result: any, screen) => {
    const screenWithLanguageUpdate = withLanguageUpdate(screen);
    result[screen.name] = screenWithLanguageUpdate;
    return result;
  }, {});
};

const screen = applyLanguageUpdateHOC([
  // DrawerNavigation,
  SignUpSuccessfulScreen,
  LanguageSettingsScreen,
  HomeScreen,
  SignInScreen,
  SettingScreen,
  AccountInfoScreen,
  FaqScreen,
  NotificationDetailScreen,
  SignUpConfirmPasswordScreen,
  ThemeScreen,
  ProfileInfoScreen,
  SignUpScreen,
  AnnouncementScreen,
  ForgottenPasswordScreen,
  ChangeOrSetPasswordScreen,
  SignUpCompleteScreen,
  Setup2FAScreen,
  ResetPasswordScreen,
  PasswordChangedScreen,
  Config2FAScreen,
  AskToSignUpScreen,
  LegalDocumentScreen,
  OTPVerificationScreen,
  TermsAndConScreen,
  FaqQuestionScreen,
  CurrentPasswordScreen,
  FaqAnswerScreen,
  LegalScreen,
  EditDobScreen,
  EditGenderScreen,
  AddIdentityScreen,
  ChangeNameScreen,
  IdentityDetailScreen,
  AllNotificationsScreen,
  NotificationGroupScreen,
  CreateVisitorPassScreen,
  VisitorPassScreen,
  VisitorPassDetailScreen,
  CreateVPThirdPage,
  SmartParkingScreen,
  CallElevatorScreen,
  ElevatorWaitingScreen,
  ElevatorDestinationScreen,
  ParkingTicketScreen,
  BuildingAccessQrScreen,
  ChangeDefaultFloorScreen,
  BuildingServiceScreen,
  ParkingRedemptionScreen,
  ParkingRedemptionDetailScreen,
  RequestServiceScreen,
  CreateRequestServiceScreen,
  RequestServiceDetailScreen,
  AirQualityScreen,
  AirQualityDetailScreen,
  AirConditionerRequestScreen,
  CreateAirConditionerRequestScreen,
  AirConditionerRequestDetailScreen,
  MaintenanceScreen,
  AppVersionUpdateScreen,
  NoInternetConnectionScreen,
  AnnouncementContactScreen,
  AirQualityDetailInfoScreen,
  // MapScreen,
  ParkingTermAndConditionScreen,
]);

export type RootStackParamList = {
  SplashScreen: undefined;
  HomeScreen: undefined;
  SignUpScreen: undefined;
  SignUpSuccessfulScreen: undefined;
  LanguageSettingsScreen: undefined;
  SettingScreen: undefined;
  AccountInfoScreen: undefined;
  FaqScreen: undefined;
  FaqQuestionScreen: {
    title: string;
    id: string;
  };
  FaqAnswerScreen: {
    categoryId: string;
    question: string;
    id: string;
  };
  NotificationsScreen: undefined;
  NotificationDetailScreen: {
    messageData?: MessageGetIndexResult;
    id?: string;
  };
  SignInScreen: undefined;
  SignUpConfirmPasswordScreen: {
    title: string;
    header: string;
  };
  ThemeScreen: undefined;
  ProfileInfoScreen: {
    step?: number;
  };
  AnnouncementScreen: {
    type: AnnouncementType;
    title: string;
    message: string;
    buttonText: string;
    screenHook: string;
    messageDescription?: string;
    specialWidget?: SpecialWidgetType;
    data?: any;
    buttonColor?: keyof typeof buttonColorVariant;
  };
  ForgottenPasswordScreen: {
    provider: ProviderType;
  };
  ChangeOrSetPasswordScreen: {header: string; isSetupPassword: boolean};
  SignUpCompleteScreen: undefined;
  Setup2FAScreen: {
    provider: ProviderType;
    sourceScreen?: keyof RootStackParamList;
    newAccount?: boolean;
  };
  ResetPasswordScreen: undefined;
  PasswordChangedScreen: undefined;
  Config2FAScreen: undefined;
  AskToSignUpScreen: undefined;
  LegalDocumentScreen: {header: string; category: string};
  OTPVerificationScreen: {
    headText: {
      tagline?: string;
      title: string;
    };
    description: string;
    identity: {
      identifier: string;
      provider: ProviderType;
    };
    allowChangeIdentifier?: boolean;
    screenHook: string;
    leftAction?: HeaderProps['leftAction'];
    title?: string;
    action?: string;
  };
  TermsAndConScreen: undefined;
  LegalScreen: {
    title: string;
    type: LegalType;
  };
  CurrentPasswordScreen: undefined;
  EditDobScreen: {
    dob?: string;
  };
  EditGenderScreen: undefined;
  AddIdentityScreen: {
    provider: ProviderType;
  };
  ChangeNameScreen: undefined;
  IdentityDetailScreen: {
    header: string;
    identity: {
      identifier: string;
      provider: ProviderType;
      id: string;
    };
  };
  AllNotificationsScreen: undefined;
  NotificationGroupScreen: {
    notificationGroupSetting: NotificationSettingResult[];
  };
  CreateVisitorPassScreen: undefined;
  VisitorPassScreen: undefined;
  VisitorPassDetailScreen: {visitorPassDetail: any};
  CreateVPThirdPage: undefined;
  SmartParkingScreen: undefined;
  CallElevatorScreen: undefined;
  ElevatorWaitingScreen: undefined;
  ElevatorDestinationScreen: {
    lift: string;
    floor: string;
  };
  ParkingTicketScreen: undefined;
  BuildingAccessQrScreen: undefined;
  ChangeDefaultFloorScreen: undefined;
  BuildingServiceScreen: undefined;
  ParkingRedemptionScreen: undefined;
  ParkingRedemptionDetailScreen: {
    token: string;
    internalQr: boolean;
  };
  RequestServiceScreen: undefined;
  CreateRequestServiceScreen: undefined;
  RequestServiceDetailScreen: {data: ServiceRequestData};
  AirQualityScreen: undefined;
  AirQualityDetailScreen: {
    towerName: string;
    towerId: string;
    floorSensorData: SensorIndicatorData[];
  };
  AirConditionerRequestScreen: undefined;
  CreateAirConditionerRequestScreen: undefined;
  AirConditionerRequestDetailScreen: {
    data: WrappedResponseACRequestResponseData;
  };
  MaintenanceScreen: undefined;
  AppVersionUpdateScreen: undefined;
  NoInternetConnectionScreen: undefined;
  AnnouncementContactScreen: {
    titleHeadText: string;
    titleHead?: string;
    tagline: string;
    titleContent: string;
    messageContent: string;
    type: AnnouncementContactType;
  };
  AirQualityDetailInfoScreen: {
    towerName: string;
    selectType: object;
    selectFloor: object;
    floorSensorData: SensorIndicatorData[];
  };
  MapScreen: undefined;
  ParkingTermAndConditionScreen: {
    documentDetailData?: DocumentDetailData;
  };
};
export type StackNavigation = NavigationProp<RootStackParamList>;

export const useNavigation = () => originalUseNavigation<StackNavigation>();

export const removeScreenFromStack = (
  navigation: StackNavigation,
  key: string,
) => {
  navigation.dispatch(state => {
    const routes = state.routes.filter(route => route.key !== key);
    return CommonActions.reset({
      ...state,
      routes,
      index: routes.length - 1,
    });
  });
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <>
      <Modal />

      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          gestureEnabled: true,
          headerShown: false,
          animation: 'slide_from_right',
          orientation: 'portrait',
        }}>
        <Stack.Screen
          options={{headerShown: false, animation: 'fade'}}
          name="SplashScreen"
          component={SplashScreen}
        />
        <Stack.Screen name="HomeScreen" component={screen.HomeScreen} />
        <Stack.Screen name="SignInScreen" component={screen.SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={screen.SignUpScreen} />
        <Stack.Screen
          name="SignUpSuccessfulScreen"
          component={screen.SignUpSuccessfulScreen}
          options={{animation: 'fade'}}
        />
        <Stack.Screen
          name="LanguageSettingsScreen"
          component={screen.LanguageSettingsScreen}
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
        />
        <Stack.Screen
          name="SettingScreen"
          component={screen.SettingScreen}
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
        />
        <Stack.Screen
          name="AccountInfoScreen"
          component={screen.AccountInfoScreen}
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
        />
        <Stack.Screen name="FaqScreen" component={screen.FaqScreen} />
        <Stack.Screen
          name="FaqQuestionScreen"
          component={screen.FaqQuestionScreen}
        />
        <Stack.Screen
          name="FaqAnswerScreen"
          component={screen.FaqAnswerScreen}
        />
        <Stack.Screen
          name="AllNotificationsScreen"
          component={screen.AllNotificationsScreen}
        />
        <Stack.Screen
          name="SignUpConfirmPasswordScreen"
          component={screen.SignUpConfirmPasswordScreen}
        />
        <Stack.Screen name="ThemeScreen" component={screen.ThemeScreen} />
        <Stack.Screen
          name="ProfileInfoScreen"
          component={screen.ProfileInfoScreen}
        />
        <Stack.Screen
          name="AnnouncementScreen"
          component={screen.AnnouncementScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="ForgottenPasswordScreen"
          component={screen.ForgottenPasswordScreen}
        />
        <Stack.Screen
          name="ChangeOrSetPasswordScreen"
          component={screen.ChangeOrSetPasswordScreen}
        />
        <Stack.Screen
          name="SignUpCompleteScreen"
          component={screen.SignUpCompleteScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="Setup2FAScreen" component={screen.Setup2FAScreen} />
        <Stack.Screen
          name="ResetPasswordScreen"
          component={screen.ResetPasswordScreen}
        />
        <Stack.Screen
          name="LegalDocumentScreen"
          component={screen.LegalDocumentScreen}
        />
        <Stack.Screen
          name="PasswordChangedScreen"
          component={screen.PasswordChangedScreen}
        />
        <Stack.Screen
          name="Config2FAScreen"
          component={screen.Config2FAScreen}
        />
        <Stack.Screen
          name="AskToSignUpScreen"
          component={screen.AskToSignUpScreen}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="OTPVerificationScreen"
          component={screen.OTPVerificationScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="TermsAndConScreen"
          component={screen.TermsAndConScreen}
        />
        <Stack.Screen
          name="CurrentPasswordScreen"
          component={screen.CurrentPasswordScreen}
        />
        <Stack.Screen name="LegalScreen" component={screen.LegalScreen} />
        <Stack.Screen name="EditDobScreen" component={screen.EditDobScreen} />
        <Stack.Screen
          name="EditGenderScreen"
          component={screen.EditGenderScreen}
        />
        <Stack.Screen
          name="AddIdentityScreen"
          component={screen.AddIdentityScreen}
        />
        <Stack.Screen
          name="ChangeNameScreen"
          component={screen.ChangeNameScreen}
        />
        <Stack.Screen
          name="IdentityDetailScreen"
          component={screen.IdentityDetailScreen}
        />
        <Stack.Screen
          name="NotificationDetailScreen"
          component={screen.NotificationDetailScreen}
        />
        <Stack.Screen
          name="NotificationGroupScreen"
          component={screen.NotificationGroupScreen}
        />
        <Stack.Screen
          name="CreateVisitorPassScreen"
          component={screen.CreateVisitorPassScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="VisitorPassScreen"
          component={screen.VisitorPassScreen}
        />
        <Stack.Screen
          name="VisitorPassDetailScreen"
          component={screen.VisitorPassDetailScreen}
        />
        <Stack.Screen
          name="CreateVPThirdPage"
          component={screen.CreateVPThirdPage}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="SmartParkingScreen"
          component={screen.SmartParkingScreen}
        />
        <Stack.Screen
          name="CallElevatorScreen"
          component={screen.CallElevatorScreen}
        />
        <Stack.Screen
          name="ElevatorWaitingScreen"
          component={screen.ElevatorWaitingScreen}
        />
        <Stack.Screen
          name="ElevatorDestinationScreen"
          component={screen.ElevatorDestinationScreen}
        />
        <Stack.Screen
          name="ParkingTicketScreen"
          component={screen.ParkingTicketScreen}
        />
        <Stack.Screen
          name="BuildingAccessQrScreen"
          component={screen.BuildingAccessQrScreen}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="ChangeDefaultFloorScreen"
          component={screen.ChangeDefaultFloorScreen}
        />
        <Stack.Screen
          name="BuildingServiceScreen"
          component={screen.BuildingServiceScreen}
        />
        <Stack.Screen
          name="ParkingRedemptionScreen"
          component={screen.ParkingRedemptionScreen}
        />
        <Stack.Screen
          name="ParkingRedemptionDetailScreen"
          component={screen.ParkingRedemptionDetailScreen}
        />
        <Stack.Screen
          name="RequestServiceScreen"
          component={screen.RequestServiceScreen}
        />
        <Stack.Screen
          name="CreateRequestServiceScreen"
          component={screen.CreateRequestServiceScreen}
        />
        <Stack.Screen
          name="RequestServiceDetailScreen"
          component={screen.RequestServiceDetailScreen}
        />
        <Stack.Screen
          name="AirQualityScreen"
          component={screen.AirQualityScreen}
        />
        <Stack.Screen
          name="AirQualityDetailScreen"
          component={screen.AirQualityDetailScreen}
        />
        <Stack.Screen
          name="AirConditionerRequestScreen"
          component={screen.AirConditionerRequestScreen}
        />
        <Stack.Screen
          name="CreateAirConditionerRequestScreen"
          component={screen.CreateAirConditionerRequestScreen}
        />
        <Stack.Screen
          name="AirConditionerRequestDetailScreen"
          component={screen.AirConditionerRequestDetailScreen}
        />
        <Stack.Screen
          name="MaintenanceScreen"
          component={screen.MaintenanceScreen}
        />
        <Stack.Screen
          name="AppVersionUpdateScreen"
          component={screen.AppVersionUpdateScreen}
        />
        <Stack.Screen
          name="NoInternetConnectionScreen"
          component={screen.NoInternetConnectionScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="AnnouncementContactScreen"
          component={screen.AnnouncementContactScreen}
        />
        <Stack.Screen
          name="AirQualityDetailInfoScreen"
          component={screen.AirQualityDetailInfoScreen}
        />
        {/* <Stack.Screen name="MapScreen" component={screen.MapScreen} /> */}
        <Stack.Screen
          name="ParkingTermAndConditionScreen"
          component={screen.ParkingTermAndConditionScreen}
        />
      </Stack.Navigator>
    </>
  );
}
