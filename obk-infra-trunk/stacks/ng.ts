import { Construct } from "constructs"
import { TerraformStack } from "cdktf"
import initBackend from "../lib/init-backend"
import EKSNodeGroupConstructor from '../constructor/ng'
import { DataAwsEksCluster } from "../.gen/providers/aws/data-aws-eks-cluster"
import getVariable from '../config/variable'
import { DataAwsSubnets } from "../.gen/providers/aws/data-aws-subnets"

export default class NodeGroupStack extends TerraformStack {  
  public readonly ng:any

  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const { group, iam } = config
    const vars = getVariable(this)
    initBackend(this, group, id)
    
    const dataCluster = new DataAwsEksCluster(this, 'eks-cluster', {
      name: vars.EKS_CLUSTER_NAME,
    })

    const vpcId = dataCluster.vpcConfig.get(0).vpcId

    const privateSubnets = new DataAwsSubnets(this, "test", {
      filter: [
        {
          name: "vpc-id",
          values: [vpcId],
        },
      ],
      tags: {
        "kubernetes.io/role/internal-elb": "1",
      }
    })

    const nodeSubnetIds = privateSubnets.ids

    this.ng = new EKSNodeGroupConstructor(this, 'eks-ng', {
      eks: dataCluster,
      subnetIds: nodeSubnetIds,
      iam,
    })
  }
}