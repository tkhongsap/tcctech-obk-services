import React from 'react';
import {View} from 'react-native';

import BackIcon from '~/assets/icons/icon-ob-arrow-back.svg';
import NextIcon from '~/assets/icons/icon-ob-arrow-next.svg';
import LanguageIcon from '~/assets/icons/icon-ob-language.svg';
import MenuIcon from '~/assets/icons/icon-ob-menu.svg';
import BellIcon from '~/assets/icons/icon-ob-bell.svg';
import CompassIcon from '~/assets/icons/icon-ob-compass.svg';
import SearchIcon from '~/assets/icons/icon-ob-search.svg';
import BarometerIcon from '~/assets/icons/icon-ob-barometer.svg';
import WindIcon from '~/assets/icons/icon-ob-wind.svg';
import DropletIcon from '~/assets/icons/icon-ob-droplet.svg';
import MapPinIcon from '~/assets/icons/icon-ob-map-pin.svg';
import QrCodeIcon from '~/assets/icons/icon-ob-qr-code.svg';
import CancelIcon from '~/assets/icons/icon-ob-cancel.svg';
import CloseIcon from '~/assets/icons/icon-ob-close.svg';
import CogIcon from '~/assets/icons/icon-ob-cog.svg';
import UserIcon from '~/assets/icons/icon-ob-user.svg';
import RightIcon from '~/assets/icons/icon-ob-caret-right.svg';
import SupportIcon from '~/assets/icons/icon-ob-support.svg';
import ArrowRightIcon from '~/assets/icons/icon-arrow-right.svg';
import SmileIcon from '~/assets/icons/icon-ob-smile.svg';
import LiveChatIcon from '~/assets/icons/icon-ob-live-chat.svg';

import CheckedBoxIcon from '~/assets/icons/icon-checkbox-checked.svg';
import UnCheckedBoxIcon from '~/assets/icons/icon-checkbox-unchecked.svg';
import ErrorCheckBoxIcon from '~/assets/icons/icon-checkbox-error.svg';
import RoundedCheckedBoxIcon from '~/assets/icons/icon-rounded-checkbox-checked.svg';
import RoundedUnCheckedBoxIcon from '~/assets/icons/icon-rounded-checkbox-unchecked.svg';
import ErrorRoundedCheckBoxIcon from '~/assets/icons/icon-rounded-checkbox-error.svg';
import checkedRadioIcon from '~/assets/icons/icon-ob-radio-filled.svg';
import RadioIcon from '~/assets/icons/icon-ob-radio.svg';
import likeIcon from '~/assets/icons/icon-ob-like-outline.svg';
import dislikeIcon from '~/assets/icons/icon-ob-dislike-outline.svg';
import likePressedIcon from '~/assets/icons/icon-ob-like-pressed-outline.svg';
import dislikePressedIcon from '~/assets/icons/icon-ob-dislike-pressed-outline.svg';
import LegalIcon from '~/assets/icons/icon-ob-legal.svg';
import defaultCheckboxIcon from '~/assets/icons/icon-ob-default-checkbox.svg';
import selectedCheckboxIcon from '~/assets/icons/icon-ob-selected-checkbox.svg';
import buildingIcon from '~/assets/icons/icon-ob-building-outline.svg';
import megaphoneIcon from '~/assets/icons/icon-ob-megaphone-outline.svg';
import emptyVisitorPassIcon from '~/assets/icons/icon-empty-visitor-pass.svg';
import refreshIcon from '~/assets/icons/icon-ob-refresh.svg';
import checkedIcon from '~/assets/icons/icon-ob-checked.svg';
import obNewIcon from '~/assets/icons/icon-ob-new.svg';
import obLogoIcon from '~/assets/images/ob_logo.svg';
import appleIcon from '~/assets/icons/icon_apple.svg';
import googleIcon from '~/assets/icons/icon_google.svg';
import microsoftIcon from '~/assets/icons/icon_microsoft.svg';
import warningIcon from '~/assets/icons/icon-ob-warning.svg';
import homeIcon from '~/assets/icons/icon-home.svg';
import locationIcon from '~/assets/icons/icon-ob-location.svg';
import animationErrorIcon from '~/assets/icons/icon-animation-error.svg';
import iconMock from '~/assets/icons/icon-ob-mock.svg'
import pbGeneralParcel from '~/assets/icons/icon-pb-general-parcel.svg';
import pbLargeParcel from '~/assets/icons/icon-pb-large-parcel.svg';
import pbEnvelope from '~/assets/icons/icon-pb-envelope.svg';

