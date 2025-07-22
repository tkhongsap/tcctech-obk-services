import { Construct } from "constructs"
import {  TerraformOutput, TerraformStack } from "cdktf"
import initBackend from "../lib/init-backend"
import getVariable from './../config/variable'
import { MskCluster } from "../.gen/providers/aws/msk-cluster"
import { MskConfiguration } from "../.gen/providers/aws/msk-configuration"
import { SecurityGroup } from "../.gen/providers/aws/security-group"
import map from 'lodash/map'

interface config {
  group: string
  vpc: any
}

export default class MSKStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: config) {
    super(scope, id)
    const { group, vpc } = config
    const vars = getVariable(this)
    initBackend(this, group, id)
   
    const mskConfig = new MskConfiguration(this, 'msk-config', {
      kafkaVersions: [vars.MSK_VERSION],
      name: `${vars.PROJECT_ID}-${id}-config`,
      serverProperties: "auto.create.topics.enable = true\n \
      delete.topic.enable = true"
    })

    const sg = new SecurityGroup(this, 'msk-sg', {
      name: `${vars.PROJECT_ID}-${id}-cluster`,
      vpcId: vpc.vpc.id,
      ingress: [
        {
          description:  "",
          fromPort:  0,
          ipv6CidrBlocks:  [],
          prefixListIds:  [],
          protocol:  "-1",
          securityGroups:  [],
          toPort:  0,
          cidrBlocks:  ["0.0.0.0/0"],
        }
      ]
    })

    const cluster = new MskCluster(this, 'msk-cluster', {
      clusterName: `${vars.PROJECT_ID}-${id}-cluster`,
      kafkaVersion: vars.MSK_VERSION,
      numberOfBrokerNodes: vars.MSK_NO_OF_BROKER_NODES,
      clientAuthentication: {
        unauthenticated: true,
        sasl: {
          iam: false,
          scram: true,
        }
      },
      encryptionInfo: {
        encryptionInTransit: {
          clientBroker: 'TLS_PLAINTEXT',
        },
      },
      brokerNodeGroupInfo: {
        instanceType: vars.MSK_INSTANCE_TYPE,
        storageInfo: {
          ebsStorageInfo: {
            volumeSize: vars.MSK_DISK_SIZE,
          }
        },
        clientSubnets: map(vpc.mskPrivateSubnets || [], (subnet:any) => subnet.id),
        securityGroups: [sg.id],
      },
      configurationInfo: {
        arn: mskConfig.arn,
        revision: mskConfig.latestRevision,
      },
      openMonitoring: {
        prometheus: {
          jmxExporter: {
            enabledInBroker: true,
          },
          nodeExporter: {
            enabledInBroker: true,
          },
        }
      }
    })

    new TerraformOutput(this, 'cluster', {
      value: cluster,
    })
  }
}
