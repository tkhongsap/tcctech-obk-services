import map from 'lodash/map'

import { Construct } from "constructs"
import getVariable from '../config/variable'
import { DataAwsEksClusterAuth } from '../.gen/providers/aws/data-aws-eks-cluster-auth'

import { Eks } from '../.gen/modules/eks'
import { IamRole } from "../.gen/providers/aws/iam-role"
import { IamRolePolicyAttachment } from "../.gen/providers/aws/iam-role-policy-attachment"
// import { DataAwsSubnetIds } from "../.gen/providers/aws/data-aws-subnet-ids"
import { TerraformOutput } from 'cdktf'
import { DataAwsCallerIdentity } from "../.gen/providers/aws/data-aws-caller-identity"


export default class EksConstructor extends Construct {
  public readonly cluster:Eks
  public readonly dataEksClusterAuth:DataAwsEksClusterAuth
  
  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const { vpc, clusterName, clusterVersion } = config
    const vars = getVariable(this)

    const callerIdentity = new DataAwsCallerIdentity(this, 'caller-identity', {})
    
    const eksClusterRole = new IamRole(this, 'eks-cluster-role', {
      name: `${clusterName}-role`,
      assumeRolePolicy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Sid: 'EKSClusterAssumeRole',
            Principal: {
              Service: 'eks.amazonaws.com',
            },
          }

        ],
      }),
      tags: {
        Name: `${vars.PROJECT_ID}-cluster-role`,
        environment: vars.ENVIRONMENT,
      },
    })

    new IamRolePolicyAttachment(this, 'eks-cluster-role-attach-policies', {
      dependsOn: [eksClusterRole],
      role: eksClusterRole.name,
      policyArn: 'arn:aws:iam::aws:policy/AmazonEKSClusterPolicy',
    })

    const cluster = new Eks(this, 'eks-cluster', {
      clusterName: clusterName,
      clusterVersion,
      clusterEndpointPrivateAccess: false,
      clusterEndpointPublicAccess: true,
      iamRoleArn: eksClusterRole.arn,
      createNodeSecurityGroup: false,
      createIamRole: false,
      clusterAddons: {
        'aws-ebs-csi-driver': { 
          mostRecent: true,
          'service_account_role_arn': `arn:aws:iam::${callerIdentity.accountId}:role/${vars.PROJECT_ID}-ng-role`,
        },
        // coredns: { mostRecent: true },
        // 'kubeProxy': { mostRecent: true },
        // vpcCni: { mostRecent: true },
      },
      vpcId: vpc.vpc.id,
      subnetIds: [
        ...map(vpc.publicSubnets || [], (subnet:any) => subnet.id),
        ...map(vpc.privateSubnets || [], (subnet:any) => subnet.id),
      ],
      cloudwatchLogGroupRetentionInDays: 1,
      tags: {
        Name: `${vars.PROJECT_ID}-eks-cluster`,
        environment: vars.ENVIRONMENT,
      },
      clusterEnabledLogTypes: [],
    })

    const dataEksClusterAuth = new DataAwsEksClusterAuth(this, 'eks-cluster-auth', {
      dependsOn: [cluster],
      name: cluster.clusterNameOutput,
    })

    new TerraformOutput(this, "output-eks-context", {
      value: `aws eks update-kubeconfig --region ${vars.DEFAULT_REGION} --name ${cluster.clusterName}`,
    });

    this.cluster = cluster
    this.dataEksClusterAuth = dataEksClusterAuth

    // const tmp = new DataAwsSubnetIds(this, 'eks-subnet-ids', {
    //   vpcId: vpc.vpc.id,
    //   tags: {
    //     "kubernetes.io/role/internal-elb": "1",
    //   }
    // })

    // new TerraformOutput(this, 'tmp', {
    //   value: tmp,
    // })
  }
}