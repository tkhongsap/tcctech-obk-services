import { Construct } from "constructs"
import getVariable from '../config/variable'

import { DataKubectlPathDocuments } from "../.gen/providers/kubectl/data-kubectl-path-documents"
import { TerraformIterator } from 'cdktf'
import { Manifest } from "../.gen/providers/kubectl/manifest"

export default class ECKConstructor extends Construct {
  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const { eck } = config
    const vars = getVariable(this)

   
    // filebeat
    const filebeatRaw = new DataKubectlPathDocuments(this, "eck-filepbeat", {
      pattern: `${__dirname}/../k8s-yaml/eck/filebeat-kubernetes.yaml`,
      vars: {
        ELASTICSEARCH_USERNAME: vars.ELASTICSEARCH_USERNAME,
      },
      sensitiveVars: {
        ELASTICSEARCH_PASSWORD: eck.eck.esPass,
      }
    })

    const filebeatContent = TerraformIterator.fromList(filebeatRaw.documents) as any

    new Manifest(this, `apply-eck-filepbeat`, {
      dependsOn: [filebeatContent],
      forEach: filebeatContent,
      yamlBody: filebeatContent.value,
      overrideNamespace: 'elastic-system',
    })
  }
}