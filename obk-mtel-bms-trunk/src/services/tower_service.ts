import TCCClient from '../libs/tcc_client';
import cache from '../libs/cache';

export interface OutdoorZone {
  id: string;
  name: string;
  code: string;
  display_name: { en: string; th: string; zh: string };
}

export default class TowerService {
  public async index(): Promise<OutdoorZone[]> {
    await cache.getSet('TCC_ACCESS_TOKEN', async () => {
      const response = await TCCClient.getOauth2Token();
      return response.data.access_token;
    });

    const aqResponse = await TCCClient.getOutdoorZone();
    const result = aqResponse.data.map((x) => {
      const outdoor: OutdoorZone = {
        id: x.name.toUpperCase().replace(/ /g, '_'),
        code: x.code,
        name: x.name,
        display_name: { en: x.display.en, th: x.display.th, zh: x.display.zh },
      };
      return outdoor;
    });
    return result;
  }
}
