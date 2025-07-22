import { Construct } from "constructs"
import getVariable from '../config/variable'
import { TerraformOutput } from "cdktf"
import { EksNg } from '../.gen/modules/eks-ng'

export default class EKSNodeGroupConstructor extends Construct {
  public readonly nodeGroup: EksNg
  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const {
        eks,
        subnetIds,
        iam,
      } = config
    const vars = getVariable(this)

    const extraNgTags = {} as any
    extraNgTags[`k8s.io/cluster-autoscaler/${eks.name}`] = 'owned'
    extraNgTags['k8s.io/cluster-autoscaler/enabled'] = 'TRUE'

    const nodeGroup = new EksNg(this, 'eks-ng', {
      dependsOn: [iam.ng],
      name: 'ng',
      useNamePrefix: true,
      clusterName: eks.name,
      clusterVersion: vars.EKS_CLUSTER_VERSION,
      subnetIds,
      desiredSize: vars.EKS_NG_DESIRED_SIZE,
      minSize: vars.EKS_NG_MIN_SIZE,
      maxSize: vars.EKS_NG_MAX_SIZE,
      instanceTypes: [vars.EKS_NG_INSTANCE_TYPE],
      capacityType: vars.EKS_NG_CAPACITY_TYPE,
      diskSize: vars.EKS_NG_DISK_SIZE,
      useCustomLaunchTemplate: false,
      iamRoleArn: iam.ng.nodeGroupRole.arn,
      createIamRole: false,
      tags: {
        Name: `${vars.PROJECT_ID}-eks-ng`,
        environment: vars.ENVIRONMENT,
        ...extraNgTags,
      },
    })
    // node group

    this.nodeGroup = nodeGroup

    new TerraformOutput(this, 'ng', {
      value: nodeGroup,
    })
  }
}
