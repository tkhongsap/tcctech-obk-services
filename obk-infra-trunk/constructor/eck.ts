import { Construct } from "constructs"
import getVariable from '../config/variable'

import { DataKubectlPathDocuments } from "../.gen/providers/kubectl/data-kubectl-path-documents"
import { Fn, TerraformIterator } from 'cdktf'
import { DataKubectlFileDocuments } from "../.gen/providers/kubectl/data-kubectl-file-documents"
import { Manifest } from "../.gen/providers/kubectl/manifest"
import { DataKubernetesSecretV1 } from "../.gen/providers/kubernetes/data-kubernetes-secret-v1"

import fs from 'fs'

export default class ECKConstructor extends Construct {
  public readonly esPass: any
  constructor(scope: Construct, id: string) {
    super(scope, id)
    const vars = getVariable(this)

    // // priority classes
    const pcRaw = new DataKubectlFileDocuments(this, 'eck-pc', {
      content: fs.readFileSync(`${__dirname}/../k8s-yaml/eck/elastic-priority-classes.yaml`, 'utf-8'),
    })

    const pcContent = TerraformIterator.fromList(pcRaw.documents) as any

    new Manifest(this, `apply-eck-pc`, {
      dependsOn: [pcContent],
      forEach: pcContent,
      yamlBody: pcContent.value,
      overrideNamespace: 'elastic-system',
    })

    // elasticsearch
    const esRaw = new DataKubectlPathDocuments(this, "eck-es", {
      pattern: `${__dirname}/../k8s-yaml/eck/elasticsearch-cluster.yaml`,
      vars: {
        ELASTICSEARCH_NUM_OF_NODES: vars.ELASTICSEARCH_NUM_OF_NODES,
        ELASTICSEARCH_LIMIT_CPU: vars.ELASTICSEARCH_LIMIT_CPU,
        ELASTICSEARCH_LIMIT_MEMORY: vars.ELASTICSEARCH_LIMIT_MEMORY,
        ELASTICSEARCH_REQUEST_CPU: vars.ELASTICSEARCH_REQUEST_CPU,
        ELASTICSEARCH_REQUEST_MEMORY: vars.ELASTICSEARCH_REQUEST_MEMORY,
        ELASTICSEARCH_NODE_STORAGE: vars.ELASTICSEARCH_NODE_STORAGE,
        ELASTICSEARCH_DATA_NUM_OF_NODES: vars.ELASTICSEARCH_DATA_NUM_OF_NODES,
        ELASTICSEARCH_DATA_LIMIT_CPU: vars.ELASTICSEARCH_DATA_LIMIT_CPU,
        ELASTICSEARCH_DATA_LIMIT_MEMORY: vars.ELASTICSEARCH_DATA_LIMIT_MEMORY,
        ELASTICSEARCH_DATA_REQUEST_CPU: vars.ELASTICSEARCH_DATA_REQUEST_CPU,
        ELASTICSEARCH_DATA_REQUEST_MEMORY: vars.ELASTICSEARCH_DATA_REQUEST_MEMORY,
        ELASTICSEARCH_DATA_NODE_STORAGE: vars.ELASTICSEARCH_DATA_NODE_STORAGE,
        ELASTICSEARCH_DATA_WARM_NUM_OF_NODES: vars.ELASTICSEARCH_DATA_WARM_NUM_OF_NODES,
        ELASTICSEARCH_DATA_WARM_LIMIT_CPU: vars.ELASTICSEARCH_DATA_WARM_LIMIT_CPU,
        ELASTICSEARCH_DATA_WARM_LIMIT_MEMORY: vars.ELASTICSEARCH_DATA_WARM_LIMIT_MEMORY,
        ELASTICSEARCH_DATA_WARM_REQUEST_CPU: vars.ELASTICSEARCH_DATA_WARM_REQUEST_CPU,
        ELASTICSEARCH_DATA_WARM_REQUEST_MEMORY: vars.ELASTICSEARCH_DATA_WARM_REQUEST_MEMORY,
        ELASTICSEARCH_DATA_WARM_NODE_STORAGE: vars.ELASTICSEARCH_DATA_WARM_NODE_STORAGE,
        KARPENTER_INSTANCE_TYPES: vars.KARPENTER_INSTANCE_TYPES,
        ELASTICSEARCH_INSTANCE_TYPE_SMALL: vars.ELASTICSEARCH_INSTANCE_TYPE_SMALL,
        ELASTICSEARCH_INSTANCE_TYPE_LARGE: vars.ELASTICSEARCH_INSTANCE_TYPE_LARGE,
      },
    })

    const esContent = TerraformIterator.fromList(esRaw.documents) as any

    const provisionEs = new Manifest(this, `apply-eck-es`, {
      dependsOn: [esContent],
      forEach: esContent,
      yamlBody: esContent.value,
      overrideNamespace: 'elastic-system',
      wait: true,
    })

    const esSecret = new DataKubernetesSecretV1(this, 'eck-es-secret', {
      dependsOn: [provisionEs],
      metadata: {
        name: 'elastic-cluster-es-elastic-user',
        namespace: 'elastic-system',
      },
    }) as any

    const esPass = Fn.lookup(esSecret?.data, 'elastic')

    // kibana
    const kibanaRaw = new DataKubectlPathDocuments(this, "eck-kibana", {
      pattern: `${__dirname}/../k8s-yaml/eck/kibana-instance.yaml`,
      vars: {
        KIBANA_PROTOCOL: vars.KIBANA_PROTOCOL,
        KIBANA_DOMAIN: vars.KIBANA_DOMAIN,
      },
    })

    const kibanaContent = TerraformIterator.fromList(kibanaRaw.documents) as any

    new Manifest(this, `apply-eck-kibana`, {
      dependsOn: [kibanaContent, provisionEs],
      forEach: kibanaContent,
      yamlBody: kibanaContent.value,
      overrideNamespace: 'elastic-system',
    })

    this.esPass = esPass
  }
}