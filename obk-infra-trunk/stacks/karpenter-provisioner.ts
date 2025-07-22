import { Construct } from "constructs"
import { TerraformStack } from "cdktf"
import getVariable from "../config/variable"
import initBackend from "../lib/init-backend"
import initKubectl from "../lib/init-kubectl"

// import { HttpProvider } from "../.gen/providers/http/provider"
import { DataAwsEksCluster } from "../.gen/providers/aws/data-aws-eks-cluster"
import { DataAwsEksClusterAuth } from "../.gen/providers/aws/data-aws-eks-cluster-auth"

import KarpenterProvisionerConstructor from "../constructor/karpenter-provisioner"

export default class HelmKarpenterProvisionerStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const { group, iam } = config
    const vars = getVariable(this)

    initBackend(this, group, id)
    // new HttpProvider(this, 'http', {})

    const dataCluster = new DataAwsEksCluster(this, "eks-cluster", {
      name: vars.EKS_CLUSTER_NAME,
    })

    const dataEksClusterAuth = new DataAwsEksClusterAuth(
      this,
      "eks-cluster-auth",
      {
        dependsOn: [dataCluster],
        name: dataCluster.name,
      },
    )

    const eks = {
      cluster: dataCluster,
      dataEksClusterAuth,
    }

    initKubectl(this, eks)

    new KarpenterProvisionerConstructor(this, "helm-karpenter-provisioner", {
      iam,
    })
  }
}
