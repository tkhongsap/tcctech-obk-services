import { Construct } from "constructs"
import getVariable from '../config/variable'
import map from 'lodash/map'
import { TerraformOutput, Fn  } from "cdktf"
import { IamRole } from "../.gen/providers/aws/iam-role"
import { IamRolePolicyAttachment } from "../.gen/providers/aws/iam-role-policy-attachment"
import { DataAwsIamPolicyDocument } from "../.gen/providers/aws/data-aws-iam-policy-document"
import { IamPolicy } from "../.gen/providers/aws/iam-policy"

const nodeGroupRoleAttachedPolices = [
  {
    PolicyName: "AmazonEKS_CNI_Policy",
    PolicyArn: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  },
  {
    PolicyName: "AmazonEC2ContainerRegistryReadOnly",
    PolicyArn: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  },
  {
    PolicyName: "AmazonEKSWorkerNodePolicy",
    PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  },
  {
    PolicyName: "AmazonEBSCSIDriverPolicy",
    PolicyArn: "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
  },
]

export default class NodeGroupIamConstructor extends Construct {
  public readonly nodeGroupRole: IamRole
  
  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const {
        oidcProvider,
      } = config
    const vars = getVariable(this)

    const autoscalerPolicy = new IamPolicy(this, 'autoscaler_policy', {
      name: `${vars.PROJECT_ID}-autoscaler-policy`,
      policy: JSON.stringify({
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "autoscaling:DescribeAutoScalingGroups",
              "autoscaling:DescribeAutoScalingInstances",
              "autoscaling:DescribeLaunchConfigurations",
              "autoscaling:DescribeScalingActivities",
              "autoscaling:DescribeTags",
              "ec2:DescribeInstanceTypes",
              "ec2:DescribeLaunchTemplateVersions"
            ],
            "Resource": ["*"]
          },
          {
            "Effect": "Allow",
            "Action": [
              "autoscaling:SetDesiredCapacity",
              "autoscaling:TerminateInstanceInAutoScalingGroup",
              "ec2:DescribeImages",
              "ec2:GetInstanceTypesFromInstanceRequirements",
              "eks:DescribeNodegroup"
            ],
            "Resource": ["*"]
          }
        ],
        "Version": "2012-10-17"
      })
    })

    const policyDoc = new DataAwsIamPolicyDocument(this, 'karpenter_policy_document', {
      statement: [
        {
          actions: ["sts:AssumeRoleWithWebIdentity"],
          effect: "Allow",
          condition: [
            {
              test: "StringEquals",
              variable: `${Fn.replace(oidcProvider.url, "https://", "")}:aud`,
              values: ["sts.amazonaws.com"],
            },
            {
              test: "StringEquals",
              variable: `${Fn.replace(oidcProvider.url, "https://", "")}:sub`,
              values: ["system:serviceaccount:karpenter:karpenter", "system:serviceaccount:kube-system:ebs-csi-controller-sa"],
            },
          ],
          principals: [{
            identifiers: [oidcProvider.arn],
            type: "Federated",
          }]
        },
        {
          actions: ['sts:AssumeRole'],
          effect: 'Allow',
          sid: 'EKSNodeAssumeRole',
          principals: [{
            identifiers: ["ec2.amazonaws.com"],
            type: "Service",
          }]
        },
      ]
    })

    // node group role
    const nodeGroupRole = new IamRole(this, 'eks-node-group-role', {
      name: `${vars.PROJECT_ID}-ng-role`,
      // assumeRolePolicy: JSON.stringify({
      //   Version: '2012-10-17',
      //   Statement: [
      //     {
      //       Action: 'sts:AssumeRole',
      //       Effect: 'Allow',
      //       Sid: 'EKSNodeAssumeRole',
      //       Principal: {
      //         Service: 'ec2.amazonaws.com',
      //       },
      //     },
          
      //   ],
      // }),
      assumeRolePolicy: policyDoc.json,
      tags: {
        Name: `${vars.PROJECT_ID}-ng-role`,
        environment: vars.ENVIRONMENT,
      },
    })

    map(nodeGroupRoleAttachedPolices, (data, index) => {
      const policy = new IamRolePolicyAttachment(this, `eks-node-group-role-attach-policies-${index}`, {
        dependsOn: [nodeGroupRole],
        role: nodeGroupRole.name,
        policyArn: data.PolicyArn,
      })
      return policy
    })

    new IamRolePolicyAttachment(this, 'autoscaler_attach_policies', {
      policyArn: autoscalerPolicy.arn,
      role: nodeGroupRole.name,
    })
    // node group role


    this.nodeGroupRole = nodeGroupRole

    new TerraformOutput(this, `ng-role`, {
      value: nodeGroupRole,
    })
  }
}
