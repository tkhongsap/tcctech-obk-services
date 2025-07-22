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
import ResidentialSchedulesScreen from '../features/residential/screens/ResidentialSchedulesScreen';
import ResidentialSchedulesScreen_Action, {
  EventScheduleDetail,
} from '../features/residential/screens/ResidentialSchedulesScreen_Action';
import ResidentialSchedulesScreen_AddSchedule, {
  Intent,
} from '../features/residential/screens/ResidentialSchedulesScreen_AddSchedule';
import ResidentialSchedulesScreen_DetailSchedule from '../features/residential/screens/ResidentialSchedulesScreen_DetailSchedule';
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
import {
  AnnouncementType,
  ErrorType,
  SpecialWidgetType,
} from '~/components/Announcement';
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
import {buttonColorVariant, HeaderProps, Modal} from '~/components/molecules';
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
import SmartParkingInfoScreen from '~/features/buildingAccess/screens/SmartParkingInfoScreen';
import ElevatorWaitingScreen from '~/features/buildingAccess/screens/ElevatorWaitingScreen';
import ElevatorDestinationScreen from '~/features/buildingAccess/screens/ElevatorDestinationScreen';
import ParkingTicketScreen from '~/features/buildingAccess/screens/ParkingTicketScreen';
import BuildingAccessQrScreen from '~/features/buildingAccess/screens/BuildingAccessQrScreen';
import ChangeDefaultFloorScreen from '~/features/account/screens/ChangeDefaultFloorScreen';
import BuildingServiceScreen from '~/features/buildingAccess/screens/BuildingServiceScreen';
import ParkingRedemptionScreen from '~/features/buildingAccess/screens/ParkingRedemptionScreen';
import ParkingRedemptionDetailScreen from '~/features/buildingAccess/screens/ParkingRedemptionDetailScreen';
import ParkingRedemptionPaymentMethod from '~/features/buildingAccess/screens/ParkingRedemptionPaymentMethod';
import ParkingRedemptionPaymentPromptPay from '~/features/buildingAccess/screens/ParkingRedemptionPaymentPromptPay';
import ParkingRedemptionPaymentPromptPaySlip from '~/features/buildingAccess/screens/ParkingRedemptionPaymentPromptPaySlip';
import ParkingServiceScreen from '~/features/buildingAccess/screens/ParkingServiceScreen';
import ParkingTrafficAnalyticScreen from '~/features/buildingAccess/screens/ParkingTrafficAnalyticScreen';
import NewRedemptionAnnouncement from '~/features/buildingAccess/screens/NewRedemptionAnnouncement';
import RequestServiceScreen from '~/features/buildingAccess/screens/RequestServiceScreen';
import CreateRequestServiceScreen from '~/features/buildingAccess/screens/CreateRequestServiceScreen';
import RequestServiceDetailScreen from '~/features/buildingAccess/screens/RequestServiceDetailScreen';
import {
  ParkingTicketsIndexTypeEnum,
  SensorIndicatorData,
  ServiceRequestData,
  WrappedOneResponseACRequestResponse,
} from 'ob-bms-sdk/dist/api';
import AirQualityScreen from '~/features/airQuality/screens/AirQualityScreen';
import AirQualityDetailScreen from '~/features/airQuality/screens/AirQualityDetailScreen';
import AirConditionerRequestScreen from '~/features/buildingAccess/screens/AirConditionerRequestScreen';
import CreateAirConditionerRequestScreen from '~/features/buildingAccess/screens/CreateAirConditionerRequestScreen';
import AirConditionerRequestDetailScreen from '~/features/buildingAccess/screens/AirConditionerRequestDetailScreen';
import MaintenanceScreen from '~/screens/MaintenanceScteen';
import AppVersionUpdateScreen from '~/screens/AppVersionUpdateScreen';
import NoInternetConnectionScreen from '~/features/general/screens/NoInternetConnectionScreen';
import {NotificationDeeplink} from '~/features/notification/screens/NotificationDeeplinkWebview';

import AnnouncementContactScreen from '~/features/buildingAccess/components/AnnouncementContactScreen';
import {AnnouncementContactType} from '~/components/AnnouncementContact';
import AirQualityDetailInfoScreen from '~/features/airQuality/screens/AirQualityDetailInfoScreen';
import SustainabilityScreen from '~/features/sustainability/screens/SustainabilityScreen';
import NormalContentScreen from '~/features/sustainability/screens/NormalContentScreen';
import FileDownloadScreen from '~/features/sustainability/screens/FileDownloadScreen';
import DigitalLibraryScreen from '~/features/sustainability/screens/DigitalLibraryScreen';
import DrawerNavigationSustainability from './DrawerNavigationSustainability';
import {
  MessageGetIndexResult,
  NotificationSettingResult,
} from 'ob-notification-sdk/dist/api';
import MapScreen from '~/features/shuttleBus/screens/MapScreen';

import {DocumentDetailData} from '~/utils/ob_sdk/services/ob_document/index.interface';
import ParkingTermAndConditionScreen from '~/features/buildingAccess/screens/ParkingTermAndConditionScreen';
import {DirectoryContact} from '~/features/buildingAccess/screens/DirectoryContact';
import ParkingPaymentScreen from '~/features/buildingAccess/screens/ParkingPaymentScreen';
import RequestCarRetrievalScreen from '~/features/buildingAccess/screens/RequestCarRetrievalScreen';
import ResidentialHomeScreen from '~/features/residential/screens/ResidentialHomeScreen';
import DirectoryContactScreen from '~/features/residential/screens/DirectoryContactScreen';
import ResidentialWelcomeScreen from '~/features/residential/screens/ResidentialWelcomeScreen';
import ResidentialRoomOrder from '~/features/residential/screens/ResidentialRoomOrder';
import ResidentialPDPAScreen from '~/features/residential/screens/ResidentialPDPAScreen';
import HouseRuleScreen from '../features/residential/screens/HouseRuleScreen';
import EmergencyScreen from '../features/residential/screens/EmergencyScreen';
import AnnouncementsScreen from '~/features/residential/screens/AnnouncementsScreen';
import AnnouncementDetailScreen from '~/features/residential/screens/AnnouncementDetailScreen';
import ViewPDFScreen from '~/features/residential/screens/ViewPDFScreen';
import ResidentialModal from '~/features/residential/components/ResidentialModal';
import ScenesScreen from '~/features/residential/screens/ScenesScreen';
import AutomationHomeScreen from '~/features/residential/screens/AutomationHomeScreen';
import AddSceneScreen from '~/features/residential/screens/AddSceneScreen';
import AutomationSettingScreen from '~/features/residential/screens/AutomationSettingScreen';
import ResidentialManageMyHomeScreen from '~/features/residential/screens/ResidentialManageMyhomeScreen';
import ResidentialRenameScreen from '~/features/residential/screens/ResidentialRenameScreen';
import SettingSceneScreen from '~/features/residential/screens/SettingSceneScreen';
import SettingEditSceneScreen from '~/features/residential/screens/SettingEditSceneScreen';
import SceneSuccessfulScreen from '~/features/residential/screens/SceneSuccessfulScreen';
import ResidentialSceneRename from '~/features/residential/screens/ResidentialSceneRename';
import SettingAddSceneScreen from '~/features/residential/screens/SettingAddSceneScreen';
import ResidentialRoomScreen from '~/features/residential/screens/ResidentialRoomScreen';
import ResidentialChangeTemperature from '~/features/residential/screens/ResidentialChangeTemperature';
import ResidentialChangeTemperature_Edit from '~/features/residential/screens/ResidentialChangeTemperature_Edit';
import ResidentialChangeTemperature_AddNewSet from '~/features/residential/screens/ResidentialChangeTemperature_AddNewSet';
import ResidentialChangeTemperature_EditCustom from '~/features/residential/screens/ResidentialChangeTemperature_EditCustom';
import NewActionSchedule from '~/features/residential/screens/NewActionSchedule';
import TemperatureSchedule from '~/features/residential/screens/TemperatureSchedule';
import ModifyTimeSlot from '~/features/residential/screens/ModifyTimeSlot';
import AddTimeSlot from '~/features/residential/screens/AddTimeSlot';
import ActionScheduleDuplicate from '../features/residential/screens/ActionScheduleDuplicate';
import ActionScheduleRename from '~/features/residential/screens/ActionScheduleRename';
import CreateScheduleWeek from '~/features/residential/screens/CreateScheduleWeek';
import CreateScheduleWeekDays from '~/features/residential/screens/CreateScheduleWeekDays';
import CreateScheduleWeekend from '~/features/residential/screens/CreateScheduleWeekend';
import CreateScheduleSaturday from '~/features/residential/screens/CreateScheduleSaturday';
import CreateScheduleSunday from '~/features/residential/screens/CreateScheduleSunday';
import CreateScheduleCooling from '~/features/residential/screens/CreateScheduleCooling';
import CreateCoolingSchedule from '~/features/residential/screens/CreateCoolingSchedule';
import TemperatureScheduleRename from '~/features/residential/screens/TemperatureScheduleRename';
import TemperatureScheduleDuplicate from '~/features/residential/screens/TemperatureScheduleDuplicate';
import CreateCoolingScheduleWelcome from '~/features/residential/screens/CreateCoolingSchedule_Welcome';
import CreateCoolingScheduleSuccessful from '~/features/residential/screens/CreateCoolingSchedule_Successful';
import ResidentialTemperatureSchedulesDay from '~/features/residential/screens/ResidentialTemperatureSchedulesDay';
import PropertyScreen from '~/features/residential/screens/PropertyScreen';
import PropertyDetailScreen, {
  ParkingQuotaGrouped,
} from '~/features/residential/screens/PropertyDetailScreen';
import MaintenanceCreate from '~/features/residential/screens/MaintenanceCreate';
import ResidentialMaintenanceScreen from '~/features/residential/screens/MaintenanceScreen';
import ElevatorScreen from '~/features/residential/screens/ElevatorScreen';
import ElevatorFloorSelectionScreen from '~/features/residential/screens/ElevatorFloorSelectionScreen';
import ResidentialElevatorWaitingScreen from '~/features/residential/screens/ResidentialElevatorWaitingScreen';
import ResidentialElevatorErrorScreen from '~/features/residential/screens/ResidentialElevatorErrorScreen';

