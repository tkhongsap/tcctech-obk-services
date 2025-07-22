import { Construct } from "constructs"
import { Release } from '../.gen/providers/helm/release'
// import { DataKubectlFileDocuments } from "../.gen/providers/kubectl/data-kubectl-file-documents"
import { DataKubectlPathDocuments } from "../.gen/providers/kubectl/data-kubectl-path-documents"
import { Manifest } from "../.gen/providers/kubectl/manifest"
// import fs from 'fs'
import { TerraformOutput, TerraformIterator } from 'cdktf'
// import { Fn, TerraformOutput, TerraformIterator } from 'cdktf'
import getVariable from '../config/variable'

export default class HelmArgoCDConstructor extends Construct {
  public readonly helmLbController:any
  constructor(scope: Construct, id: string) {
    super(scope, id)
    const vars = getVariable(this)
    
    new Release(this, 'helm-argocd', {
      name: 'argocd',
      repository: 'https://argoproj.github.io/argo-helm',
      chart: 'argo-cd',
      createNamespace: true,
      namespace: 'argocd',
      version: '5.45.0',
      set: [
        {
          name: 'server.service.type',
          value: 'NodePort',
        },
        {
          name: 'server.extraArgs',
          value: '{--insecure,--request-timeout=\"5m\"}',
        },
      ]
    })

    // const argoCMYaml = new DataKubectlFileDocuments(this, 'data-argocd-cm', {
    //   dependsOn: [argocdRelease],
    //   content: fs.readFileSync(`${__dirname}/../k8s-yaml/argocd-config/argocd-cm.yaml`, 'utf-8'),
    // })

    // const argoCMYamlDocuments = (argoCMYaml?.documents || []).keys();
    // for (const index of argoCMYamlDocuments) {
    //   new Manifest(this, `apply-argocd-cm-${index}`, {
    //     yamlBody: Fn.element(argoCMYaml?.documents, index),
    //   })
    // }
    
    
    // const argoRBACYaml = new DataKubectlFileDocuments(this, 'data-argocd-rbac', {
    //   dependsOn: [argocdRelease],
    //   content: fs.readFileSync(`${__dirname}/../k8s-yaml/argocd-config/argocd-rbac-cm.yaml`, 'utf-8'),
    // })

    // const argoRBACYamlDocuments = (argoRBACYaml?.documents || []).keys();
    // for (const index of argoRBACYamlDocuments) {
    //   new Manifest(this, `apply-argocd-rbac-${index}`, {
    //     yamlBody: Fn.element(argoRBACYaml?.documents, index),
    //   })
    // }



    // cm
    const argoCMYaml = new DataKubectlPathDocuments(this, 'data-argocd-cm', {
      pattern: `${__dirname}/../k8s-yaml/argocd-config/argocd-cm.yaml`,
      vars: {
        ARGO_GOOGLE_CLIENT_ID: vars.ARGO_GOOGLE_CLIENT_ID,
        ARGO_GOOGLE_CLIENT_SECRET: vars.ARGO_GOOGLE_CLIENT_SECRET,
        HOST: vars.ARGO_HOST,
      }
    })

    const argoCMYamlDocIterator = TerraformIterator.fromList(argoCMYaml.documents) as any

    new Manifest(this, `apply-argocd-cm`, {
      dependsOn: [argoCMYamlDocIterator],
      forEach: argoCMYamlDocIterator,
      yamlBody: argoCMYamlDocIterator.value,
    })
    
    // rbac
    const argoRBACYaml = new DataKubectlPathDocuments(this, 'data-argocd-rbac', {
      pattern: `${__dirname}/../k8s-yaml/argocd-config/argocd-rbac-cm.yaml`,
    })

    const argoRBACYamlDocIterator = TerraformIterator.fromList(argoRBACYaml.documents) as any

    new Manifest(this, `apply-argocd-rbac`, {
      dependsOn: [argoRBACYamlDocIterator],
      forEach: argoRBACYamlDocIterator,
      yamlBody: argoRBACYamlDocIterator.value,
    })

    // ingress
    const argoIngYaml = new DataKubectlPathDocuments(this, 'data-argocd-ing', {
      pattern: `${__dirname}/../k8s-yaml/argocd-config/argocd-ingress.yaml`,
      vars: {
        HOST: vars.ARGO_HOST
      }
    })

    const yarmlDocIterator = TerraformIterator.fromList(argoIngYaml.documents) as any

    new Manifest(this, `apply-argocd-ing`, {
      dependsOn: [yarmlDocIterator],
      forEach: yarmlDocIterator,
      yamlBody: yarmlDocIterator.value,
    })


    new TerraformOutput(this, 'output-argocd-token', {
      value: 'kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d'
    })
  }
}
