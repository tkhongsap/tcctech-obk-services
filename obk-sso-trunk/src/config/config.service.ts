import { Injectable } from '@nestjs/common';
import { ConfigService as DefaultConfigService } from '@nestjs/config';
import { ConfigType } from './configuration';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: DefaultConfigService) {}

  get<K extends keyof ConfigType>(key: K): ConfigType[K] {
    return this.configService.get(key) as ConfigType[K];
  }
}
