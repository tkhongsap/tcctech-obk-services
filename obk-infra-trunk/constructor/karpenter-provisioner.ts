import { Construct } from "constructs"
import { DataKubectlPathDocuments } from "../.gen/providers/kubectl/data-kubectl-path-documents"
import { Manifest } from "../.gen/providers/kubectl/manifest"
import { TerraformIterator } from "cdktf"
import getVariable from "../config/variable"

export default class KarpenterProvisionerConstructor extends Construct {
  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const { iam } = config
    const vars = getVariable(this)
    const yamls = new DataKubectlPathDocuments(this, "tmp", {
      pattern: `${__dirname}/../k8s-yaml/karpenter/*.yaml`,
      vars: {
        CLUSTER_NAME: vars.EKS_CLUSTER_NAME,
        KARPENTER_INSTANCE_TYPES: vars.KARPENTER_INSTANCE_TYPES,
        ELASTICSEARCH_INSTANCE_TYPE_SMALL: vars.ELASTICSEARCH_INSTANCE_TYPE_SMALL,
        ELASTICSEARCH_INSTANCE_TYPE_LARGE: vars.ELASTICSEARCH_INSTANCE_TYPE_LARGE,
        ROLE: iam.ng.nodeGroupRole.name,
        INSTANCE_PROFILE: `${vars.PROJECT_ID}-KarpenterNodeInstanceProfile`,
      },
    })

    const yarmlDocIterator = TerraformIterator.fromList(yamls.documents) as any

    new Manifest(this, `apply-karpenter-provisioner`, {
      dependsOn: [yamls],
      forEach: yarmlDocIterator,
      yamlBody: yarmlDocIterator.value,
    })
  }
}
