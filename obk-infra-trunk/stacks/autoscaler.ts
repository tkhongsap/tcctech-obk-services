import { Construct } from "constructs"
import { TerraformStack, TerraformIterator, TerraformOutput } from "cdktf"
import getVariable from '../config/variable'
import initBackend from "../lib/init-backend"
import initKubectl from "../lib/init-kubectl"
import { DataKubectlPathDocuments } from "../.gen/providers/kubectl/data-kubectl-path-documents"
import { Manifest } from "../.gen/providers/kubectl/manifest"
import { DataAwsEksCluster } from "../.gen/providers/aws/data-aws-eks-cluster"
import { DataAwsEksClusterAuth } from '../.gen/providers/aws/data-aws-eks-cluster-auth'

interface config {
  group: string
}

export default class AutoscalerStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: config) {
    super(scope, id)
    const { group } = config
    const vars = getVariable(this)

    initBackend(this, group, id)
    const dataCluster = new DataAwsEksCluster(this, 'eks-cluster', {
      name: vars.EKS_CLUSTER_NAME,
    })

    const dataEksClusterAuth = new DataAwsEksClusterAuth(this, 'eks-cluster-auth', {
      dependsOn: [dataCluster],
      name: dataCluster.name,
    })

    const eks = {
      cluster: dataCluster,
      dataEksClusterAuth,
    }

    initKubectl(this, eks)
   
    const yamls = new DataKubectlPathDocuments(this, 'autoscaler-yaml', {
      pattern: `${__dirname}/../k8s-yaml/autoscaler.yaml`,
      vars: {
        EKS_CLUSTER: dataCluster.name,
      }
    })

    const yarmlDocIterator = TerraformIterator.fromList(yamls.documents) as any

    new Manifest(this, 'apply-autoscaler', {
      dependsOn: [yamls],
      forEach: yarmlDocIterator,
      yamlBody: yarmlDocIterator.value,
    })

    new TerraformOutput(this, 'out-yaml', {
      value: yamls.documents,
    })
  }
}