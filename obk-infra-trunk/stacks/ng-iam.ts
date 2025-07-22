import { Construct } from "constructs"
import { TerraformStack } from "cdktf"
import getVariable from '../config/variable'
import initBackend from "../lib/init-backend"
import NodeGroupIam from '../constructor/ng-iam'
import { DataAwsEksCluster } from "../.gen/providers/aws/data-aws-eks-cluster"
import { DataAwsIamOpenidConnectProvider } from "../.gen/providers/aws/data-aws-iam-openid-connect-provider"

export default class NodeGroupIamStack extends TerraformStack {  
  public readonly ng:any

  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const { group } = config
    const vars = getVariable(this)
    initBackend(this, group, id)
    
    const dataCluster = new DataAwsEksCluster(this, 'eks-cluster', {
      name: vars.EKS_CLUSTER_NAME,
    })

    const oidcProvider = new DataAwsIamOpenidConnectProvider(this, 'eks-oidc', {
      url: dataCluster.identity.get(0).oidc.get(0).issuer,
    })

    this.ng = new NodeGroupIam(this, 'eks-ng-iam', {
      oidcProvider,
    })
  }
}