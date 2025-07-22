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
import phoneIcon from '~/assets/icons/icon-contact-phone.svg';
import mailIcon from '~/assets/icons/icon-contact-mail.svg';
import buildingsIcon from '~/assets/icons/icon-ob-building.svg';

//Air Quality
import aqTempIcon from '~/assets/icons/icon-aq-temp.svg';
import aqPMIcon from '~/assets/icons/icon-aq-pm.svg';
import aqHumidityIcon from '~/assets/icons/icon-aq-humidity.svg';
import aqCo2Icon from '~/assets/icons/icon-aq-co2.svg';

export const iconTypes = {
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
  mailIcon: mailIcon,
  phoneIcon: phoneIcon,
  aqTempIcon: aqTempIcon,
  aqPMIcon: aqPMIcon,
  aqHumidityIcon: aqHumidityIcon,
  aqCo2Icon: aqCo2Icon,
  plusIcon: plusIcon,
  buildings: buildingsIcon,
  location: locationIcon,
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
