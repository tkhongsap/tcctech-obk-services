import React, {useEffect} from 'react';

import {logScreenView} from '~/utils/logGA';
import SubMenuScreen from '../components/SubMenuScreen';
import {Parking as ParkingSubMenu} from '../constants/subMenus';
import T from '~/utils/text';

const ParkingServiceScreen = () => {
  useEffect(() => {
    logScreenView('ParkingServiceScreen');
  }, []);

  return (
    <SubMenuScreen
      title={T('General__Parking_services', 'Parking services')}
      menuList={ParkingSubMenu()}
    />
  );
};

export default ParkingServiceScreen;
