import { Construct } from "constructs"
import { TerraformStack, TerraformIterator, TerraformOutput } from "cdktf"
import getVariable from '../config/variable'
import initBackend from "../lib/init-backend"
import initKubectl from "../lib/init-kubectl"
import { DataKubectlPathDocuments } from "../.gen/providers/kubectl/data-kubectl-path-documents"
import { Manifest } from "../.gen/providers/kubectl/manifest"
import { DataAwsEksCluster } from "../.gen/providers/aws/data-aws-eks-cluster"
import { DataAwsEksClusterAuth } from '../.gen/providers/aws/data-aws-eks-cluster-auth'

import map from 'lodash/map'

interface config {
  group: string
  eipStack: any
  vpcStack: any
}

export default class IngressNginxStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: config) {
    super(scope, id)
    const { group,  vpcStack, eipStack } = config
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
   
    const subnetsString = map(vpcStack?.publicSubnets || [], (subnet:any) => subnet.id).join(',')
    const eipsString = map(eipStack?.nlbEips || [], (eip:any) => eip.id).join(',')

    const yamls = new DataKubectlPathDocuments(this, 'ingress-nginx-yaml', {
      pattern: `${__dirname}/../k8s-yaml/ingress-nginx.yaml`,
      vars: {
        Subnets: subnetsString,
        Eips: eipsString,
      }
    })

    const yarmlDocIterator = TerraformIterator.fromList(yamls.documents) as any

    new Manifest(this, `apply-ingress-nginx`, {
      dependsOn: [yamls],
      forEach: yarmlDocIterator,
      yamlBody: yarmlDocIterator.value,
    })

    new TerraformOutput(this, 'out-yaml', {
      value: yamls.documents,
    })
  }
}