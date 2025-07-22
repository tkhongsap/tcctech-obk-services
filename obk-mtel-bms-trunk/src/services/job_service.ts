import { flatMap, omit, uniqBy } from 'lodash';
import downloadFromS3 from '../utils/aws/s3/download_from_s3';
import { readAndParseJsonFile } from '../utils/file/file_utils';
import { ProjectRepository, TowerRepository, ZoneRepository } from '../repositories';
import { JOB_NAME } from '../consts';
import { SyncResult } from '../controllers/integrations/fs/jobs_controller_interface';
import FloorRepository from '../repositories/floor_repository';
import LocationRepository from '../repositories/location_repository';
import {
  ErrorSync,
  FloorData,
  LocationData,
  LocationFileData,
  TenantData,
  TowerData,
  TowerFileData,
  ZoneData,
} from './interfaces/job_service.interface';
import TenantRepository from '../repositories/tenant_repository';
import { AccessorType, SyncType } from '../../db/client/';
import AuthorizedLocationRepository from '../repositories/authorized_location_repository';
import BeaconRepository from '../repositories/beacon_repository';
import s3Client from '../utils/aws/s3/s3_client';
import logging from '../utils/logging';
import dayjs, { locale } from 'dayjs';
import SyncDataFromS3Repository from '../repositories/sync_data_from_s3_repository';
import cache from '../libs/cache';

export const FILE_NAMES = {
  location: process.env.FS_LOCATION_FILE_NAME ?? 'location.json',
  tenant: process.env.FS_TENANT_FILE_NAME ?? 'tenant.json',
  tower: process.env.FS_TOWER_FILE_NAME ?? 'tower.json',
  towerResidential: process.env.FS_TOWER_RESIDENTIAL_FILE_NAME ?? 'tower_residential.json',
  locationResidential: process.env.FS_LOCATION_RESIDENTIAL_FILE_NAME ?? 'location_residential.json',
};

export default class JobService {
  public async sync(job: string): Promise<SyncResult> {
    let result: ErrorSync[] = [];
    switch (job) {
      case JOB_NAME.tower:
        result = await this.syncTower(SyncType.manual, FILE_NAMES.tower);
        break;
      case JOB_NAME.location:
        result = await this.syncLocation(SyncType.manual, FILE_NAMES.location);
        break;
      case JOB_NAME.tenant:
        result = await this.syncTenant(SyncType.manual);
        break;
      case JOB_NAME.towerResidential:
        result = await this.syncTower(SyncType.manual, FILE_NAMES.towerResidential);
        break;
      case JOB_NAME.locationResidential:
        result = await this.syncLocation(SyncType.manual, FILE_NAMES.locationResidential);
        break;
      default:
        break;
    }

    return {
      sync: {
        result: result.length === 0,
        jobError: result as ErrorSync[],
      },
    };
  }

  public async syncTenant(updateSource: SyncType, lastModifiedFromS3?: Date): Promise<ErrorSync[]> {
    const errorArray: ErrorSync[] = [];
    if (process.env.ENABLE_S3_DOWNLOAD === 'true') {
      await downloadFromS3(FILE_NAMES.tenant, './tmp/tenant.json');
    }
    const tenantData = readAndParseJsonFile<TenantData>('./tmp/tenant.json');
    if (tenantData) {
      for (const tenant of tenantData.data) {
        try {
          const tenantUpsertedData = {
            uid: tenant.tenantID.toString(),
            name: tenant.tenantName,
            display_name: {
              nameEn: tenant.nameEng,
              nameTh: tenant.nameThai,
            },
            email: tenant.email || '',
            phone_number: tenant.phone || '',
            address: tenant.address || '',
            metadata: JSON.parse(JSON.stringify(tenant)),
          };
          const tenantUpsertedResult = await TenantRepository.upsert({
            create: tenantUpsertedData,
            update: tenantUpsertedData,
            where: {
              uid: tenantUpsertedData.uid,
            },
          });
          const authorizedLocationList = tenant.tenantAuthFloors;
          for (const authorizedLocation of authorizedLocationList) {
            const locationResult = await LocationRepository.findFirst({
              where: { uid: authorizedLocation.locationID.toString() },
            });
            if (locationResult) {
              const authorizedLocationData = {
                tenant: {
                  connect: { id: tenantUpsertedResult.id },
                },
                accessor_type: AccessorType.tenant,
                default: authorizedLocation.isDefaultFloor,
                location: {
                  connect: { id: locationResult.id },
                },
              };
              try {
                await AuthorizedLocationRepository.upsert({
                  create: authorizedLocationData,
                  update: authorizedLocationData,
                  where: {
                    accessor_type_tenant_id_location_id: {
                      accessor_type: AccessorType.tenant,
                      tenant_id: tenantUpsertedResult.id,
                      location_id: locationResult.id,
                    },
                  },
                });
              } catch (error) {
                errorArray.push({
                  type: 'cannot upsert authorized location',
                  uid_name: `${tenant.tenantID}:${tenant.tenantName}_${authorizedLocation.locationID}`,
                });
              }
            } else {
              errorArray.push({
                type: 'cannot find authorized location',
                uid_name: `${tenant.tenantID}:${tenant.tenantName}_${authorizedLocation.locationID}`,
              });
            }
          }
        } catch (error) {
          errorArray.push({
            type: 'tenant',
            uid_name: `${tenant.tenantID}:${tenant.tenantName}`,
          });
        }
      }
      await cache.delete('TENANT_LIST');
    }

    if (errorArray.length === 0) {
      await SyncDataFromS3Repository.update({
        where: { name: FILE_NAMES.tenant },
        data: {
          last_modified: lastModifiedFromS3 ? lastModifiedFromS3 : new Date(),
          sync_type: updateSource,
        },
      });
      logging.info('successfully sync tenant');
    }

    return errorArray;
  }