import MaintenanceDetailScreen, {
  MaintenanceDetail,
} from '~/features/residential/screens/MaintenanceDetailScreen';
import AnnouncementResidentialScreen from '~/screens/AnnouncementResidentialScreen';
import FeedbackScreen from '~/features/residential/screens/FeedbackScreen';
import FeedbackDetailScreen, {
  FeedbackDetail,
} from '~/features/residential/screens/FeedbackDetailScreen';
import CreateFeedbackScreen from '~/features/residential/screens/CreateFeedbackScreen';
import UnderDevelopment from '~/features/residential/screens/UnderDevelopment';
import RestrictedAccessScreen from '~/features/residential/screens/RestrictedAccessScreen';
import ParcelBoxScreen from '~/features/residential/screens/ParcelBoxScreen';
import ParcelBoxDetailScreen from '~/features/residential/screens/ParcelBoxDetailScreen';

import VisitorPassHomeScreen from '~/features/buildingAccess/screens/VisitorPassHomeScreen';
import {UnitDetail} from '~/states/residentialTenant/residentialTenantState';
import BuildingAccessModal from '~/features/buildingAccess/components/buildingAccessModal';
import CarParkPaymentDetailScreen from '~/features/buildingAccess/screens/CarParkPaymentDetailScreen';
import ResidentialDrawerNavigation from '~/features/residential/components/ResidentialDrawerNavigation';

//Service Request
import ServiceRequestHomeScreen from '~/features/residential/screens/ServiceRequestHomeScreen';
import ServiceRequestDetailScreen, {
  ServiceRequest,
} from '~/features/residential/screens/ServiceRequestDetailScreen';
import ServiceRequestCreateScreen from '~/features/residential/screens/ServiceRequestCreateScreen';

//Live Chat
import LiveChatScreen from '~/features/residential/screens/LiveChatScreen';

// Amenity Booking
import AmenityBookingHomeScreen from '~/features/residential/screens/AmenityBookingHomeScreen';
import AmenityBookingCreateScreen from '~/features/residential/screens/AmenityBookingCreateScreen';
import AmenityBookingDetailScreen, {
  AmenityBooking,
} from '~/features/residential/screens/AmenityBookingDetailScreen';

import {
  CoolingSchedule,
  EventSchedule,
  Room,
  Scenario,
} from '~/states/residentialSchedule/residentialScheduleState';
import ArtCultureDrawerNavigation from './ArtCultureDrawerNavigation';
import ArtCultureLandingScreen from '~/features/artCulture/screens/ArtCultureLandingScreen';
import ArtCultureFaqsScreen from '~/features/artCulture/screens/ArtCultureFaqsScreen';
import ArtCultureArtCScreen from '~/features/artCulture/screens/ArtCultureArtCScreen';
import ArtCultureArtCCategoryScreen from '~/features/artCulture/screens/ArtCultureArtCCategoryScreen';
import ArtCultureSearchProgramScreen from '~/features/artCulture/screens/ArtCultureSearchProgramScreen';
import ArtCultureProgramScreen from '~/features/artCulture/screens/ArtCultureProgramScreen';
import ArtCultureAddOnScreen from '~/features/artCulture/screens/ArtCultureAddOnScreen';
import ArtCultureTagScreen from '~/features/artCulture/screens/ArtCultureTagScreen';
import ArtCultureArtMapScreen from '~/features/artCulture/screens/ArtCultureArtMapScreen';
import ArtCultureBookmarkScreen from '~/features/artCulture/screens/ArtCultureBookmark';
import WalkingSearchScreen from '~/features/sustainability/screens/WalkingSearchScreen';
import WalkingSelectRouteScreen from '~/features/sustainability/screens/WalkingSelectRouteScreen';
import WalkingMapRouteScreen from '~/features/sustainability/screens/WalkingMapRouteScreen';

import ResidentialBuildingAccessQrScreen from '~/features/residential/visitorPass/screens/ResidentBuildingAccessQrScreen';
import ResidentialVisitorPassScreen, {
  VisitorPass,
} from '~/features/residential/visitorPass/screens/ResidentialVisitorPassScreen';
import ResidentialCreateVisitorPassScreen from '~/features/residential/visitorPass/screens/ResidentialCreateVisitorPassScreen';
import ResidentialCameraDisableScreen from '~/features/residential/visitorPass/screens/ResidentialCameraDisableScreen';
import ResidentialParkingRedemptionScreen from '~/features/residential/visitorPass/screens/ResidentialParkingRedemptionScreen';
import ResidentialInternetNotConnectionScreen from '~/features/residential/screens/ResidentialInternetNotConnectionScreen';
import ResidentialParkingRedemptionDetailScreen from '~/features/residential/visitorPass/screens/ResidentialParkingRedemptionDetailScreen';
import ResidentialCarParkPaymentDetailScreen from '~/features/residential/visitorPass/screens/ResidentialCarParkPaymentDetailScreen';
import ResidentialCarParkTermAndConditionScreen from '~/features/residential/visitorPass/screens/ResidentialCarParkTermAndConditionScreen';
import ResidentialCarParkPaymentScreen from '~/features/residential/visitorPass/screens/ResidentialCarParkPaymentScreen';
// import ResidentialCarParkPaymentScreen from '~/features/residential/carParkPayment/ResidentialCarParkPaymentScreen';

