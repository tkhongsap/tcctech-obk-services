import {hookstate, useHookstate} from '@hookstate/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MembersShowResponse,
  OutdoorZoneResponse,
  TowerData,
  WrappedResponseACZoneDataData,
} from 'ob-bms-sdk/dist/api';
import {memberState} from './member';
import * as OB_BMS_SDK from 'ob-bms-sdk';
import {ListSelect} from '~/components/molecules/SelectList';
import bmsService from '~/services/bmsService';
import {get, orderBy} from 'lodash';

interface BuildingAccess {
  showMyQrWhenLaunchesApp: boolean;
  towers?: TowerData[];
  outdoor?: OutdoorData[];
  acZone?: WrappedResponseACZoneDataData[];
}

type ACZoneType = WrappedResponseACZoneDataData[] | undefined | null;
export type OutdoorData = OutdoorZoneResponse & {id: string};

const DEFAULT_STATE = {
  showMyQrWhenLaunchesApp: false,
  towers: [],
  acZone: [],
};

const buildingAccessState = hookstate<BuildingAccess>({...DEFAULT_STATE});

const useBuildingAccessState = () => useHookstate(buildingAccessState);

const buildingAccessAction = {
  setShowMyQrWhenLaunchesApp: async (value: boolean) => {
    buildingAccessState.showMyQrWhenLaunchesApp.set(value);
    await AsyncStorage.setItem('showMyQrWhenLaunchesApp', value.toString());
  },
  getTower: async () => {
    try {
      if (memberState.id.value) {
        const result = await OB_BMS_SDK.client.membersShow(
          memberState.id.value,
        );
        //TODO: esult?.data?.data api return type MembersShowResponse[] but reponse type is MembersShowResponse
        const data: MembersShowResponse | null = result?.data
          ?.data as MembersShowResponse | null;

        buildingAccessState.towers.set(data?.towers);
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  },
  getOutDoor: async () => {
    try {
      const result = await OB_BMS_SDK.client.towersOutdoorindex();
      const outdoor = result.data.data;
      buildingAccessState.outdoor.set(outdoor as any);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  },
  mapTower: async (languageSelected: any) => {
    const towers: ListSelect[] = [];
    const _towerList = buildingAccessState.towers.value ?? [];
    _towerList.map(tower => {
      const towerNameFallback = tower.display_name
        ? tower.display_name.en
        : tower.name;
      towers.push({
        name: tower.display_name[languageSelected] ?? towerNameFallback,
        value: tower.id,
      });
    });
    return towers;
  },
  mapOutdoor: (languageSelected: string) => {
    const towers: OutdoorData[] = [];
    buildingAccessState.outdoor.value?.map((tower: any) => {
      const towerNameFallback = tower.display_name
        ? tower.display_name.en
        : tower.name;
      towers.push({
        code: tower.code,
        id: tower.id,
        name: get(tower.display_name, languageSelected) ?? towerNameFallback,
      });
    });
    return towers;
  },
  mapLocation: async (languageSelected: any, selectedTower: string) => {
    const floors: ListSelect[] = [];
    const _towerList = buildingAccessState.towers.value ?? [];
    const index = _towerList.map(e => e.id).indexOf(selectedTower);

    if (index >= 0) {
      _towerList[index].floors.map(floor => {
        const locationFallback = floor.display_name
          ? floor.display_name.en
          : floor.name;
        floors.push({
          name: floor.display_name[languageSelected] ?? locationFallback,
          value: floor.id,
        });
      });
      const sortedFloor = orderBy(
        floors,
        [floor => Number(floor.name.replace(/([a-z]+)/gi, ''))],
        ['asc'],
      );
      return sortedFloor;
    }
  },
  mapACZone: async (selectedFloor: string) => {
    const acZones: ListSelect[] = [];
    const _acZoneList = buildingAccessState.acZone.value ?? [];
    const index = _acZoneList.map(e => e.floor_id).indexOf(selectedFloor);

    if (index >= 0) {
      _acZoneList.map(acZone => {
        acZones.push({
          name: acZone.name,
          value: acZone.id,
        });
      });
    } else {
      const acZoneData: ACZoneType = (await bmsService.getACZones(
        selectedFloor,
      )) as ACZoneType;
      if (acZoneData) {
        acZoneData.map(acZone => {
          acZones.push({
            name: acZone.name,
            value: acZone.id,
          });
        });
        buildingAccessState.acZone.set(acZoneData);
      }
    }
    const sortedAcZone = orderBy(
      acZones,
      [acZone => Number(acZone.name.replace(/([a-z]+)/gi, ''))],
      ['asc'],
    );
    return sortedAcZone;
  },
};

export {buildingAccessState, buildingAccessAction, useBuildingAccessState};