// Visitor Feature
import visitorIcon from '~/assets/icons/icon-ob-visitor-outline.svg';
import calendarIcon from '~/assets/icons/icon-ob-calendar-outline.svg';
import checkedOutlineRadioWhite from '~/assets/icons/icon-ob-radio-outline-white.svg';
import parkingQRIcon from '~/assets/icons/icon-parking-qr.svg';
import arrowDownIcon from '~/assets/icons/icon-arrow-down.svg';
import smartParkingIcon from '~/assets/icons/icon-ob-smart-parking.svg';
import bluetoothIcon from '~/assets/icons/icon-bluetooth.svg';
import elevatorIcon from '~/assets/icons/icon-elevator.svg';
import elevatorWhiteIcon from '~/assets/icons/icon-elevator-white.svg';
import OBIcon from '~/assets/icons/icon-ob.svg';
import deniedIcon from '~/assets/icons/icon-ob-denied.svg';
import createVisitorPassIcon from '~/assets/icons/icon-create-visitor-pass.svg';
import serviceBellIcon from '~/assets/icons/icon-service-bell.svg';
import settingIcon from '~/assets/icons/icon-setting.svg';
import plusIcon from '~/assets/icons/icon-ob-plus.svg';

//Parking
import reservedIcon from '~/assets/icons/icon-parking-reserved.svg';
import carHandicapIcon from '~/assets/icons/icon-ob-car-handicap.svg';
import carVipIcon from '~/assets/icons/icon-ob-car-vip.svg';
import carLuxuryIcon from '~/assets/icons/icon-ob-car-luxury.svg';
import bigBikeIcon from '~/assets/icons/icon-ob-big-bike.svg';

//Service Request
import serviceRequestIcon from '~/assets/icons/icon-service-request.svg';
import airConditionerRequestIcon from '~/assets/icons/icon-air-conditioner-request.svg';
import addIcon from '~/assets/icons/icon-add.svg';
import addIconGreen from '~/assets/icons/icon-add-green.svg';
import phoneIcon from '~/assets/icons/icon-contact-phone.svg';
import mailIcon from '~/assets/icons/icon-contact-mail.svg';
import buildingsIcon from '~/assets/icons/icon-ob-building.svg';

import svLiveIcon from '~/assets/icons/icon-sv-live-chat.svg';
import svContactIcon from '~/assets/icons/icon-sv-contact.svg';
import svRequestIcon from '~/assets/icons/icon-sv-service-request.svg';
import svBillIcon from '~/assets/icons/icon-sv-bill.svg';
import svMaintenanceIcon from '~/assets/icons/icon-sv-maintenance.svg';

//Air Quality
import aqTempIcon from '~/assets/icons/icon-aq-temp.svg';
import aqPMIcon from '~/assets/icons/icon-aq-pm.svg';
import aqHumidityIcon from '~/assets/icons/icon-aq-humidity.svg';
import aqCo2Icon from '~/assets/icons/icon-aq-co2.svg';

//Add Icon
import horizontalIcon from '~/assets/icons/icon-horizontal.svg';
import homeEditIcon from '~/assets/icons/icon-home-edit.svg';
import sortIcon from '~/assets/icons/icon_sort.svg';
import camera from '~/assets/icons/icon_camera.svg';


