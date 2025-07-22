import { Construct } from "constructs"
import { TerraformOutput } from 'cdktf'
import getVariable from '../config/variable'
import { DbInstance } from '../.gen/providers/aws/db-instance'
import { DbSubnetGroup } from '../.gen/providers/aws/db-subnet-group'
import { SecurityGroup } from '../.gen/providers/aws/security-group'
import { GithubProvider } from "../.gen/providers/github/provider"
import { ActionsEnvironmentSecret } from "../.gen/providers/github/actions-environment-secret";

import map from 'lodash/map'

interface config {
  vpc: any
  dbIdentifier: string
  dbName: string
  repository?: string
  secretPrefix?: string
}

export default class RDSConstructor extends Construct {
  public readonly helmLbController:any
  constructor(scope: Construct, id: string, config:config) {
    super(scope, id)
    const vars = getVariable(this)

    new GithubProvider(this, 'github', {
      owner: 'mtel-thailand',
      token: vars.GITHUB_TOKEN,
    })

    const { vpc, dbIdentifier, dbName, repository, secretPrefix = '' } = config

    const tags = {
      name: `${vars.PROJECT_ID}-${dbIdentifier}-pg`,
    }

    const publicDB = !!Number(process?.env?.PG_PUBLIC)
    const deletionProtection = !!Number(process?.env?.PG_DELTION_PROTECTION)

    const rdsSubnetGroup = new DbSubnetGroup(this, 'subnet-group', {
      name: `${vars.PROJECT_ID}-${id}-subnet-group`,
      subnetIds: [
        // ...map(vpc.dbPrivateSubnets, 'id'),
        ...map(vpc.dbPublicSubnets, 'id'),
      ],
      // subnetIds: map(publicDB ? vpc.dbPublicSubnets : vpc.dbPrivateSubnets, 'id'),
      description: 'OB RDS Subnet Group',
      tags,
    })

    new TerraformOutput(this, 'subnetGroup', {
      value: rdsSubnetGroup,
    })

    const rdsSg = new SecurityGroup(this, 'rds-sg', {
      name: `${vars.PROJECT_ID}-${id}`,
      description: 'RDS',
      vpcId: vpc.vpc.id,
      ingress: [
        {
          fromPort: 5432,
          toPort: 5432,
          protocol: 'tcp',
          cidrBlocks: ['0.0.0.0/0', vars.CIDR_BLOCK],
        }
      ],
      tags,
    })

    const pg = new DbInstance(this, 'db', {
      autoMinorVersionUpgrade: true,
      allocatedStorage:  vars.PG_COMMON_STORAGE_SIZE,
      storageType:  vars.PG_COMMON_STORAGE_TYPE,
      engine:  "postgres",
      engineVersion:  vars.PG_COMMON_VERSION,
      instanceClass:  vars.PG_COMMON_INSTANCE_TYPE,
      identifier:  `${vars.PROJECT_ID}-${dbIdentifier}`,
      dbName:  `${dbName}_${ vars.ENVIRONMENT }`,
      username:  vars.PG_COMMON_USERNAME,
      password:  vars.PG_COMMON_PASSWORD,
      port:  5432,
      publiclyAccessible:  publicDB,
      dbSubnetGroupName:  rdsSubnetGroup.name,
      vpcSecurityGroupIds:  [rdsSg.id],
      skipFinalSnapshot:  true,
      deletionProtection: deletionProtection,
      enabledCloudwatchLogsExports: ['postgresql', 'upgrade'],
      backupRetentionPeriod: vars.PG_COMMON_BACKUP_RETENTION_PERIOD,
      applyImmediately: true,
      caCertIdentifier: 'rds-ca-rsa2048-g1',
      tags,
    })

    if (repository) {
      new ActionsEnvironmentSecret(this, 'pg-host', {
        repository,
        environment: vars.ENVIRONMENT_FULL_NAME,
        secretName: `${secretPrefix}PG_HOST`,
        plaintextValue: pg.address,
      })
      
      new ActionsEnvironmentSecret(this, 'pg-username', {
        repository,
        environment: vars.ENVIRONMENT_FULL_NAME,
        secretName: `${secretPrefix}PG_USERNAME`,
        plaintextValue: vars.PG_COMMON_USERNAME,
      })
      
      new ActionsEnvironmentSecret(this, 'pg-password', {
        repository,
        environment: vars.ENVIRONMENT_FULL_NAME,
        secretName: `${secretPrefix}PG_PASSWORD`,
        plaintextValue: vars.PG_COMMON_PASSWORD,
      })
      
      new ActionsEnvironmentSecret(this, 'pg-db', {
        repository,
        environment: vars.ENVIRONMENT_FULL_NAME,
        secretName: `${secretPrefix}PG_DB`,
        plaintextValue: pg.dbName,
      })
    }
    

    new TerraformOutput(this, 'output-pg', {
      value: pg.endpoint,
    })
  }
}
