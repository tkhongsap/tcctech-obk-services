import { Construct } from "constructs"
import { Manifest } from "../.gen/providers/kubectl/manifest"
import { TerraformIterator } from 'cdktf'
import getVariable from '../config/variable'
import { DataKubectlPathDocuments } from "../.gen/providers/kubectl/data-kubectl-path-documents"

interface config {
  YAML_PATTERN: string
  NAME: string
  REPO_URL: string
  TARGET_REVISION: string
  PATH: string
}

export default class ArgoAppConstructor extends Construct {
  public readonly helmLbController:any
  constructor(scope: Construct, id: string, config:config) {
    super(scope, id)
    const { YAML_PATTERN, NAME, REPO_URL, TARGET_REVISION, PATH } = config
    const vars = getVariable(this)
    
    const yamls = new DataKubectlPathDocuments(this, 'app-infra-status', {
      pattern: YAML_PATTERN,
      vars: {
        NAME,
        REPO_URL,
        TARGET_REVISION,
        PATH,
        GITHUB_TOKEN: vars.GITHUB_TOKEN,
      }
    })

    const yarmlDocIterator = TerraformIterator.fromList(yamls.documents) as any

    new Manifest(this, `apply-app-infra-status`, {
        dependsOn: [yamls],
        forEach: yarmlDocIterator,
        yamlBody: yarmlDocIterator.value,
    })
  }
}
