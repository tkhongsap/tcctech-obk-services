import { Construct } from "constructs"
import { TerraformStack } from "cdktf"
import initBackend from "../lib/init-backend"
import getVariable from '../config/variable'
import EksClusterConstructor from "../constructor/eks-cluster"
// import EksOidcConstructor from '../constructor/oidc'

export default class EksStack extends TerraformStack {
  public readonly eks:any
  public readonly oidc:any

  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const { group, vpc  } = config
    initBackend(this, group, id)
    const vars = getVariable(this)

    const eksCluster = new EksClusterConstructor(this, 'eks-cluster', {
      vpc,
      clusterName: vars.EKS_CLUSTER_NAME,
      clusterVersion: vars.EKS_CLUSTER_VERSION,
    })

    // const oidc = new EksOidcConstructor(this, 'eks-oidc', {
    //   eks: eksCluster,
    // })

    this.eks = eksCluster
  }
}