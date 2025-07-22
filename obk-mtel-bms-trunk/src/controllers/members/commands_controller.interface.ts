import { Command } from '../../../db/client/';

export type LiftCallCommandData = {
  location_id: string;
  destination_floor_id: string;
};

export interface CommandsCreateBody {
  name: string;
  data: LiftCallCommandData;
}
export interface CommandData extends Partial<Command> {}
export type CommandsCreateResponse = CommandData;

export interface CommandsIndexQuery {
  name?: string;
  order_by?: string;
  order_direction?: string;
  page_number?: number;
  page_size?: number;
}
export type CommandsIndexResponse = CommandData[];
