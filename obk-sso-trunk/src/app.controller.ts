/* eslint-disable @typescript-eslint/require-await */
import { Controller, Get } from '@nestjs/common';
import * as pkg from '../package.json'; // adjust the path as needed

interface PackageJson {
  version: string;
}

const typedPkg = pkg as PackageJson;

@Controller()
export class AppController {
  @Get('health')
  async health(): Promise<{ appVersion: string }> {
    return {
      appVersion: typedPkg.version,
    };
  }
}