import ResidentialRedemptionAnnouncement from '~/features/residential/visitorPass/screens/ResidentialRedemptionAnnouncement';
import ResidentialVisitorPassDetailScreen from '~/features/residential/visitorPass/screens/ResidentialVisitorPassDetailScreen';
import ResidentialVisitorPassHomeScreen from '~/features/residential/visitorPass/screens/ResidentialVisitorPassHomeScreen';
import ResidentialParkingRedemptionPaymentPromptPaySlip from '~/features/residential/visitorPass/screens/ResidentialParkingRedemptionPaymentPromptPaySlip';
import ResidentialParkingRedemptionPaymentMethod from '~/features/residential/visitorPass/screens/ResidentialParkingRedemptionPaymentMethod';
import ActionScheduleWelcome from '~/features/residential/screens/ActionScheduleWelcome';
import CoolingScheduleWelcome from '~/features/residential/screens/CoolingScheduleWelcome';
import {
  CoolingScheduleDetail,
  ShortDay,
} from '~/features/residential/components/FacilitiesList';

import AmenitiesScreen from '~/features/wayfinding/screens/AmenitiesScreen';
import {AccessLocalInformation} from '~/features/localInformation/screens/AccessLocalInformation';
import {AccessLocalInformationContentDetail} from '~/features/localInformation/screens/AccessLocalInformationContentDetail';
import {AccessLocalInformationUrl} from '~/features/localInformation/screens/AccessLocalInformationUrl';

//Marcom
import MainPageScreen from '~/features/marcom/screens/MainPageScreen';
import AllWhatHappenScreen from '~/features/marcom/screens/AllWhatHappenScreen';
import DrawerNavigationMarcom from './DrawerNavigationMarcom';
import MarcomContentScreen from '~/features/marcom/screens/MarcomContentScreen';
import {AllEvents} from '~/features/home/screens/AllEvent';
import {EventDetail} from '~/features/home/screens/EventDetail';
import ResidentialAddActionScheduleScreen from '~/features/residential/screens/ResidentialAddActionScheduleScreen';
import ResidentialEditActionScheduleScreen from '~/features/residential/screens/ResidentialEditActionScheduleScreen';
import ResidentialLiveChatScreen from '~/features/residential/screens/ResidentialLiveChatScreen';
import ResidentialLiveChatPreviewScreen from '~/features/residential/screens/ResidentialLiveChatPreviewScreen';
import ChangeUnitDefaultResidentialScreen from '~/features/residential/screens/ChangeUnitDefaultResidentialScreen';
import {Message} from '~/features/residential/components/LiveChatMessages';
import ResidentialAnnouncementImagePreviewScreen from '~/features/residential/screens/ResidentialAnnouncementImagePreviewScreen';
import ResidentialParcelBoxImagePreviewScreen from '~/features/residential/screens/ResidentialParcelBoxImagePreviewScreen';

//booking art-c
import BookingStep1Screen from '~/features/booking/screens/BookingStep1Screen';
import BookingSummaryScreen from '~/features/booking/screens/BookingSummaryScreen';
import MyTicketScreen from '~/features/booking/screens/MyTicketScreen';
import OrderCompleteScreen from '~/features/booking/screens/OrderCompleteScreen';
import TicketScreen from '~/features/booking/screens/TicketScreen';
import HouseRulesCategoriesScreen, {
  HouseRuleCategory,
} from '~/features/residential/screens/HouseRulesCategoriesScreen';
import WayFindingScreen from '~/features/wayfinding/screens/WayFindingScreen';
import ResidentialPreviewImageScreen from '~/features/residential/screens/ResidentialPreviewImageScreen';
import ResidentialTicketInvalidScreen from '~/features/residential/visitorPass/screens/ResidentialTicketInvalidScreen';
import ImportPhysicalParkingTicketScreen from '~/features/buildingAccess/screens/ImportPhysicalParkingTicketScreen';
import ImportPhysicalParkingDetailScreen from '~/features/buildingAccess/screens/ImportPhysicalParkingDetailScreen';

import DeeplinkWebview from '~/screens/DeeplinkWebview';
import QuestionnaireHomeScreen from '~/features/residential/questionnaire/screens/QuestionnaireHomeScreen';
import QuestionnaireDetailScreen, {
  TQuestionnaire,
} from '~/features/residential/questionnaire/screens/QuestionnaireDetailScreen';
import QuestionnaireCreateScreen from '~/features/residential/questionnaire/screens/QuestionnaireCreateScreen';
import ResidentialAmenityBookingAvailableTimeScreen, {
  TAvailableTimeListSelect,
} from '~/features/residential/screens/ResidentialAmenityBookingAvailableTimeScreen';
import BuildingUnusualReportScreen from '~/features/marcom/screens/BuildingUnusualReportScreen';
import ParkingAllRecieptScreen from '~/features/buildingAccess/screens/ParkingAllRecieptScreen';
import {ParkingPaymentAndRedemptionScreen} from '~/features/buildingAccess/screens/ParkingPaymentAndRedemptionScreen';
import ParkingRedemptionCameraScreen from '~/features/buildingAccess/screens/ParkingRedemptionCameraScreen';
import ParkingAllowCameraOrGallery from '~/features/buildingAccess/screens/ParkingAllowCameraOrGallery';

const applyLanguageUpdateHOC = (screens: React.ComponentType<any>[]) => {
  return screens.reduce((result: any, screen) => {
    const screenWithLanguageUpdate = withLanguageUpdate(screen);
    result[screen.name] = screenWithLanguageUpdate;
    return result;
  }, {});
};

