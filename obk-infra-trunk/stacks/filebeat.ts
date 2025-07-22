import { Construct } from "constructs"
import { TerraformStack } from "cdktf"
import getVariable from "../config/variable"
import initBackend from "../lib/init-backend"
import initKubectl from "../lib/init-kubectl"
import initK8s from "../lib/init-k8s"

import { DataAwsEksCluster } from "../.gen/providers/aws/data-aws-eks-cluster"
import { DataAwsEksClusterAuth } from "../.gen/providers/aws/data-aws-eks-cluster-auth"

import FilebeatConstructor from "../constructor/filebeat"

export default class FilebeatStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const { group, eck } = config
    const vars = getVariable(this)

    initBackend(this, group, id)

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
    initK8s(this, eks)

    new FilebeatConstructor(this, "filebeat", {
      eck,
    })
  }
}