// Scene Icon
import scHomeIcon from '~/assets/icons/icon-scene-home.svg';
import scHomeDarkIcon from '~/assets/icons/icon-scene-home-dark.svg';
import scArtCIcon from '~/assets/icons/icon-scene-art-c.svg';
import scSleepBedIcon from '~/assets/icons/icon-scene-sleep-bed.svg';
import scAwayIcon from '~/assets/icons/icon-scene-away.svg';
import scLightoffIcon from '~/assets/icons/icon-scene-lightoff.svg';
import scLightoffIconBlack from '~/assets/icons/icon-scene-lightoff-black.svg';
import scLightIcon from '~/assets/icons/icon-scene-light.svg';
import scLightonIcon from '~/assets/icons/icon-scene-light-yellow.svg';
import scOtherIcon from '~/assets/icons/icon-scene-other.svg';
import scOtherSettingIcon from '~/assets/icons/icon-scene-other-setting.svg';
import scReadIcon from '~/assets/icons/icon-scene-read.svg';
import scShutterIcon from '~/assets/icons/icon-scene-shutters.svg';
import scSleepIcon from '~/assets/icons/icon-scene-sleep.svg';
import scWakeupIcon from '~/assets/icons/icon-scene-wakeup.svg';
import scCheckedIcon from '~/assets/icons/icon-scene-checked.svg';
import scPartyIcon from '~/assets/icons/icon-scene-party.svg';
import scMusicIcon from '~/assets/icons/icon-scene-music.svg';
import scCinemaIcon from '~/assets/icons/icon-scene-cinema.svg';
import scWorkIcon from '~/assets/icons/icon-scene-work.svg';
import scRelaxationIcon from '~/assets/icons/icon-scene-relaxation.svg';
import scReadingIcon from '~/assets/icons/icon-scene-reading.svg';
import scSportIcon from '~/assets/icons/icon-scene-sport.svg';
import scRomanceIcon from '~/assets/icons/icon-scene-romance.svg';
import scHolidayIcon from '~/assets/icons/icon-scene-holiday.svg';
import scGarageIcon from '~/assets/icons/icon-scene-garage.svg';
import scPoolIcon from '~/assets/icons/icon-scene-swimmingpool.svg';
import scOutletIcon from '~/assets/icons/icon-scene-outlet.svg';
import scLightDeviceIcon from '~/assets/icons/icon-scene-lightdevice.svg';
import scShutterDeviceIcon from '~/assets/icons/icon-scene-shutterdevice.svg';
import scVentilationIcon from '~/assets/icons/icon-scene-ventilation.svg';
import scOtherDeviceIcon from '~/assets/icons/icon-scene-otherdevice.svg';
import scHomeEditIcon from '~/assets/icons/icon-scene-home-edit.svg';
import scRadioIcon from '~/assets/icons/icon-scene-radio.svg';
import scRadioCheckedIcon from '~/assets/icons/icon-scene-radio-checked.svg';
import scTimeIcon from '~/assets/icons/icon-scene-time.svg';
import scTimeWhiteIcon from '~/assets/icons/icon-scene-time-white.svg';
import scTimeBlackIcon from '~/assets/icons/scTimeBlackIcon.svg';
import scMoonIcon from '~/assets/icons/icon-scene-moon.svg';
import scSunIcon from '~/assets/icons/icon-scene-sun.svg';
import scArrowUpIcon from '~/assets/icons/icon-scene-arrow-up.svg';
import scArrowDownIcon from '~/assets/icons/icon-scene-arrow-down.svg';
import scStopIcon from '~/assets/icons/icon-scene-stop.svg';
import scWindowIcon from '~/assets/icons/icon-scene-sensor-window.svg';
import scFanIcon from '~/assets/icons/icon-scene-fan-coil.svg';
import obLivingRoom from '~/assets/icons/icon-tem-living-room.svg';

// Options icon
import opDisable from '~/assets/icons/icon-op-disable.svg';
import opEnable from '~/assets/icons/icon-op-enable.svg';
import opRename from '~/assets/icons/icon-op-rename.svg';
import opDuplicate from '~/assets/icons/icon-op-duplicate.svg';
import opDelete from '~/assets/icons/icon-op-delete.svg';

