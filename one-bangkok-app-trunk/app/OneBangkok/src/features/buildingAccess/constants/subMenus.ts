import {isEmpty} from 'lodash';
import {SubMenuScreenMenuList} from '../types/subMenu';
import {useAuthorization} from '~/hooks/useAuthorization';
import firebaseConfigState from '~/states/firebase';

export const Parking = (): SubMenuScreenMenuList[] => {
  const {checkPermission} = useAuthorization();

  const parkingMenu = [
    checkPermission('view', 'MyParkingTicket') && {
      name: 'General__My_parking_ticket',
      defaultName: 'My parking ticket',
      iconName: 'qrCode',
      navigationTo: 'ParkingTicketScreen',
    },
    {
      name: 'General__Parking_availability',
      defaultName: 'Parking availability',
      iconName: 'smartParkingIcon',
      navigationTo: 'SmartParkingScreen',
    },
    {
      name: 'General__Parking_traffic_analytic',
      defaultName: 'Traffic analytics',
      iconName: 'parkingTrafficIcon',
      navigationTo: 'ParkingTrafficAnalyticScreen',
    },
    firebaseConfigState.enable_parking_location.value &&
      checkPermission('view', 'FindMyCar') && {
        name: 'General__Parking_find_my_car',
        defaultName: 'Find my car',
        iconName: 'parkingCarConnectedIcon',
        navigationTo: 'ParkingTicketScreen',
      },
    firebaseConfigState.enable_valet_parking.value &&
      checkPermission('view', 'ValetParking') && {
        name: 'General__Parking_valet_parking',
        defaultName: 'Valet Parking',
        iconName: 'parkingCarConnectedIcon',
        navigationTo: 'ParkingTicketScreen',
      },
  ];
  return parkingMenu.filter(item => !isEmpty(item)) as SubMenuScreenMenuList[];
};
