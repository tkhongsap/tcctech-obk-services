import {Dimensions} from 'react-native';
const { width } = Dimensions.get('window');
// Determine if the device is a tablet (or iPad)
export const isTablet = width >= 768;
export const  deviceWidth = width;