  public async syncLocation(updateSource: SyncType, fileName: string, lastModifiedFromS3?: Date): Promise<ErrorSync[]> {
    const errorArray: ErrorSync[] = [];
    if (process.env.ENABLE_S3_DOWNLOAD === 'true') {
      await downloadFromS3(fileName, './tmp/location.json');
    }
    const locationData = readAndParseJsonFile<LocationFileData>('./tmp/location.json');

    const locations = locationData.locationMapping;

    for (const location of locations) {
      try {
        const projectName = location.projectName;
        const projectUid = location.projectID;
        const projectId = await this.createProjectIfNotExists(projectName, projectUid.toString());

        const towerData = {
          name: location.towerName,
          uid: location.towerID.toString(),
          display_name: {
            en: location.towerName,
            th: location.nameThai_1 ? location.nameThai_1 : location.towerName,
          },
          project_id: projectId,
        };

        const towerId = await this.createOrUpdateTower(projectId, towerData);

        const zoneData = {
          uid: location.zoneID.toString(),
          name: location.zoneName,
          display_name: {},
          tower_id: towerId,
        };

        const zoneId = await this.createOrUpdateZone(towerId, zoneData);

        const floorData = {
          uid: location.floorID.toString(),
          name: location.floorName,
          display_name: {},
          tower_id: towerId,
        };

        const floorId = await this.createOrUpdateFloor(towerId, floorData);

        const locationData = {
          uid: location.locationID.toString(),
          name: location.locationName,
          tower_id: towerId,
          floor_id: floorId,
          zone_id: zoneId,
        };

        const locationID = await this.createOrUpdateLocation(locationData);

        if (location.beaconID) {
          const beaconData = {
            uid: location.beaconID.toString(),
            name: location.beaconName,
            location_id: locationID,
            major: location.beaconMajorCode,
            minor: location.beaconMinorCode,
          };

          await BeaconRepository.upsert({
            create: beaconData,
            update: beaconData,
            where: {
              uid_location_id: {
                uid: beaconData.uid,
                location_id: beaconData.location_id,
              },
            },
          });
        }
      } catch (error) {
        errorArray.push({
          type: 'location',
          uid_name: `${location.locationName}:${location.projectName}:${location.towerName}:${location.zoneName}:${location.floorName}`,
        });
      }
    }

    if (errorArray.length === 0) {
      await SyncDataFromS3Repository.upsert({
        where: { name: fileName },
        create: {
          name: fileName,
          last_modified: lastModifiedFromS3 ? lastModifiedFromS3 : new Date(),
          sync_type: updateSource,
        },
        update: {
          last_modified: lastModifiedFromS3 ? lastModifiedFromS3 : new Date(),
          sync_type: updateSource,
        },
      });
      logging.info('successfully sync location');
    }

    return errorArray;
  }

  public async syncTower(updateSource: SyncType, fileName: string, lastModifiedFromS3?: Date): Promise<ErrorSync[]> {
    const errorArray: ErrorSync[] = [];

    if (process.env.ENABLE_S3_DOWNLOAD === 'true') {
      await downloadFromS3(fileName, './tmp/tower.json');
    }
    const towerData = readAndParseJsonFile<TowerFileData>('./tmp/tower.json');

    const allLocations = flatMap(towerData.data, 'locations');

    // Find unique projects by projectId
    const uniqueProjects = uniqBy(allLocations, 'projectID');

    // Extract unique project information
    const uniqueProjectInfo = uniqueProjects.map((project) => ({
      name: project.projectName as string,
      display_name: {},
      uid: (project.uid as string) ?? project?.projectID?.toString(),
    }));

    for (const project of uniqueProjectInfo) {
      try {
        await this.createProjectIfNotExists(project.name, project.uid);
      } catch (error) {
        errorArray.push({ type: 'project', uid_name: project.name });
      }
    }

    for (const tower of towerData.data) {
      const project = await ProjectRepository.findFirst({ where: { name: tower.locations[0].projectName } });
      if (project) {
        if (tower.locations[0].projectName === project.name) {
          const towerData = {
            name: tower.towerName,
            uid: tower.towerID.toString(),
            project_id: project.id,
            display_name: { en: tower.nameEng, th: tower.nameThai },
          };

          try {
            const towerUpsertedResult = await this.createOrUpdateTower(project.id, towerData);

            for (const location of tower.locations) {
              try {
                const zoneData = {
                  uid: location.zoneID.toString(),
                  name: location.zoneName,
                  display_name: {},
                  tower_id: towerUpsertedResult,
                };

                await this.createOrUpdateZone(towerUpsertedResult, zoneData);
              } catch (error) {
                errorArray.push({
                  type: 'zone',
                  uid_name: `${location.towerID}:${location.towerName}_${location.zoneID}:${location.zoneName}`,
                });
              }
            }
          } catch (error) {
            errorArray.push({ type: 'tower', uid_name: `${tower.towerID}:${tower.towerName}` });
          }
        }
      }
    }

    if (errorArray.length === 0) {
      await SyncDataFromS3Repository.upsert({
        where: { name: fileName },
        create: {
          name: fileName,
          last_modified: lastModifiedFromS3 ? lastModifiedFromS3 : new Date(),
          sync_type: updateSource,
        },
        update: {
          last_modified: lastModifiedFromS3 ? lastModifiedFromS3 : new Date(),
          sync_type: updateSource,
        },
      });
      logging.info('successfully sync tower');
    }

    return errorArray;
  }