// Schedule icon
import scheduleComfort from '~/assets/icons/icon-schedule-mode-comfort.svg';
import scheduleEco from '~/assets/icons/icon-schedule-mode-eco.svg';
import scheduleNight from '~/assets/icons/icon-schedule-mode-night.svg';
import scheduleComfortColor from '~/assets/icons/icon-schedule-mode-comfort-color.svg';
import scheduleEcoColor from '~/assets/icons/icon-schedule-mode-eco-color.svg';
import scheduleNightColor from '~/assets/icons/icon-schedule-mode-night-color.svg';
import scheduleTrash from '~/assets/icons/icon-schedule-mode-trash.svg';
import schedulePlus from '~/assets/icons/icon-schedule-plus.svg';
import scheduleDelete from '~/assets/icons/icon-schedule-delete.svg';
import scheduleSuccess from '~/assets/icons/icon-schedule-success.svg';
import calendarPlus from '~/assets/icons/icon_calendar_plus.svg';
import lightBlack from '~/assets/icons/icon_light_black.svg';


export const iconTypes = {
  sort: sortIcon,
  homeEdit: homeEditIcon,
  horizontal: horizontalIcon,
  back: BackIcon,
  next: NextIcon,
  language: LanguageIcon,
  menu: MenuIcon,
  bell: BellIcon,
  compass: CompassIcon,
  search: SearchIcon,
  barometer: BarometerIcon,
  wind: WindIcon,
  droplet: DropletIcon,
  mapPin: MapPinIcon,
  qrCode: QrCodeIcon,
  cancel: CancelIcon,
  close: CloseIcon,
  checkedBox: CheckedBoxIcon,
  unCheckedBox: UnCheckedBoxIcon,
  errorCheckBox: ErrorCheckBoxIcon,
  roundedCheckedBox: RoundedCheckedBoxIcon,
  roundedUnCheckedBox: RoundedUnCheckedBoxIcon,
  errorRoundedCheckBox: ErrorRoundedCheckBoxIcon,
  cog: CogIcon,
  user: UserIcon,
  right: RightIcon,
  support: SupportIcon,
  radio: RadioIcon,
  checkedRadio: checkedRadioIcon,
  like: likeIcon,
  dislike: dislikeIcon,
  likePressed: likePressedIcon,
  dislikePressed: dislikePressedIcon,
  legal: LegalIcon,
  defaultCheckbox: defaultCheckboxIcon,
  selectedCheckbox: selectedCheckboxIcon,
  building: buildingIcon,
  megaphone: megaphoneIcon,
  visitor: visitorIcon,
  emptyVisitorPass: emptyVisitorPassIcon,
  calendar: calendarIcon,
  checkedOutlineRadioWhite: checkedOutlineRadioWhite,
  refreshIcon: refreshIcon,
  oneBangkok: OBIcon,
  parkingQRIcon: parkingQRIcon,
  arrowDownIcon: arrowDownIcon,
  bluetooth: bluetoothIcon,
  elevator: elevatorIcon,
  elevatorWhite: elevatorWhiteIcon,
  checkedIcon: checkedIcon,
  smartParkingIcon: smartParkingIcon,
  denied: deniedIcon,
  createVisitorPassIcon: createVisitorPassIcon,
  serviceBellIcon: serviceBellIcon,
  obNewIcon: obNewIcon,
  obLogoIcon: obLogoIcon,
  arrowRightIcon: ArrowRightIcon,
  microsoftIcon: microsoftIcon,
  appleIcon: appleIcon,
  googleIcon: googleIcon,
  warningIcon: warningIcon,
  reservedIcon: reservedIcon,
  carHandicapIcon: carHandicapIcon,
  carVipIcon: carVipIcon,
  carLuxuryIcon: carLuxuryIcon,
  bigBikeIcon: bigBikeIcon,
  homeIcon: homeIcon,
  settingIcon: settingIcon,
  serviceRequestIcon: serviceRequestIcon,
  airConditionerRequestIcon: airConditionerRequestIcon,
  addIcon: addIcon,
  addIconGreen: addIconGreen,
  mailIcon: mailIcon,
  phoneIcon: phoneIcon,
  aqTempIcon: aqTempIcon,
  aqPMIcon: aqPMIcon,
  aqHumidityIcon: aqHumidityIcon,
  aqCo2Icon: aqCo2Icon,
  plusIcon: plusIcon,
  buildings: buildingsIcon,
  location: locationIcon,
  smileIcon: SmileIcon,
  LiveChatIcon: LiveChatIcon,
  scHomeIcon: scHomeIcon,
  scHomeDarkIcon: scHomeDarkIcon,
  scArtCIcon: scArtCIcon,
  scSleepBedIcon: scSleepBedIcon,
  scAwayIcon: scAwayIcon,
  scLightoffIcon: scLightoffIcon,
  scLightoffIconBlack: scLightoffIconBlack,
  scLightIcon: scLightIcon,
  scLightonIcon: scLightonIcon,
  scOtherIcon: scOtherIcon,
  scOtherSettingIcon: scOtherSettingIcon,
  scReadIcon: scReadIcon,
  scShutterIcon: scShutterIcon,
  scSleepIcon: scSleepIcon,
  scWakeupIcon: scWakeupIcon,
  scCheckedIcon: scCheckedIcon,
  scPartyIcon: scPartyIcon,
  scMusicIcon: scMusicIcon,
  scCinemaIcon: scCinemaIcon,
  scWorkIcon: scWorkIcon,
  scRelaxationIcon: scRelaxationIcon,
  scReadingIcon: scReadingIcon,
  scSportIcon: scSportIcon,
  scRomanceIcon: scRomanceIcon,
  scHolidayIcon: scHolidayIcon,
  scGarageIcon: scGarageIcon,
  scPoolIcon: scPoolIcon,
  scOutletIcon: scOutletIcon,
  scLightDeviceIcon: scLightDeviceIcon,
  scShutterDeviceIcon: scShutterDeviceIcon,
  scVentilationIcon: scVentilationIcon,
  scOtherDeviceIcon: scOtherDeviceIcon,
  scHomeEditIcon: scHomeEditIcon,
  scRadioIcon: scRadioIcon,
  scRadioCheckedIcon: scRadioCheckedIcon,
  scTimeIcon: scTimeIcon,
  scTimeBlackIcon: scTimeBlackIcon,
  scTimeWhiteIcon: scTimeWhiteIcon,
  scMoonIcon: scMoonIcon,
  scSunIcon: scSunIcon,
  scArrowUpIcon: scArrowUpIcon,
  scArrowDownIcon: scArrowDownIcon,
  scStopIcon: scStopIcon,
  scWindowIcon: scWindowIcon,
  opDisable: opDisable,
  opRename: opRename,
  opDuplicate: opDuplicate,
  opDelete: opDelete,
  opEnable: opEnable,
  scFanIcon: scFanIcon,
  scheduleComfort: scheduleComfort,
  scheduleEco: scheduleEco,
  scheduleNight: scheduleNight,
  scheduleComfortColor: scheduleComfortColor,
  scheduleEcoColor: scheduleEcoColor,
  scheduleNightColor: scheduleNightColor,
  scheduleTrash: scheduleTrash,
  schedulePlus: schedulePlus,
  scheduleDelete: scheduleDelete,
  scheduleSuccess: scheduleSuccess,
  calendarPlus: calendarPlus,
  lightBlack: lightBlack,
  obLivingRoom: obLivingRoom,
  camera: camera,
  svBillIcon: svBillIcon,
  svContactIcon: svContactIcon,
  svRequestIcon: svRequestIcon,
  svLiveIcon: svLiveIcon,
  svMaintenanceIcon: svMaintenanceIcon,
  animationErrorIcon: animationErrorIcon,
  iconMock: iconMock,
  pbGeneralParcel: pbGeneralParcel,
  pbLargeParcel: pbLargeParcel,
  pbEnvelope: pbEnvelope,
};

export type IconType = keyof typeof iconTypes;

export interface IconProps {
  type: IconType;
  width: number;
  height: number;
  color?: string;
  bgColor?: string;
  className?: string;
}

const defaultProps: IconProps = {
  type: 'back',
  width: 24,
  height: 24,
  color: '#000000',
};

export const Icon = (props: IconProps) => {
  const {width, height, type, color, bgColor, className = 'p-[4px]'} = props;
  const IconComponent = iconTypes[type];
  return (
    <View
      className={`${bgColor} rounded-full flex justify-center items-center ${className}`}>
      <IconComponent width={width} height={height} fill={color} />
    </View>
  );
};

Icon.defaultProps = defaultProps;
