import { Construct } from "constructs"
import { TerraformStack, TerraformIterator } from "cdktf"
import getVariable from '../config/variable'
import initBackend from "../lib/init-backend"
import initKubectl from "../lib/init-kubectl"

import { Manifest } from "../.gen/providers/kubectl/manifest"
import { DataAwsEksCluster } from "../.gen/providers/aws/data-aws-eks-cluster"
import { DataAwsEksClusterAuth } from '../.gen/providers/aws/data-aws-eks-cluster-auth'
import { DataKubectlPathDocuments } from "../.gen/providers/kubectl/data-kubectl-path-documents"

export default class AppStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: any) {
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

    const argoRepoYaml = new DataKubectlPathDocuments(this, 'argo-repo-yaml', {
      pattern: `${__dirname}/../k8s-yaml/argocd-app/test-argocd-repo.yaml`,
      vars: {
        GITHUB_TOKEN: vars.GITHUB_TOKEN
      }
    })

    const repoIterator = TerraformIterator.fromList(argoRepoYaml.documents) as any
    const repoManifest = new Manifest(this, `apply-argo-repo`, {
      dependsOn: [argoRepoYaml],
      forEach: repoIterator,
      yamlBody: repoIterator.value,
    })

    const argoAppYaml = new DataKubectlPathDocuments(this, 'argo-app-yaml', {
      pattern: `${__dirname}/../k8s-yaml/argocd-app/test-argocd-app.yaml`,
    })

    const appterator = TerraformIterator.fromList(argoAppYaml.documents) as any
    new Manifest(this, `apply-argo-app`, {
      dependsOn: [argoAppYaml, repoManifest],
      forEach: appterator,
      yamlBody: appterator.value,
    })
  }
}