  private async createProjectIfNotExists(projectName: string, uid: string): Promise<string> {
    const projectData = {
      name: projectName,
      display_name: {},
      uid,
    };

    const projectUpsertedResult = await ProjectRepository.upsert({
      create: projectData,
      update: projectData,
      where: { name: projectName },
    });
    return projectUpsertedResult.id;
  }

  private async createOrUpdateTower(projectId: string, towerData: TowerData): Promise<string> {
    const towerUpsertedResult = await TowerRepository.upsert({
      create: towerData,
      update: omit(towerData, 'project_id'),
      where: {
        uid: towerData.uid.toString(),
      },
    });

    return towerUpsertedResult.id;
  }

  private async createOrUpdateZone(towerId: string, zoneData: ZoneData): Promise<string> {
    const zoneUpsertedResult = await ZoneRepository.upsert({
      create: zoneData,
      update: omit(zoneData, 'tower_id'),
      where: {
        uid_tower_id: {
          uid: zoneData.uid.toString(),
          tower_id: zoneData.tower_id,
        },
      },
    });

    return zoneUpsertedResult.id;
  }

  private async createOrUpdateFloor(towerId: string, floorData: FloorData): Promise<string> {
    const floorUpsertedResult = await FloorRepository.upsert({
      create: floorData,
      update: omit(floorData, 'tower_id'),
      where: {
        uid_tower_id: {
          uid: floorData.uid.toString(),
          tower_id: floorData.tower_id,
        },
      },
    });

    return floorUpsertedResult.id;
  }

  private async createOrUpdateLocation(locationData: LocationData): Promise<string> {
    const location = await LocationRepository.upsert({
      create: locationData,
      update: omit(locationData, ['tower_id', 'floor_id', 'zone_id']),
      where: {
        uid_tower_id_zone_id_floor_id: {
          uid: locationData.uid,
          tower_id: locationData.tower_id,
          floor_id: locationData.floor_id,
          zone_id: locationData.zone_id,
        },
      },
    });
    return location.id;
  }

  public async autoSync(): Promise<SyncResult | boolean> {
    let errorResult: ErrorSync[] = [];
    const getLogSyncFile = await SyncDataFromS3Repository.findMany();

    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      logging.info('Bucket name is empty, terminating autosync process.');
      return false;
    }

    for (const data of getLogSyncFile) {
      const params = {
        Bucket: bucketName,
        Key: data.name,
      };

      const metadata = await s3Client.statObject(params.Bucket, params.Key);
      const LastModified = metadata.lastModified;
      if (!LastModified) {
        logging.info('cannot find last modified');
        return false;
      }

      const lastModifiedFromDB = data.last_modified;

      const isModified = dayjs(LastModified).isAfter(dayjs(lastModifiedFromDB));
      if (isModified) {
        if (data.name === FILE_NAMES.tower) {
          errorResult = await this.syncTower(SyncType.autosync, FILE_NAMES.tower, LastModified);
        } else if (data.name === FILE_NAMES.location) {
          errorResult = await this.syncLocation(SyncType.autosync, FILE_NAMES.location, LastModified);
        } else if (data.name === FILE_NAMES.tenant) {
          errorResult = await this.syncTenant(SyncType.autosync, LastModified);
        } else if (data.name === FILE_NAMES.towerResidential) {
          errorResult = await this.syncTower(SyncType.autosync, FILE_NAMES.towerResidential, LastModified);
        } else if (data.name === FILE_NAMES.locationResidential) {
          errorResult = await this.syncLocation(SyncType.autosync, FILE_NAMES.locationResidential, LastModified);
        } else {
          logging.info(`No sync action taken for file name: ${data.name}`);
        }
        if (errorResult.length > 0) {
          logging.error(`Sync failed for ${data.name}: ${JSON.stringify(errorResult)}`);
          errorResult = errorResult.concat(errorResult);
        } else {
          logging.info(`Successfully synced ${data.name}`);
        }
      }
    }

    return {
      sync: {
        result: errorResult.length === 0,
        jobError: errorResult,
      },
    };
  }
}
