import { destinations } from '../../../db/client/';

export interface Coordinate {
  latitude: string;
  longitude: string;
}

export interface BusPosition {
  id: string;
  shuttleBusId: string;
  coordinate: Coordinate;
  course: string;
}

export interface Destination extends Partial<destinations> {
  latitude: any;
  longitude: any;
  id: any;
}
