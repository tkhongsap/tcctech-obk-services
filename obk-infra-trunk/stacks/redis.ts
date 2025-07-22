import { Construct } from "constructs"
import { TerraformOutput, TerraformStack } from "cdktf"
import initBackend from "../lib/init-backend"
import getVariable from '../config/variable'
import { ElasticacheSubnetGroup } from '../.gen/providers/aws/elasticache-subnet-group'
import { SecurityGroup } from '../.gen/providers/aws/security-group'
import { ElasticacheCluster } from '../.gen/providers/aws/elasticache-cluster'
import { CloudwatchLogGroup } from '../.gen/providers/aws/cloudwatch-log-group'

import map from 'lodash/map'

export default class ElastiCacheRedisStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const { group, vpc } = config
    initBackend(this, group, id)
    const vars = getVariable(this)

    const tags = { 
      name: vars.PROJECT_ID,
      environment: vars.ENVIRONMENT,
    }

    const subnetGroup = new ElasticacheSubnetGroup(this, 'subnet-group', {
      name: vars.PROJECT_ID,
      subnetIds: map(vpc.dbPublicSubnets, 'id'),
      description: `redis subnet group for ${vars.PROJECT_ID}`,
      tags,
    })

    const sg = new SecurityGroup(this, 'redis-sg', {
      name: vars.PROJECT_ID,
      description: `redis security group for ${vars.PROJECT_ID}`,
      vpcId: vpc.vpc.id,
      ingress: [
        {
          cidrBlocks: ["0.0.0.0/0"],
          fromPort: 6379,
          toPort: 6379,
          protocol: "tcp",
        }
      ],
      egress: [
        {
          cidrBlocks: ["0.0.0.0/0"],
          fromPort: 0,
          toPort: 0,
          protocol: "-1",
        }
      ],
      tags,
    })

    const slowLogGroup = new CloudwatchLogGroup(this, 'redis-cloudwatch-slowlog', {
      name: `${vars.PROJECT_ID}/redis/slowlog`,
      retentionInDays: 7,
      tags,
    })
    
    const engineLogGroup = new CloudwatchLogGroup(this, 'redis-cloudwatch-enginelog', {
      name: `${vars.PROJECT_ID}/redis/enginelog`,
      retentionInDays: 7,
      tags,
    })

    const cluster = new ElasticacheCluster(this, 'redis-cluster', {
      clusterId: vars.PROJECT_ID,
      engine: 'redis',
      nodeType: vars.REDIS_NODE_TYPE,
      numCacheNodes: vars.REDIS_NUM_CACHE_NODES,
      parameterGroupName: vars.REDIS_PARAM_GROUP_NAME,
      engineVersion: vars.REDIS_VERSION,
      port: 6379,
      subnetGroupName: subnetGroup.name,
      securityGroupIds: [sg.id],
      applyImmediately: true,
      logDeliveryConfiguration: [
        {
          destination: slowLogGroup.name,
          destinationType: 'cloudwatch-logs',
          logFormat: 'json',
          logType: 'slow-log',
        },
        {
          destination: engineLogGroup.name,
          destinationType: 'cloudwatch-logs',
          logFormat: 'json',
          logType: 'engine-log',
        }
      ],
      tags,
      lifecycle: {
        createBeforeDestroy: true,
        ignoreChanges: [],
      }
    })
    
    new TerraformOutput(this, 'output-subnet-group', {
      value: subnetGroup,
    })
    
    new TerraformOutput(this, 'output-redis-cluster', {
      value: cluster,
    })
  }
}