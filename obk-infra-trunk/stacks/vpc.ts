import { Construct } from "constructs"
import { TerraformStack, Fn, TerraformOutput } from "cdktf"

import { Vpc } from "../.gen/providers/aws/vpc"
import { Subnet } from "../.gen/providers/aws/subnet"
import { InternetGateway } from "../.gen/providers/aws/internet-gateway";
import { RouteTable } from "../.gen/providers/aws/route-table"
import { RouteTableAssociation } from "../.gen/providers/aws/route-table-association"
import { DefaultRouteTable } from "../.gen/providers/aws/default-route-table"
import { DataAwsAvailabilityZones } from "../.gen/providers/aws/data-aws-availability-zones"

import getVariable from './../config/variable'
import initBackend from "../lib/init-backend"

import forEach from "lodash/forEach"
import toNumber from "lodash/toNumber"

// import { GithubProvider } from "../.gen/providers/github/provider"
// import { ActionsVariable } from "../.gen/providers/github/actions-variable";

import { NatGateway } from "../.gen/providers/aws/nat-gateway";

interface config {
  group: string
  eip: any
}

export default class VpcStack extends TerraformStack {
  public vpc: Vpc
  public readonly publicSubnets: Subnet[]
  public readonly privateSubnets: Subnet[]
  public readonly dbPublicSubnets: Subnet[]
  public readonly dbPrivateSubnets: Subnet[]
  public readonly mskPrivateSubnets: Subnet[]
  public readonly igw: InternetGateway
  public readonly rtPublic: RouteTable

