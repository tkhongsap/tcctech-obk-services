import {find} from 'lodash';
import RNFS from 'react-native-fs';

export interface Location {
  id: string;
  uid: string;
  name: string;
  display_name: {
    en: string;
    th: string;
  };
  coordinate: string;
  floor: {
    id: string;
    uid: string;
    name: string;
    display_name: {
      en: string;
      th: string;
    };
    tower_id: string;
    created_at: string;
    updated_at: string;
  };
  tower: {
    id: string;
    uid: string;
    name: string;
    display_name: {
      en: string;
      th: string;
    };
    created_at: string;
    updated_at: string;
  };
}

export interface LocationData {
  locations: Location[];
}

class LocationUtils {
  mapBeacon = async (minor: string, major: string) => {
    // [REFACTOR] change file location
    const filePath = RNFS.DocumentDirectoryPath + '/locations.json';

    const fileContent = await RNFS.readFile(filePath);

    // Parse the JSON content
    const parsedData = JSON.parse(fileContent);

    const location: LocationData = parsedData;

    return find(location.locations, {coordinate: `${major},${minor}`});
  };
  getLocation = async () => {
    // [REFACTOR] change file location
    const filePath = RNFS.DocumentDirectoryPath + '/locations.json';

    const fileContent = await RNFS.readFile(filePath);

    // Parse the JSON content
    const parsedData = JSON.parse(fileContent);

    const location: LocationData = parsedData;

    return location;
  };
}

const locationUtils = new LocationUtils();
export default locationUtils;
