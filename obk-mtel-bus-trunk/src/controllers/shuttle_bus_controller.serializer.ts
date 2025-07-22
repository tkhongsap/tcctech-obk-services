import { get } from 'lodash';
import { Prisma } from '../../db/client';
import logging from '../utils/logging';

type ShuttleBusControllerSerializer = Prisma.destinationsGetPayload<{
  include: {
    shuttle_bus_mapping_details: {
      include: {
        shuttle_buses: true,
      }
    },
    time_tables: true;
    destination_flags: true;
  };
}>;

interface ShuttleBusDetail {
  origin: {
    latitude: string;
    longitude: string;
  };
  destination: {
    latitude: string;
    longitude: string;
  };
  duration: {
    text: string;
    value: string;
  };
  duration_in_traffic: {
    text: string;
    value: string;
  };
  distance: {
    text: string;
    value: string;
  };
  detail: {
    id: string;
    name: string;
  };
  course: string;
}

interface TimeTable {
  time: string;
}

interface Flag {
  name: string[];
}
interface StationDetail {
  latitude: string;
  longitude: string;
  name: string;
  shuttleBusDetail: ShuttleBusDetail[];
  time: TimeTable[];
  flag: Flag;
}

export interface ShuttleBusResponse {
  stations: StationDetail[];
}

function shuttleBusSerializer(stations: ShuttleBusControllerSerializer[]): ShuttleBusResponse {
  const serializer = stations.map((station) => {
    const bus = station.shuttle_bus_mapping_details
      .map((bus) => {
        const busPosition = {
          latitude: bus.latitude,
          longitude: bus.longitude,
          course: bus.course,

        }

        return {
          origin: {
            latitude: bus.latitude,
            longitude: bus.longitude,
          },
          course: bus.course,
          destination: {
            latitude: station.latitude,
            longitude: station.longitude,
          },
          detail: {
            id: bus.shuttle_buses.vehicle_id,
            name: bus.shuttle_buses.vehicle_name || '',
          },
          duration: {
            text: get(bus, ['duration', 'text'], ''),
            value: get(bus, ['duration', 'value'], ''),
          },
          duration_in_traffic: {
            text: get(bus, ['duration_in_traffic', 'text'], ''),
            value: get(bus, ['duration_in_traffic', 'value'], ''),
          },
          distance: {
            text: get(bus, ['distance', 'text'], ''),
            value: get(bus, ['distance', 'value'], ''),
          },
        };
      })
      .filter((bus) => bus !== null) as ShuttleBusDetail[]; // Filter out buses without positions

    // Sort the bus details by duration value (ascending)
    const sortedBus = bus.sort((a, b) => {
      const aValue = parseInt(a!.duration.value, 10);
      const bValue = parseInt(b!.duration.value, 10);
      return aValue - bValue;
    });

    const time = station.time_tables.map((row) => {
      return {
        time: row.time,
      };
    });

    return {
      latitude: station.latitude,
      longitude: station.longitude,
      name: station.name,
      shuttleBusDetail: sortedBus,
      flag: { name: (station.destination_flags[0].name as string[]) || [''] },
      time: time,
    };
  });

  return { stations: serializer };
}

export { shuttleBusSerializer };
