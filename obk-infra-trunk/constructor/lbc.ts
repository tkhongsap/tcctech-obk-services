import { Construct } from "constructs"
import { Release } from '../.gen/providers/helm/release'
import getVariable from '../config/variable'
import { IamRole } from "../.gen/providers/aws/iam-role"
import { IamPolicy } from "../.gen/providers/aws/iam-policy"
import { DataHttp } from "../.gen/providers/http/data-http"
import { TerraformLocal, Fn } from "cdktf"
import { IamRolePolicyAttachment } from "../.gen/providers/aws/iam-role-policy-attachment"

export default class HelmLbcConstructor extends Construct {
  public readonly helmLbController:any
  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    
    const { eks, oidcProvider } = config
    const vars = getVariable(this)


    const oidcExtractFromArn = new TerraformLocal(
      this,
      'oidc-extract-from-arn',
      Fn.element(
        Fn.split("oidc-provider/", oidcProvider.arn),
        1
      )
    )

    // retrieve policy json from internet
    const dataLbcIamPolicy = new DataHttp(this, 'data-lbc-iam-policy', {
      url: 'https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json',
      requestHeaders: {
        accept: 'application/json',
      }
    })

    // create lbc policy via policy json
    const lbcIamPolicy = new IamPolicy(this, 'lbc-iam-policy', {
      name: `${vars.PROJECT_ID}-lbc-iam-policy`,
      path: '/',
      description: 'AWS Load Balancer Controller IAM Policy',
      policy: dataLbcIamPolicy.responseBody,
      tags: {
        project: vars.PROJECT_ID,
        key: 'lbc-iam-policy',
      }
    })

    // create lbc role 
    const lbcIamRoleConditions = {} as any
    lbcIamRoleConditions[`${oidcExtractFromArn}:aud`] = 'sts.amazonaws.com'
    lbcIamRoleConditions[`${oidcExtractFromArn}:sub`] = 'system:serviceaccount:kube-system:aws-load-balancer-controller'
    const lbcIamRole = new IamRole(this, 'lbc-iam-role', {
      name: `${vars.PROJECT_ID}-lbc-iam-role`,
      assumeRolePolicy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [{
          Action: 'sts:AssumeRoleWithWebIdentity',
          Effect: 'Allow',
          Sid: '',
          Principal: {
            Federated: oidcProvider.arn,
          },
          Condition: {
            StringEquals: lbcIamRoleConditions,
          }
        }],
      }),
      tags: {
        project: vars.PROJECT_ID,
        key: 'AWSLoadBalancerControllerIAMPolicy',
      }
    })

    // attach lbc policy to lbc role
    new IamRolePolicyAttachment(this, 'lbc-iam-role-policy-attach', {
      policyArn: lbcIamPolicy.arn,
      role: lbcIamRole.name,
    })


    // helm install aws-load-balancer-controller
    const helmLbController = new Release(this, 'lb-controller', {
      name: 'aws-load-balancer-controller',
      repository: 'https://aws.github.io/eks-charts',
      chart: 'aws-load-balancer-controller',
      namespace: 'kube-system',
      set: [
        {
          name: 'image.tag',
          value: 'v2.7.0',
        },
        {
          name: 'replicaCount',
          value: 1,
        },
        {
          name: 'serviceAccount.create',
          value: 'true',
        },
        {
          name: 'serviceAccount.name',
          value: 'aws-load-balancer-controller',
        },
        {
          name: 'serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn',
          value: lbcIamRole.arn,
        },
        {
          name: 'vpcId',
          value: eks.cluster.vpcConfig.get(0).vpcId,
        },
        {
          name: 'region',
          value: vars.DEFAULT_REGION,
        },
        {
          name: 'clusterName',
          value: eks.cluster.name,
        },
      ],
    })

    this.helmLbController = helmLbController
  }
}