  constructor(scope: Construct, id: string, config: config) {
    super(scope, id)
    const { group, eip } = config
    const vars = getVariable(this)
    initBackend(this, group, id)

    // vpc start
    const vpc = new Vpc(this, 'vpc', {
      cidrBlock: vars.CIDR_BLOCK,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      tags: {
        Name: `${vars.PROJECT_ID}-vpc`,
        environment: vars.ENVIRONMENT,
      },
    })
    // vpc end

    // subnets start
    const azs = new DataAwsAvailabilityZones(this, 'azs', )
    const azCount = toNumber(process?.env?.AZ_COUNT)
    const MSK_NO_OF_BROKER_NODES = toNumber(process?.env?.MSK_NO_OF_BROKER_NODES || azCount)
    const numberOfBrokerNodes = MSK_NO_OF_BROKER_NODES ? (MSK_NO_OF_BROKER_NODES > 3) ? 3 : MSK_NO_OF_BROKER_NODES : azCount
    const subnetIndexArr = Array.from(Array(azCount).keys())
    const publicSubnets = subnetIndexArr.map((index) => {
      const eksClusterTag = {} as any
      eksClusterTag[`kubernetes.io/cluster/${vars.EKS_CLUSTER_NAME}`] = 'owned'
      eksClusterTag["karpenter.sh/discovery"] = vars.EKS_CLUSTER_NAME
      eksClusterTag['kubernetes.io/role/elb'] = 1
      return new Subnet(this, `public-subnet-${index}`, {
        vpcId: vpc.id,
        cidrBlock: Fn.cidrsubnet(vpc.cidrBlock, 8, index),
        availabilityZone: Fn.element(azs.names, index),
        mapPublicIpOnLaunch: true,
        tags: {
          Name: `${vars.PROJECT_ID}-common-public-${index}`,
          environment: vars.ENVIRONMENT,
          Scope: 'common-public',
          ...eksClusterTag,
        },
        dependsOn: [vpc],
      })
    })
    
    const privateSubnets = subnetIndexArr.map((index) => {
      const eksClusterTag = {} as any
      eksClusterTag[`kubernetes.io/cluster/${vars.EKS_CLUSTER_NAME}`] = 'owned'
      eksClusterTag["kubernetes.io/role/internal-elb"] = '1'
      eksClusterTag["karpenter.sh/discovery"] = vars.EKS_CLUSTER_NAME
      return new Subnet(this, `private-subnet-${index}`, {
        vpcId: vpc.id,
        cidrBlock: Fn.cidrsubnet(vpc.cidrBlock, 8, publicSubnets.length + index),
        availabilityZone: Fn.element(azs.names, index),
        tags: {
          Name: `${vars.PROJECT_ID}-common-private-${index}`,
          Scope: 'common-private',
          environment: vars.ENVIRONMENT,
          ...eksClusterTag,
        },
        dependsOn: [vpc],
      })
    })
    // subnet end

    // db subnets start

    const dbPublicSubnets = subnetIndexArr.map((index) => {
      return new Subnet(this, `db-public-subnet-${index}`, {
        vpcId: vpc.id,
        cidrBlock: Fn.cidrsubnet(vpc.cidrBlock, 8, publicSubnets.length + privateSubnets.length + index),
        availabilityZone: Fn.element(azs.names, index),
        mapPublicIpOnLaunch: true,
        tags: {
          Name: `${vars.PROJECT_ID}-db-public-${index}`,
          environment: vars.ENVIRONMENT,
        },
        dependsOn: [vpc],
      })
    })
    
    const dbPrivateSubnets = subnetIndexArr.map((index) => {
      return new Subnet(this, `db-private-subnet-${index}`, {
        vpcId: vpc.id,
        cidrBlock: Fn.cidrsubnet(vpc.cidrBlock, 8, publicSubnets.length + privateSubnets.length + dbPublicSubnets.length + index),
        availabilityZone: Fn.element(azs.names, index),
        tags: {
          Name: `${vars.PROJECT_ID}-db-private-${index}`,
          environment: vars.ENVIRONMENT,
        },
        dependsOn: [vpc],
      })
    })

    const mskPrivateSubnets = Array.from(Array(numberOfBrokerNodes).keys()).map((index) => {
      return new Subnet(this, `msk-private-subnet-${index}`, {
        vpcId: vpc.id,
        cidrBlock: Fn.cidrsubnet(vpc.cidrBlock, 8, publicSubnets.length + privateSubnets.length + dbPublicSubnets.length + dbPrivateSubnets.length + index),
        availabilityZone: Fn.element(azs.names, index),
        tags: {
          Name: `${vars.PROJECT_ID}-msk-private-${index}`,
          environment: vars.ENVIRONMENT,
        },
        dependsOn: [vpc],
      })
    })

    // igw start
    const igw = new InternetGateway(this, 'igw', {
      vpcId: vpc.id,
      tags: {
        Name: `${vars.PROJECT_ID}-igw`,
        environment: vars.ENVIRONMENT,
      },
    })
    // igw end

    const natGateway = new NatGateway(this, 'nat', {
      allocationId: eip.natEip.id,
      subnetId: publicSubnets[0].id,
      tags: {
        Name: `${vars.PROJECT_ID}-nat`,
      }
    })

    // rt start
    // update default route table
    new DefaultRouteTable(this, 'default-rt', {
      defaultRouteTableId: vpc.defaultRouteTableId,
      tags: {
        Name: `${vars.PROJECT_ID}-default-rt`,
        environment: vars.ENVIRONMENT,
      },
    })

    // update public rt
    const rtPublic = new RouteTable(this, 'public-rt', {
      vpcId: vpc.id,
      route: [
        {
          cidrBlock: '0.0.0.0/0',
          gatewayId: igw.id,
        }
      ],
      tags: {
        Name: `${vars.PROJECT_ID}-public-rt`,
        environment: vars.ENVIRONMENT,
      },
    })

    const rtPrivate = new RouteTable(this, 'private-route', {
      vpcId: vpc.id,
      route: [
        {
          cidrBlock: '0.0.0.0/0',
          natGatewayId: natGateway.id,
        }
      ],
      tags: {
        Name: `${vars.PROJECT_ID}-private-rt`,
        environment: vars.ENVIRONMENT,
      },
    })

    forEach(publicSubnets, (subnet, index) => {
      new RouteTableAssociation(this, `public-rt-subnet-${index}`, {
        routeTableId: rtPublic.id,
        subnetId: subnet.id,
      })
    })

    forEach(dbPublicSubnets, (subnet, index) => {
      new RouteTableAssociation(this, `db-public-rt-subnet-${index}`, {
        routeTableId: rtPublic.id,
        subnetId: subnet.id,
      })
    })

    forEach(privateSubnets, (subnet, index) => {
      new RouteTableAssociation(this, `private-route-private-subnets-${index}`, {
        routeTableId: rtPrivate.id,
        subnetId: subnet.id,
      })
    })

    forEach(dbPrivateSubnets, (subnet, index) => {
      new RouteTableAssociation(this, `db-private-rt-subnet-${index}`, {
        routeTableId: rtPrivate.id,
        subnetId: subnet.id,
      })
    })
    // rt end

    this.vpc = vpc
    this.publicSubnets = publicSubnets
    this.privateSubnets = privateSubnets
    this.dbPublicSubnets = dbPublicSubnets
    this.dbPrivateSubnets = dbPrivateSubnets
    this.mskPrivateSubnets = mskPrivateSubnets
    this.igw = igw
    this.rtPublic = rtPublic

    new TerraformOutput(this, 'vpc-msk-subnets', {
      value: {mskPrivateSubnets, numberOfBrokerNodes,},
    })

    // new GithubProvider(this, 'github', {
    //   owner: 'billy-wong-mtelhk',
    //   token: process.env.GITHUB_TOKEN,
    // })

    // new ActionsVariable(this, 'actions-variable-vpc-id', {
    //   repository: 'ob-iac-demo',
    //   variableName: 'VPC_ID',
    //   value: vpc.id,
    // })
  }
}