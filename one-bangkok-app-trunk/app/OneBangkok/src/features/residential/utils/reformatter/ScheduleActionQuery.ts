import data from '../../tmp/schedule-action.json';
type ZoneType = {
  name: string | null;
  id: number;
  type: number;
  rooms_temp: number | null;
  rooms: any[]; // You can replace `any[]` with a more specific type if you know the structure
  modules: ModuleType[];
  scenarios: any | null; // Replace `any` with a more specific type if needed
};
type ModuleType = {
  id: string;
  type: string;
  name: string;
  setup_date: number;
  room_name: string;
  bridge: string;
  on: boolean;
};
type ReadableTimeTable = {
  timeReadable: string;
  zoneId: number;
  mOffset: number;
  dateEnd: string;
  dateStart: string;
};

/** Query Types */
type QueryZoneByZoneId = {
  zoneId: number;
};

/** Query Response Types */
type QueryResponse<T = any> = {
  status: boolean;
  result?: T;
};

/** Display Type */
type Display = {
  time: string;
  title: string;
  description: string;
};

export class ScheduleActionQuery {
  private payload: JSON;
  private zones?: ZoneType[];

  constructor(initialValue: JSON) {
    this.payload = initialValue;
    this.zones = this.payload?.body?.homes?.[0]?.schedules?.zones ?? null;
  }

  public toDisplayFormat(tables: ReadableTimeTable[]): Display[] {
    const tbs: Display[] = [];
    for (let a = 0; a < tables.length; a++) {
      const tb = tables[a];
      const zone = this.getZoneByZoneId({zoneId: tb.zoneId});
      if (!zone.status) continue;
      if (tb.dateStart != tb.dateEnd) tb.timeReadable = '00.00';

      tbs.push({
        title: (zone.result?.name ?? '-') as string,
        time: tb.timeReadable,
        description: 'Description',
      });

      //   console.log('table[' + a + '], ', JSON.stringify(tables[a], null, 2));
    }

    return tbs;
  }
  public getZoneByZoneId(
    query: QueryZoneByZoneId,
  ): QueryResponse<ZoneType | null> {
    if (!Array.isArray(this.zones)) {
    } else {
      for (let a = 0; a < this.zones.length; a++) {
        const z = this.zones[a];
        if (!(query.zoneId === z['id'])) continue;
        return {status: true, result: z};
      }
    }
    return {status: false, result: null};
  }

  public myMethod(): void {}

  public setProperty(newValue: string): void {}
}
