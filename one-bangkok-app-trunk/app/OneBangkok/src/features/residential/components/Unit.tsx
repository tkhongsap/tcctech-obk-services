import {View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon, Text} from '~/components/atoms';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import {modalActions, useModal} from './ResidentialModal';
import {hookstate, useHookstate} from '@hookstate/core';

type Property = {
  companyName: string;
  projectName: string;
  buildingPhase: string;
  floorZone: string;
  unitNumber: string;
  customer: string;
  isAllocated: boolean;
  setMapping: boolean;
  isDefault: boolean;
};
type Building = {
  name: string;
  isDefault: boolean;
  properties: Property[];
};

type BuildingProps = {
  buildings: Building[];
};

type FloorProps = {
  building: Building;
};

type BuildingState = {
  buildings: Building[];
};

const buildingState = hookstate<BuildingState>({buildings: []});
const getUseBuildingState = (): typeof useBuildingState => {
  const useBuildingState = useHookstate(buildingState).get({noproxy: true});
  return useBuildingState;
};

const BuildingModal = ({buildings}: BuildingProps) => {
  const [_, modalAction] = useModal();

  const renderIsDefault = (isDefault: boolean) => {
    if (isDefault) {
      return (
        <Text size="C1" weight="bold" color="subtitle-muted">
          Default
        </Text>
      );
    }
  };

  const selectBuilding = (building: Building) => {
    modalActions.setContent(<FloorModal building={building} />);
    modalActions.show();
  };

  return (
    <View className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0">
      <View className="flex-row w-full justify-between pb-4">
        <TouchableOpacity onPress={() => modalAction.hide()}>
          <Text color="dark-teal">Cancel</Text>
        </TouchableOpacity>
        <Text color="dark-gray" weight="bold">
          Building
        </Text>
        <TouchableOpacity>
          <Text color="dark-teal">Done</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-6">
        {buildings.map(building => (
          <TouchableOpacity
            key={building.name}
            onPress={() => selectBuilding(building)}
            className="px-4 border flex flex-col border-line-light w-full  mb-3">
            <View className="py-4 flex flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <Text className="text-dark-gray-light mt-2 font-medium m-0">
                  {building.name}
                </Text>
                {renderIsDefault(building.isDefault)}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const FloorModal = ({building}: FloorProps) => {
  const [selectedFloor, setSelectedFloor] = useState<Property>();
  const [_, modalAction] = useModal();
  const buildings = getUseBuildingState().buildings as Building[];

  const renderIsDefault = (isDefault: boolean) => {
    if (isDefault) {
      return (
        <Text size="C1" weight="bold" color="subtitle-muted">
          Default
        </Text>
      );
    }
    return <></>;
  };

  const renderSelectedFloor = (currentFloorZone: string) => {
    if (currentFloorZone === selectedFloor?.floorZone) {
      return (
        <View className="">
          <Icon type={'checkedIcon'} width={16} height={16} color={'#292929'} />
        </View>
      );
    }
  };

  const done = async () => {
    // TODO: call api to update default unit

    updateBuildingState();
    modalAction.hide();
  };

  const updateBuildingState = () => {
    const updatedBuildings = buildings.map(building => {
      const properties = building.properties.map(property => ({
        ...property,
        isDefault: property.floorZone === selectedFloor?.floorZone,
      }));

      return {
        ...building,
        isDefault: building.name === selectedFloor?.buildingPhase,
        properties,
      };
    });
    buildingState.set({buildings: updatedBuildings});
  };

  return (
    <View className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0">
      <View className="flex-row w-full justify-between pb-4">
        <TouchableOpacity onPress={() => modalAction.hide()}>
          <Text color="dark-teal">Cancel</Text>
        </TouchableOpacity>
        <Text color="dark-gray" weight="bold">
          Floor
        </Text>
        <TouchableOpacity onPress={done}>
          <Text color="dark-teal">Done</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-6">
        {building?.properties.map(property => (
          <TouchableOpacity
            key={property.unitNumber}
            onPress={() => setSelectedFloor(property)}
            className={`px-4 border flex flex-col  w-full  mb-3 ${
              selectedFloor?.floorZone === property.floorZone
                ? 'bg-light-gray-light border-navy-light font-bold'
                : 'border-line-light '
            }`}>
            <View className="py-4 flex flex-row justify-between items-center">
              <View className="flex-row items-center gap-2 justify-center">
                <Text
                  className={`text-dark-gray-light mt-2  m-0 ${
                    selectedFloor?.floorZone === property.floorZone
                      ? ' font-bold text-dark-teal-light'
                      : ' font-medium'
                  }`}>
                  {property.floorZone}
                </Text>
                {renderIsDefault(property.isDefault)}
              </View>
              {renderSelectedFloor(property.floorZone)}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const Unit = () => {
  const [defaultUnit, setDefaultUnit] = useState<Property>();
  const buildings = getUseBuildingState().buildings as Building[];

  useEffect(() => {
    const fetchData = async () => {
      const {tenantId} = await residentialTenantAction.getTenant();
      if (tenantId) {
        const [ob1, ob2] = await Promise.all([
          serviceMindService.propertyDetail('OB1'),
          serviceMindService.propertyDetail('OB2'),
        ]);
        buildingState.set({
          buildings: [
            {
              name: 'OB1',
              isDefault: isDefaultBuilding(ob1.data.properties),
              properties: ob1.data.properties,
            },
            {
              name: 'OB2',
              isDefault: isDefaultBuilding(ob2.data.properties),
              properties: ob2.data.properties,
            },
          ],
        });
      }
    };
    fetchData().catch();
  }, []);

  // listening buildings and update default unit
  useEffect(() => {
    const properties = buildings
      .map(building => building.properties)
      .flatMap(property => property);

    getDefaultUnit(properties);
  }, [buildings]);

  const getDefaultUnit = (properties: Property[]) => {
    const unit = properties.find(property => property.isDefault === true);
    if (unit !== undefined) {
      setDefaultUnit(unit);
    }
  };

  const isDefaultBuilding = (properties: Property[]) => {
    return properties.some(p => p.isDefault === true);
  };

  const onPressBuildingModal = () => {
    modalActions.setContent(<BuildingModal buildings={buildings} />);
    modalActions.show();
  };

  const displayUnitFormat = (unitNumber: string = '') => {
    return unitNumber ? unitNumber.replace('-', ' - ') : '';
  };

  return (
    <TouchableOpacity
      onPress={onPressBuildingModal}
      className="bg-dark-teal-light px-4 py-[3px] flex-row justify-between">
      <Text size="B2" weight="bold" className="text-[#E6E6E6]">
        Unit
      </Text>

      <View className="flex flex-row ">
        <Text size="B2" className="text-[#E6E6E6] mr-2">
          {displayUnitFormat(defaultUnit?.unitNumber)}
        </Text>
        <Icon
          type={'right'}
          width={14}
          height={14}
          color={'#E6E6E6'}
          className="origin-center rotate-[90deg]"
        />
      </View>
    </TouchableOpacity>
  );
};

export default Unit;