const screen = applyLanguageUpdateHOC([
  DrawerNavigation,
  SignUpSuccessfulScreen,
  LanguageSettingsScreen,
  HomeScreen,
  SettingScreen,
  AccountInfoScreen,
  FaqScreen,
  NotificationDetailScreen,
  SignInScreen,
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
  NotificationDeeplink,
  NotificationGroupScreen,
  CreateVisitorPassScreen,
  VisitorPassScreen,
  VisitorPassDetailScreen,
  CreateVPThirdPage,
  SmartParkingScreen,
  SmartParkingInfoScreen,
  CallElevatorScreen,
  ElevatorWaitingScreen,
  ElevatorDestinationScreen,
  ParkingTicketScreen,
  ImportPhysicalParkingDetailScreen,
  ParkingServiceScreen,
  BuildingAccessQrScreen,
  ChangeDefaultFloorScreen,
  BuildingServiceScreen,
  ImportPhysicalParkingTicketScreen,
  ParkingRedemptionScreen,
  ParkingRedemptionDetailScreen,
  ParkingRedemptionPaymentMethod,
  ParkingRedemptionPaymentPromptPay,
  ParkingRedemptionPaymentPromptPaySlip,
  ParkingTrafficAnalyticScreen,
  NewRedemptionAnnouncement,
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
  SustainabilityScreen,
  NormalContentScreen,
  FileDownloadScreen,
  DigitalLibraryScreen,
  DrawerNavigationSustainability,
  MapScreen,
  ParkingTermAndConditionScreen,
  DirectoryContact,
  ParkingPaymentScreen,
  RequestCarRetrievalScreen,
  ResidentialHomeScreen,
  DirectoryContactScreen,
  ResidentialWelcomeScreen,
  ResidentialManageMyHomeScreen,
  ResidentialRenameScreen,
  ResidentialRoomOrder,
  ResidentialPDPAScreen,
  HouseRuleScreen,
  EmergencyScreen,
  AnnouncementsScreen,
  AnnouncementDetailScreen,
  ViewPDFScreen,
  ScenesScreen,
  AutomationHomeScreen,
  AddSceneScreen,
  AutomationSettingScreen,
  SettingSceneScreen,
  SettingEditSceneScreen,
  SceneSuccessfulScreen,
  ResidentialSchedulesScreen,
  ResidentialSchedulesScreen_Action,
  ResidentialSchedulesScreen_AddSchedule,
  ResidentialSchedulesScreen_DetailSchedule,
  ResidentialSceneRename,
  SettingAddSceneScreen,
  ResidentialRoomScreen,
  ResidentialChangeTemperature,
  ResidentialChangeTemperature_Edit,
  ResidentialChangeTemperature_AddNewSet,
  ResidentialChangeTemperature_EditCustom,
  NewActionSchedule,
  TemperatureSchedule,
  ModifyTimeSlot,
  AddTimeSlot,
  ActionScheduleRename,
  ActionScheduleDuplicate,
  CreateScheduleWeek,
  CreateScheduleWeekDays,
  CreateScheduleWeekend,
  CreateScheduleSaturday,
  CreateScheduleSunday,
  CreateScheduleCooling,
  CreateCoolingSchedule,
  TemperatureScheduleRename,
  TemperatureScheduleDuplicate,
  CreateCoolingScheduleWelcome,
  CreateCoolingScheduleSuccessful,
  ResidentialTemperatureSchedulesDay,
  VisitorPassHomeScreen,
  PropertyScreen,
  PropertyDetailScreen,
  MaintenanceCreate,
  MaintenanceDetailScreen,
  ResidentialMaintenanceScreen,
  ElevatorScreen,
  ElevatorFloorSelectionScreen,
  ResidentialElevatorWaitingScreen,
  ResidentialElevatorErrorScreen,
  AnnouncementResidentialScreen,
  CarParkPaymentDetailScreen,
  FeedbackScreen,
  FeedbackDetailScreen,
  CreateFeedbackScreen,
  UnderDevelopment,
  RestrictedAccessScreen,
  ParcelBoxScreen,
  ParcelBoxDetailScreen,
  ResidentialDrawerNavigation,
  ServiceRequestHomeScreen,
  ServiceRequestDetailScreen,
  ServiceRequestCreateScreen,
  ParkingAllRecieptScreen,
  ParkingPaymentAndRedemptionScreen,
  ParkingRedemptionCameraScreen,
  ParkingAllowCameraOrGallery,
  // Way finding
  WayFindingScreen,
  AmenitiesScreen,
  // Residential
  ResidentialBuildingAccessQrScreen,
  ResidentialVisitorPassScreen,
  ResidentialCreateVisitorPassScreen,
  ResidentialCameraDisableScreen,
  ResidentialParkingRedemptionScreen,
  ResidentialInternetNotConnectionScreen,
  ResidentialParkingRedemptionDetailScreen,
  ResidentialCarParkPaymentDetailScreen,
  ResidentialCarParkTermAndConditionScreen,
  ResidentialCarParkPaymentScreen,
  ResidentialRedemptionAnnouncement,
  ResidentialVisitorPassDetailScreen,
  ResidentialVisitorPassHomeScreen,
  ResidentialParkingRedemptionPaymentMethod,
  ResidentialParkingRedemptionPaymentPromptPaySlip,
  CoolingScheduleWelcome,
  ActionScheduleWelcome,
  ResidentialAddActionScheduleScreen,
  ResidentialEditActionScheduleScreen,
  ResidentialLiveChatScreen,
  ResidentialLiveChatPreviewScreen,
  ResidentialAnnouncementImagePreviewScreen,
  ResidentialParcelBoxImagePreviewScreen,
  HouseRulesCategoriesScreen,
  ResidentialPreviewImageScreen,
  ResidentialTicketInvalidScreen,

  // Art and Culture
  ArtCultureDrawerNavigation,
  ArtCultureLandingScreen,
  ArtCultureFaqsScreen,
  ArtCultureArtCScreen,
  ArtCultureArtCCategoryScreen,
  ArtCultureSearchProgramScreen,
  ArtCultureProgramScreen,
  ArtCultureAddOnScreen,
  ArtCultureTagScreen,
  ArtCultureArtMapScreen,
  ArtCultureBookmarkScreen,
  WalkingSearchScreen,
  WalkingSelectRouteScreen,
  WalkingMapRouteScreen,
  AccessLocalInformation,
  AccessLocalInformationContentDetail,
  AccessLocalInformationUrl,
  //Marcom
  MainPageScreen,
  AllWhatHappenScreen,
  DrawerNavigationMarcom,
  MarcomContentScreen,
  AllEvents,
  EventDetail,

  //Live Chat
  LiveChatScreen,

  //Amenity Booking
  AmenityBookingHomeScreen,
  AmenityBookingCreateScreen,
  AmenityBookingDetailScreen,

  ChangeUnitDefaultResidentialScreen,

  //My Ticket
  OrderCompleteScreen,
  MyTicketScreen,
  TicketScreen,
  BookingStep1Screen,
  BookingSummaryScreen,

  DeeplinkWebview,

  // Questionnaire
  QuestionnaireHomeScreen,
  QuestionnaireDetailScreen,
  QuestionnaireCreateScreen,
  BuildingUnusualReportScreen,
  ResidentialAmenityBookingAvailableTimeScreen,
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
    errorType?: ErrorType;
    errorReason?: string;
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
  NotificationDeeplink: {url: string};
  CreateVisitorPassScreen: undefined;
  VisitorPassScreen: undefined;
  VisitorPassDetailScreen: {visitorPassDetail: any};
  CreateVPThirdPage: undefined;
  SmartParkingScreen: undefined;
  SmartParkingInfoScreen: {
    parkingLots: any;
    areaId?: string;
    floorId?: string;
    nameZoneOrFloor?: string;
  };
  CallElevatorScreen: undefined;
  ElevatorWaitingScreen: undefined;
  ElevatorDestinationScreen: {
    lift: string;
    floor: string;
  };
  ParkingTicketScreen: undefined;
  ParkingServiceScreen: undefined;
  BuildingAccessQrScreen: undefined;
  ChangeDefaultFloorScreen: undefined;
  BuildingServiceScreen: undefined;
  ParkingRedemptionScreen: {
    hookFrom: 'CAR_PARK_PAYMENT' | 'REDEMPTION_CAR_PARK';
  };
  ParkingRedemptionDetailScreen: {
    token: string;
    internalQr: boolean;
  };
  ParkingRedemptionPaymentMethod: undefined;
  ParkingRedemptionPaymentPromptPay: undefined;
  ParkingRedemptionPaymentPromptPaySlip: undefined;
  ParkingTrafficAnalyticScreen: undefined;
  ParkingAllRecieptScreen: {
    parkingDetailId: string;
  };
  NewRedemptionAnnouncement: undefined;
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
    data: WrappedOneResponseACRequestResponse;
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
    towerId: string;
    towerName: string;
    selectType: object;
    selectFloor: object;
    floorSensorData: SensorIndicatorData[];
  };
  SustainabilityScreen: undefined;
  NormalContentScreen: {
    id: string;
    isBanner?: boolean;
  };
  FileDownloadScreen: {
    id: string;
  };
  DigitalLibraryScreen: undefined;
  MapScreen: undefined;
  ParkingTermAndConditionScreen: {
    documentDetailData?: DocumentDetailData;
  };
  DirectoryContact: undefined;
  ParkingPaymentScreen: {
    logId: string;
    fee: number;
  };
  RequestCarRetrievalScreen: {
    valetId: number;
  };
  ResidentialHomeScreen: undefined;
  DirectoryContactScreen: undefined;
  ResidentialWelcomeScreen: undefined;
  ResidentialManageMyHomeScreen: undefined;
  ResidentialRenameScreen: undefined;
  ResidentialRoomOrder: undefined;
  ResidentialPDPAScreen: undefined;
  EmergencyScreen: {phone: string};
  AnnouncementsScreen: undefined;
  AnnouncementDetailScreen: {
    id: string;
    title: string;
    imageUrl: string | null;
    description: string;
  };
  HouseRuleScreen: {category: HouseRuleCategory};
  ViewPDFScreen: {url: string; title: string};
  ScenesScreen: undefined;
  AutomationHomeScreen: undefined;
  AddSceneScreen: undefined;
  AutomationSettingScreen: undefined;
  SettingSceneScreen: undefined;
  SettingEditSceneScreen: undefined;
  SceneSuccessfulScreen: undefined;
  ResidentialSchedulesScreen: undefined;
  ResidentialSchedulesScreen_Action: {
    selectedDay: ShortDay;
  };
  ResidentialSchedulesScreen_AddSchedule: {
    intent: Intent;
    scheduleId: string;
    selectedDay: ShortDay;
  };
  ResidentialSchedulesScreen_DetailSchedule: undefined;
  ResidentialSceneRename: undefined;
  SettingAddSceneScreen: undefined;
  ResidentialRoomScreen: {
    title: string;
    module: any;
    homeId: string;
    temperature: number;
  };
  ResidentialChangeTemperature: undefined;
  NewActionSchedule: {schedules: any};
  ModifyTimeSlot: {
    scheduleDetail: CoolingScheduleDetail;
    selectedDay: ShortDay;
    selectedIndex: number;
  };
  AddTimeSlot: {
    scheduleDetail: CoolingScheduleDetail;
    selectedDay: ShortDay;
  };
  TemperatureSchedule: undefined;
  ActionScheduleRename: {
    schedules: EventSchedule[];
    schedule: EventSchedule;
  };
  ActionScheduleDuplicate: undefined;
  CreateScheduleWeek: undefined;
  CreateScheduleWeekDays: undefined;
  CreateScheduleWeekend: undefined;
  CreateScheduleSaturday: undefined;
  CreateScheduleSunday: undefined;
  CreateScheduleCooling: {timetable: any[]};
  CreateCoolingSchedule: {schedules: any};
  TemperatureScheduleRename: {
    schedules: CoolingSchedule[];
    schedule: CoolingSchedule;
  };
  TemperatureScheduleDuplicate: undefined;
  CreateCoolingScheduleWelcome: undefined;
  CreateCoolingScheduleSuccessful: undefined;
  ResidentialTemperatureSchedulesDay: {
    selectedSchedule: CoolingSchedule;
    selectedDay: ShortDay;
  };
  ResidentialChangeTemperature_Edit: undefined;
  ResidentialChangeTemperature_AddNewSet: undefined;
  ResidentialChangeTemperature_EditCustom: undefined;
  PropertyScreen: undefined;
  PropertyDetailScreen: {
    property: UnitDetail;
    parkingQuotaGroup: ParkingQuotaGrouped;
  };
  MaintenanceCreate: undefined;
  AnnouncementResidentialScreen: {
    type: AnnouncementType;
    title: string;
    message: string;
    buttonText: string;
    screenHook: string;
    messageDescription?: string;
    specialWidget?: SpecialWidgetType;
    data?: any;
    buttonColor?: keyof typeof buttonColorVariant;
    buttonCenter?: string;
    emailSupport?: string;
    telSupport?: string;
    onPressBack?: () => void;
  };
  ResidentialMaintenanceScreen: undefined;
  ElevatorScreen: undefined;
  ElevatorFloorSelectionScreen: {property: UnitDetail; personID: string};
  ResidentialElevatorWaitingScreen: {locationID: string; personID: string};
  ResidentialElevatorErrorScreen: undefined;

  MaintenanceDetailScreen: {maintenance: MaintenanceDetail};
  FeedbackScreen: undefined;
  FeedbackDetailScreen: {feedback: FeedbackDetail};
  CreateFeedbackScreen: undefined;
  UnderDevelopment: undefined;
  RestrictedAccessScreen: {
    title: string;
  };
  ParcelBoxScreen: undefined;
  ParcelBoxDetailScreen: {id: string};
  ImportPhysicalParkingTicketScreen: undefined;
  ImportPhysicalParkingDetailScreen: {
    logId: string;
  };
  ParkingPaymentAndRedemptionScreen: {
    logId: string;
    fee: number;
  };
  ParkingRedemptionCameraScreen: {parkingDetailId: string; fee: number};
  ParkingAllowCameraOrGallery: {type: 'camera' | 'gallery'};

  // visitor
  VisitorPassHomeScreen: undefined;
  CarParkPaymentDetailScreen: {
    token: string;
    internalQr: boolean;
  };
  ResidentialDrawerNavigation: undefined;
  ServiceRequestHomeScreen: undefined;
  ServiceRequestDetailScreen: {request: ServiceRequest};
  ServiceRequestCreateScreen: undefined;
  WayFindingScreen: undefined;
  AmenitiesScreen: {
    amenities: {name: string; floor: string}[];
    callBack: (amenity?: {name: string; floor: string}) => void;
  };
  ResidentialBuildingAccessQrScreen: undefined;
  ResidentialVisitorPassScreen: undefined;
  ResidentialCreateVisitorPassScreen: undefined;
  ResidentialCameraDisableScreen: undefined;
  ResidentialParkingRedemptionScreen: {hookFrom: string};
  ResidentialInternetNotConnectionScreen: undefined;
  ResidentialParkingRedemptionDetailScreen: {
    token: string;
    internalQr: boolean;
  };
  ResidentialCarParkPaymentDetailScreen: {
    token: string;
    internalQr: boolean;
  };
  ResidentialCarParkTermAndConditionScreen: {
    documentDetailData?: DocumentDetailData;
  };
  ResidentialCarParkPaymentScreen: {
    ticketId: string;
    ticketType: ParkingTicketsIndexTypeEnum;
    fee: number;
    logId: string;
  };
  ResidentialRedemptionAnnouncement: undefined;
  ResidentialVisitorPassDetailScreen: {visitorPass: VisitorPass};
  ResidentialVisitorPassHomeScreen: undefined;
  ResidentialParkingRedemptionPaymentMethod: undefined;
  ResidentialParkingRedemptionPaymentPromptPaySlip: undefined;
  ActionScheduleWelcome: undefined;
  CoolingScheduleWelcome: undefined;
  ResidentialAddActionScheduleScreen: {
    id: string;
    schedule: EventScheduleDetail;
    selectedDay: ShortDay;
    rooms: Room[];
    scenarios: Scenario[];
  };
  ResidentialEditActionScheduleScreen: {
    id: string;
    schedule: EventScheduleDetail;
    selectedDay: ShortDay;
    selectedIndex: number;
    selectedZoneId: number;
    rooms: Room[];
    scenarios: Scenario[];
  };
  ResidentialLiveChatScreen: {conciergeAvatar: string};
  ResidentialLiveChatPreviewScreen: {message: Message};
  ResidentialAnnouncementImagePreviewScreen: {imageUrl: string};
  ResidentialParcelBoxImagePreviewScreen: {imageUrl: string};
  HouseRulesCategoriesScreen: undefined;
  ResidentialPreviewImageScreen: {imageUrl: string; title: string};
  ResidentialTicketInvalidScreen: {description: string};

  // Art and Culture
  ArtCultureLandingScreen: undefined;
  ArtCultureFaqsScreen: undefined;
  ArtCultureArtCScreen: {
    id: number | string;
  };
  ArtCultureArtCCategoryScreen: {
    typeId: number;
    id: number | string;
  };
  ArtCultureSearchProgramScreen: undefined;
  ArtCultureProgramScreen: {
    id: number | string;
  };
  ArtCultureAddOnScreen: {
    programId?: number | string;
    id: number | string;
  };
  ArtCultureTagScreen: {
    tag: string;
  };
  ArtCultureArtMapScreen: undefined;
  ArtCultureBookmarkScreen: undefined;
  WalkingSearchScreen: undefined;
  WalkingSelectRouteScreen: {
    timeValue: number;
  };
  WalkingMapRouteScreen: {
    id: number;
  };
  AccessLocalInformation: undefined;
  AccessLocalInformationContentDetail: {
    headerText: string;
    content: string;
    link: {
      name: string;
      onPress: () => void;
    };
  };
  AccessLocalInformationUrl: {
    url: string;
  };

  //Marcom
  MainPageScreen: undefined;
  AllWhatHappenScreen: undefined;
  MarcomContentScreen: {
    id: string;
    sMode: 'Explore' | 'WhatHappening' | 'Banner';
    isBanner?: boolean;
  };
  AllEvents: undefined;
  EventDetail: {
    title: string;
    description: string;
    textOverlay?: string;
    category: string;
    image: string;
    tags: string[];
    location: string;
    eventStartDate: string;
    eventEndDate: string;
    sequence: number;
    button?: {
      name: string;
      url: string;
    } | null;
  };
  // Amenity Booking
  AmenityBookingHomeScreen: undefined;

  AmenityBookingCreateScreen: {availableTimeList: TAvailableTimeListSelect[]};
  AmenityBookingDetailScreen: {booking: AmenityBooking; tab: string};

  //Live Chat
  LiveChatScreen: undefined;

  ChangeUnitDefaultResidentialScreen: undefined;

  // My Ticket
  OrderCompleteScreen: {orderId: string; bookingId: string};
  MyTicketScreen: undefined;
  TicketScreen: {bookingId: string};
  BookingStep1Screen: {programId: string};
  BookingSummaryScreen: undefined;

  DeeplinkWebview: {url: string};

  QuestionnaireHomeScreen: undefined;
  QuestionnaireDetailScreen: {questionnaire: TQuestionnaire};
  QuestionnaireCreateScreen: {questionnaire: TQuestionnaire};
  BuildingUnusualReportScreen: undefined;

  ResidentialAmenityBookingAvailableTimeScreen: {
    availableTimeList: TAvailableTimeListSelect[];
    minPeriod: number;
    maxPeriod: number;
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
      <ResidentialModal />
      <BuildingAccessModal />
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
        <Stack.Screen name="HomeScreen" component={screen.DrawerNavigation} />
        <Stack.Screen name="SignInScreen" component={screen.SignInScreen} />
        {/* <Stack.Screen name="SignInScreen" component={screen.DrawerNavigation} /> */}
        <Stack.Screen
          name="ResidentialManageMyHomeScreen"
          component={screen.ResidentialManageMyHomeScreen}
        />
        <Stack.Screen
          name="ResidentialRenameScreen"
          component={screen.ResidentialRenameScreen}
        />
        <Stack.Screen
          name="ResidentialRoomOrder"
          component={screen.ResidentialRoomOrder}
        />
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
          name="NotificationDeeplink"
          component={screen.NotificationDeeplink}
        />
        <Stack.Screen
          name="DirectoryContactScreen"
          component={screen.DirectoryContactScreen}
        />
        <Stack.Screen
          name="HouseRuleScreen"
          component={screen.HouseRuleScreen}
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
        <Stack.Screen name="ViewPDFScreen" component={screen.ViewPDFScreen} />
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
          name="SmartParkingInfoScreen"
          component={screen.SmartParkingInfoScreen}
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
          name="ImportPhysicalParkingTicketScreen"
          component={screen.ImportPhysicalParkingTicketScreen}
        />
        <Stack.Screen
          name="ParkingTicketScreen"
          component={screen.ParkingTicketScreen}
        />
        <Stack.Screen
          name="ImportPhysicalParkingDetailScreen"
          component={screen.ImportPhysicalParkingDetailScreen}
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
          name="ParkingRedemptionPaymentMethod"
          component={screen.ParkingRedemptionPaymentMethod}
        />
        <Stack.Screen
          name="ParkingRedemptionPaymentPromptPay"
          component={screen.ParkingRedemptionPaymentPromptPay}
        />
        <Stack.Screen
          name="ParkingRedemptionPaymentPromptPaySlip"
          component={screen.ParkingRedemptionPaymentPromptPaySlip}
        />
        <Stack.Screen
          name="NewRedemptionAnnouncement"
          component={screen.NewRedemptionAnnouncement}
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
        <Stack.Screen
          name="SustainabilityScreen"
          // component={screen.SustainabilityScreen}
          component={screen.DrawerNavigationSustainability}
        />
        <Stack.Screen
          name="NormalContentScreen"
          component={screen.NormalContentScreen}
        />
        <Stack.Screen
          name="FileDownloadScreen"
          component={screen.FileDownloadScreen}
        />
        <Stack.Screen
          name="DigitalLibraryScreen"
          component={screen.DigitalLibraryScreen}
        />
        <Stack.Screen name="MapScreen" component={screen.MapScreen} />
        <Stack.Screen
          name="ParkingTermAndConditionScreen"
          component={screen.ParkingTermAndConditionScreen}
        />
        <Stack.Screen
          name="DirectoryContact"
          component={screen.DirectoryContact}
        />
        <Stack.Screen
          name="ParkingPaymentScreen"
          component={screen.ParkingPaymentScreen}
        />
        <Stack.Screen
          name="ResidentialHomeScreen"
          component={screen.ResidentialDrawerNavigation}
        />
        <Stack.Screen
          name="ResidentialSchedulesScreen"
          component={screen.ResidentialSchedulesScreen}
        />
        <Stack.Screen
          name="ResidentialSchedulesScreen_Action"
          component={screen.ResidentialSchedulesScreen_Action}
        />
        <Stack.Screen
          name="ResidentialSchedulesScreen_AddSchedule"
          component={screen.ResidentialSchedulesScreen_AddSchedule}
        />
        <Stack.Screen
          name="ResidentialSchedulesScreen_DetailSchedule"
          component={screen.ResidentialSchedulesScreen_DetailSchedule}
        />
        <Stack.Screen
          name="ResidentialChangeTemperature"
          component={screen.ResidentialChangeTemperature}
        />
        <Stack.Screen
          name="ResidentialChangeTemperature_Edit"
          component={screen.ResidentialChangeTemperature_Edit}
        />
        <Stack.Screen
          name="ResidentialChangeTemperature_AddNewSet"
          component={screen.ResidentialChangeTemperature_AddNewSet}
        />
        <Stack.Screen
          name="ResidentialChangeTemperature_EditCustom"
          component={screen.ResidentialChangeTemperature_EditCustom}
        />
        <Stack.Screen
          name="ResidentialWelcomeScreen"
          component={screen.ResidentialWelcomeScreen}
        />
        <Stack.Screen
          name="ResidentialPDPAScreen"
          component={screen.ResidentialPDPAScreen}
        />
        <Stack.Screen
          name="EmergencyScreen"
          component={screen.EmergencyScreen}
        />
        <Stack.Screen
          name="AnnouncementsScreen"
          component={screen.AnnouncementsScreen}
          options={{gestureEnabled: true}}
        />
        <Stack.Screen
          name="AnnouncementDetailScreen"
          component={screen.AnnouncementDetailScreen}
          options={{gestureEnabled: true}}
        />
        <Stack.Screen
          name="AutomationHomeScreen"
          component={screen.AutomationHomeScreen}
        />
        <Stack.Screen
          name="AutomationSettingScreen"
          component={screen.AutomationSettingScreen}
        />
        <Stack.Screen name="ScenesScreen" component={screen.ScenesScreen} />
        <Stack.Screen name="AddSceneScreen" component={screen.AddSceneScreen} />
        <Stack.Screen
          name="SettingSceneScreen"
          component={screen.SettingSceneScreen}
        />
        <Stack.Screen
          name="SettingEditSceneScreen"
          component={screen.SettingEditSceneScreen}
        />
        <Stack.Screen
          name="SceneSuccessfulScreen"
          component={screen.SceneSuccessfulScreen}
        />
        <Stack.Screen
          name="ResidentialSceneRename"
          component={screen.ResidentialSceneRename}
        />
        <Stack.Screen
          name="SettingAddSceneScreen"
          component={screen.SettingAddSceneScreen}
        />
        <Stack.Screen
          name="ResidentialRoomScreen"
          component={screen.ResidentialRoomScreen}
        />
        <Stack.Screen
          name="NewActionSchedule"
          component={screen.NewActionSchedule}
        />
        <Stack.Screen
          name="TemperatureSchedule"
          component={screen.TemperatureSchedule}
        />
        <Stack.Screen name="ModifyTimeSlot" component={screen.ModifyTimeSlot} />
        <Stack.Screen name="AddTimeSlot" component={screen.AddTimeSlot} />
        <Stack.Screen
          name="ActionScheduleRename"
          component={screen.ActionScheduleRename}
        />
        <Stack.Screen
          name="ActionScheduleDuplicate"
          component={screen.ActionScheduleDuplicate}
        />
        <Stack.Screen
          name="CreateScheduleWeek"
          component={screen.CreateScheduleWeek}
        />
        <Stack.Screen
          name="CreateScheduleWeekDays"
          component={screen.CreateScheduleWeekDays}
        />
        <Stack.Screen
          name="CreateScheduleWeekend"
          component={screen.CreateScheduleWeekend}
        />
        <Stack.Screen
          name="CreateScheduleSaturday"
          component={screen.CreateScheduleSaturday}
        />
        <Stack.Screen
          name="CreateScheduleSunday"
          component={screen.CreateScheduleSunday}
        />
        <Stack.Screen
          name="CreateScheduleCooling"
          component={screen.CreateScheduleCooling}
        />
        <Stack.Screen
          name="CreateCoolingSchedule"
          component={screen.CreateCoolingSchedule}
        />
        <Stack.Screen
          name="TemperatureScheduleRename"
          component={screen.TemperatureScheduleRename}
        />
        <Stack.Screen
          name="TemperatureScheduleDuplicate"
          component={screen.TemperatureScheduleDuplicate}
        />
        <Stack.Screen
          name="CreateCoolingScheduleWelcome"
          component={screen.CreateCoolingScheduleWelcome}
        />
        <Stack.Screen
          name="CreateCoolingScheduleSuccessful"
          component={screen.CreateCoolingScheduleSuccessful}
        />
        <Stack.Screen
          name="ResidentialTemperatureSchedulesDay"
          component={screen.ResidentialTemperatureSchedulesDay}
        />
        <Stack.Screen name="PropertyScreen" component={screen.PropertyScreen} />
        <Stack.Screen
          name="PropertyDetailScreen"
          component={screen.PropertyDetailScreen}
        />
        <Stack.Screen
          name="MaintenanceCreate"
          component={screen.MaintenanceCreate}
        />
        <Stack.Screen
          name="ResidentialMaintenanceScreen"
          component={screen.ResidentialMaintenanceScreen}
        />
        <Stack.Screen name="ElevatorScreen" component={screen.ElevatorScreen} />
        <Stack.Screen
          name="ElevatorFloorSelectionScreen"
          component={screen.ElevatorFloorSelectionScreen}
        />
        <Stack.Screen
          name="ResidentialElevatorWaitingScreen"
          component={screen.ResidentialElevatorWaitingScreen}
        />
        <Stack.Screen
          name="ResidentialElevatorErrorScreen"
          component={screen.ResidentialElevatorErrorScreen}
        />
        <Stack.Screen
          name="MaintenanceDetailScreen"
          component={screen.MaintenanceDetailScreen}
        />
        <Stack.Screen
          name="AnnouncementResidentialScreen"
          component={screen.AnnouncementResidentialScreen}
        />
        <Stack.Screen
          name="VisitorPassHomeScreen"
          component={screen.VisitorPassHomeScreen}
        />
        <Stack.Screen
          name="CarParkPaymentDetailScreen"
          component={screen.CarParkPaymentDetailScreen}
        />
        <Stack.Screen name="FeedbackScreen" component={screen.FeedbackScreen} />
        <Stack.Screen
          name="FeedbackDetailScreen"
          component={screen.FeedbackDetailScreen}
        />
        <Stack.Screen
          name="CreateFeedbackScreen"
          component={screen.CreateFeedbackScreen}
        />
        <Stack.Screen
          name="UnderDevelopment"
          component={screen.UnderDevelopment}
        />
        <Stack.Screen
          name="RestrictedAccessScreen"
          component={screen.RestrictedAccessScreen}
        />
        <Stack.Screen
          name="ParcelBoxScreen"
          component={screen.ParcelBoxScreen}
        />
        <Stack.Screen
          name="ParcelBoxDetailScreen"
          component={screen.ParcelBoxDetailScreen}
        />
        <Stack.Screen
          name="ServiceRequestHomeScreen"
          component={screen.ServiceRequestHomeScreen}
        />
        <Stack.Screen
          name="ServiceRequestDetailScreen"
          component={screen.ServiceRequestDetailScreen}
        />
        <Stack.Screen
          name="ServiceRequestCreateScreen"
          component={screen.ServiceRequestCreateScreen}
        />
        <Stack.Screen
          name="WayFindingScreen"
          component={screen.WayFindingScreen}
        />
        <Stack.Screen
          name="AmenitiesScreen"
          component={screen.AmenitiesScreen}
        />
        {/* Residential Visitor Pass Screen */}
        <Stack.Screen
          name="ResidentialBuildingAccessQrScreen"
          component={screen.ResidentialBuildingAccessQrScreen}
        />
        <Stack.Screen
          name="ResidentialVisitorPassScreen"
          component={screen.ResidentialVisitorPassScreen}
        />
        <Stack.Screen
          name="ResidentialCreateVisitorPassScreen"
          component={screen.ResidentialCreateVisitorPassScreen}
        />
        <Stack.Screen
          name="ResidentialCameraDisableScreen"
          component={screen.ResidentialCameraDisableScreen}
        />
        <Stack.Screen
          name="ResidentialInternetNotConnectionScreen"
          component={screen.ResidentialInternetNotConnectionScreen}
        />
        <Stack.Screen
          name="ResidentialParkingRedemptionDetailScreen"
          component={screen.ResidentialParkingRedemptionDetailScreen}
        />
        <Stack.Screen
          name="ResidentialCarParkPaymentDetailScreen"
          component={screen.ResidentialCarParkPaymentDetailScreen}
        />
        <Stack.Screen
          name="ResidentialCarParkTermAndConditionScreen"
          component={screen.ResidentialCarParkTermAndConditionScreen}
        />
        <Stack.Screen
          name="ResidentialCarParkPaymentScreen"
          component={screen.ResidentialCarParkPaymentScreen}
        />
        <Stack.Screen
          name="ResidentialRedemptionAnnouncement"
          component={screen.ResidentialRedemptionAnnouncement}
        />
        <Stack.Screen
          name="ResidentialVisitorPassDetailScreen"
          component={screen.ResidentialVisitorPassDetailScreen}
        />
        <Stack.Screen
          name="ResidentialVisitorPassHomeScreen"
          component={screen.ResidentialVisitorPassHomeScreen}
        />
        <Stack.Screen
          name="ResidentialParkingRedemptionScreen"
          component={screen.ResidentialParkingRedemptionScreen}
        />
        <Stack.Screen
          name="ResidentialParkingRedemptionPaymentMethod"
          component={screen.ResidentialParkingRedemptionPaymentMethod}
        />
        <Stack.Screen
          name="ResidentialParkingRedemptionPaymentPromptPaySlip"
          component={screen.ResidentialParkingRedemptionPaymentPromptPaySlip}
        />
        <Stack.Screen
          name="ActionScheduleWelcome"
          component={screen.ActionScheduleWelcome}
        />
        <Stack.Screen
          name="CoolingScheduleWelcome"
          component={screen.CoolingScheduleWelcome}
        />

        <Stack.Screen
          name="ArtCultureLandingScreen"
          component={screen.ArtCultureDrawerNavigation}
        />
        <Stack.Screen
          name="ArtCultureFaqsScreen"
          component={screen.ArtCultureFaqsScreen}
        />
        <Stack.Screen
          name="ArtCultureArtCScreen"
          component={screen.ArtCultureArtCScreen}
        />
        <Stack.Screen
          name="ArtCultureArtCCategoryScreen"
          component={screen.ArtCultureArtCCategoryScreen}
        />
        <Stack.Screen
          name="ArtCultureSearchProgramScreen"
          component={screen.ArtCultureSearchProgramScreen}
        />
        <Stack.Screen
          name="ArtCultureProgramScreen"
          component={screen.ArtCultureProgramScreen}
        />
        <Stack.Screen
          name="ArtCultureAddOnScreen"
          component={screen.ArtCultureAddOnScreen}
        />
        <Stack.Screen
          name="ArtCultureTagScreen"
          component={screen.ArtCultureTagScreen}
        />
        <Stack.Screen
          name="ArtCultureArtMapScreen"
          component={screen.ArtCultureArtMapScreen}
        />
        <Stack.Screen
          name="ArtCultureBookmarkScreen"
          component={screen.ArtCultureBookmarkScreen}
        />
        <Stack.Screen
          name="WalkingSearchScreen"
          component={screen.WalkingSearchScreen}
        />
        <Stack.Screen
          name="WalkingSelectRouteScreen"
          component={screen.WalkingSelectRouteScreen}
        />
        <Stack.Screen
          name="WalkingMapRouteScreen"
          component={screen.WalkingMapRouteScreen}
        />

        <Stack.Screen
          name="RequestCarRetrievalScreen"
          component={screen.RequestCarRetrievalScreen}
        />
        <Stack.Screen
          name="ParkingServiceScreen"
          component={screen.ParkingServiceScreen}
        />
        <Stack.Screen
          name="ParkingTrafficAnalyticScreen"
          component={screen.ParkingTrafficAnalyticScreen}
        />
        <Stack.Screen
          name="AccessLocalInformation"
          component={screen.AccessLocalInformation}
        />
        <Stack.Screen
          name="AccessLocalInformationContentDetail"
          component={screen.AccessLocalInformationContentDetail}
        />
        <Stack.Screen
          name="AccessLocalInformationUrl"
          component={screen.AccessLocalInformationUrl}
        />

        {/* Marcom */}
        <Stack.Screen
          name="MainPageScreen"
          // component={screen.MainPageScreen}
          component={screen.DrawerNavigationMarcom}
        />
        <Stack.Screen
          name="AllWhatHappenScreen"
          component={screen.AllWhatHappenScreen}
        />
        <Stack.Screen
          name="MarcomContentScreen"
          component={screen.MarcomContentScreen}
        />
        <Stack.Screen name="AllEvents" component={screen.AllEvents} />
        <Stack.Screen name="EventDetail" component={screen.EventDetail} />

        {/* Amenity Booking */}
        <Stack.Screen
          name="AmenityBookingHomeScreen"
          component={screen.AmenityBookingHomeScreen}
        />
        <Stack.Screen
          name="AmenityBookingCreateScreen"
          component={screen.AmenityBookingCreateScreen}
        />
        <Stack.Screen
          name="AmenityBookingDetailScreen"
          component={screen.AmenityBookingDetailScreen}
        />
        {/* Live Chat */}
        <Stack.Screen name="LiveChatScreen" component={screen.LiveChatScreen} />

        <Stack.Screen
          name="ResidentialAddActionScheduleScreen"
          component={screen.ResidentialAddActionScheduleScreen}
        />
        <Stack.Screen
          name="ResidentialEditActionScheduleScreen"
          component={screen.ResidentialEditActionScheduleScreen}
        />
        <Stack.Screen
          name="ResidentialLiveChatScreen"
          component={screen.ResidentialLiveChatScreen}
        />
        <Stack.Screen
          name="ResidentialLiveChatPreviewScreen"
          component={screen.ResidentialLiveChatPreviewScreen}
        />
        <Stack.Screen
          name="ChangeUnitDefaultResidentialScreen"
          component={screen.ChangeUnitDefaultResidentialScreen}
        />
        <Stack.Screen
          name="ResidentialAnnouncementImagePreviewScreen"
          component={screen.ResidentialAnnouncementImagePreviewScreen}
        />
        <Stack.Screen
          name="ResidentialParcelBoxImagePreviewScreen"
          component={screen.ResidentialParcelBoxImagePreviewScreen}
        />
        <Stack.Screen
          name="HouseRulesCategoriesScreen"
          component={screen.HouseRulesCategoriesScreen}
        />
        <Stack.Screen
          name="ResidentialPreviewImageScreen"
          component={screen.ResidentialPreviewImageScreen}
        />
        <Stack.Screen
          name="ResidentialTicketInvalidScreen"
          component={screen.ResidentialTicketInvalidScreen}
        />

        {/* My Ticket */}
        <Stack.Screen
          name="OrderCompleteScreen"
          component={screen.OrderCompleteScreen}
        />
        <Stack.Screen name="MyTicketScreen" component={screen.MyTicketScreen} />
        <Stack.Screen name="TicketScreen" component={screen.TicketScreen} />
        <Stack.Screen
          name="BookingStep1Screen"
          component={screen.BookingStep1Screen}
        />
        <Stack.Screen
          name="BookingSummaryScreen"
          component={screen.BookingSummaryScreen}
        />
        <Stack.Screen
          name="DeeplinkWebview"
          component={screen.DeeplinkWebview}
        />

        <Stack.Screen
          name="QuestionnaireHomeScreen"
          component={screen.QuestionnaireHomeScreen}
        />
        <Stack.Screen
          name="QuestionnaireDetailScreen"
          component={screen.QuestionnaireDetailScreen}
        />
        <Stack.Screen
          name="QuestionnaireCreateScreen"
          component={screen.QuestionnaireCreateScreen}
        />
        <Stack.Screen
          name="BuildingUnusualReportScreen"
          component={screen.BuildingUnusualReportScreen}
        />
        <Stack.Screen
          name="ResidentialAmenityBookingAvailableTimeScreen"
          component={screen.ResidentialAmenityBookingAvailableTimeScreen}
        />
        <Stack.Screen
          name="ParkingAllRecieptScreen"
          component={screen.ParkingAllRecieptScreen}
        />
        <Stack.Screen
          name="ParkingPaymentAndRedemptionScreen"
          component={screen.ParkingPaymentAndRedemptionScreen}
        />
        <Stack.Screen
          name="ParkingRedemptionCameraScreen"
          component={screen.ParkingRedemptionCameraScreen}
        />
        <Stack.Screen
          name="ParkingAllowCameraOrGallery"
          component={screen.ParkingAllowCameraOrGallery}
        />
      </Stack.Navigator>
    </>
  );
}
