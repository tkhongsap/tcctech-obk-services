import { Construct } from "constructs"
import getVariable from "./../config/variable"

import { IamPolicy } from "../.gen/providers/aws/iam-policy"
import { IamRolePolicyAttachment } from "../.gen/providers/aws/iam-role-policy-attachment"
import { IamInstanceProfile } from "../.gen/providers/aws/iam-instance-profile"
import { Release } from "../.gen/providers/helm/release"

export default class KarpenterConstructor extends Construct {
  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)

    // const { oidcProvider, eks } = config
    const { eks, iam } = config
    const vars = getVariable(this)

    const KarpenterControllerPolicy = new IamPolicy(
      this,
      "karpenter_controller_policy",
      {
        name: `${vars.PROJECT_ID}-karpenter-controller-policy`,
        policy: JSON.stringify({
          Statement: [
            {
              Action: [
                "ssm:GetParameter",
                "ec2:DescribeImages",
                "ec2:RunInstances",
                "ec2:DescribeSubnets",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeLaunchTemplates",
                "ec2:DescribeInstances",
                "ec2:DescribeInstanceTypes",
                "ec2:DescribeInstanceTypeOfferings",
                "ec2:DescribeAvailabilityZones",
                "ec2:DeleteLaunchTemplate",
                "ec2:CreateTags",
                "ec2:CreateLaunchTemplate",
                "ec2:CreateFleet",
                "ec2:DescribeSpotPriceHistory",
                "pricing:GetProducts",
              ],
              Effect: "Allow",
              Resource: "*",
              Sid: "Karpenter",
            },
            {
              Action: "ec2:TerminateInstances",
              Condition: {
                StringLike: {
                  "ec2:ResourceTag/karpenter.sh/nodepool": "*",
                },
              },
              Effect: "Allow",
              Resource: "*",
              Sid: "ConditionalEC2Termination",
            },
            {
              Effect: "Allow",
              Action: "iam:PassRole",
              Resource: "*",
              Sid: "PassNodeIAMRole",
            },
            {
              Effect: "Allow",
              Action: "eks:DescribeCluster",
              Resource: "*",
              Sid: "EKSClusterEndpointLookup",
            },
            {
              Sid: "AllowScopedInstanceProfileCreationActions",
              Effect: "Allow",
              Resource: "*",
              Action: ["iam:CreateInstanceProfile"],
              Condition: {
                StringEquals: {
                  [`aws:RequestTag/kubernetes.io/cluster/${eks.cluster.id}`]:
                    "owned",
                  "aws:RequestTag/topology.kubernetes.io/region": `${vars.DEFAULT_REGION}`,
                },
                StringLike: {
                  "aws:RequestTag/karpenter.k8s.aws/ec2nodeclass": "*",
                },
              },
            },
            {
              Sid: "AllowScopedInstanceProfileTagActions",
              Effect: "Allow",
              Resource: "*",
              Action: ["iam:TagInstanceProfile"],
              Condition: {
                StringEquals: {
                  [`aws:ResourceTag/kubernetes.io/cluster/${eks.cluster.id}`]:
                    "owned",
                  "aws:ResourceTag/topology.kubernetes.io/region": `${vars.DEFAULT_REGION}`,
                  [`aws:RequestTag/kubernetes.io/cluster/${eks.cluster.id}`]:
                    "owned",
                  "aws:RequestTag/topology.kubernetes.io/region": `${vars.DEFAULT_REGION}`,
                },
                StringLike: {
                  "aws:ResourceTag/karpenter.k8s.aws/ec2nodeclass": "*",
                  "aws:RequestTag/karpenter.k8s.aws/ec2nodeclass": "*",
                },
              },
            },
            {
              Sid: "AllowScopedInstanceProfileActions",
              Effect: "Allow",
              Resource: "*",
              Action: [
                "iam:AddRoleToInstanceProfile",
                "iam:RemoveRoleFromInstanceProfile",
                "iam:DeleteInstanceProfile",
              ],
              Condition: {
                StringEquals: {
                  [`aws:ResourceTag/kubernetes.io/cluster/${eks.cluster.id}`]:
                    "owned",
                  "aws:ResourceTag/topology.kubernetes.io/region": `${vars.DEFAULT_REGION}`,
                },
                StringLike: {
                  "aws:ResourceTag/karpenter.k8s.aws/ec2nodeclass": "*",
                },
              },
            },
            {
              Sid: "AllowInstanceProfileReadActions",
              Effect: "Allow",
              Resource: "*",
              Action: "iam:GetInstanceProfile",
            },
          ],
          Version: "2012-10-17",
        }),
      },
    )

    new IamRolePolicyAttachment(this, "karpenter_controller_attach_policies", {
      policyArn: KarpenterControllerPolicy.arn,
      role: iam.ng.nodeGroupRole.name,
    })

    const instanceProfile = new IamInstanceProfile(
      this,
      "karpenter_controller_instance_profile",
      {
        name: `${vars.PROJECT_ID}-KarpenterNodeInstanceProfile`,
        role: `${vars.PROJECT_ID}-ng-role`,
      },
    )

    new Release(this, "helm-karpenter", {
      name: "karpenter",
      repository: "oci://public.ecr.aws/karpenter",
      chart: "karpenter",
      createNamespace: true,
      namespace: "karpenter",
      version: "v0.32.6",
      set: [
        {
          name: "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn",
          value: iam.ng.nodeGroupRole.arn,
        },
        {
          name: "settings.clusterName",
          value: eks.cluster.id,
        },
        {
          name: "settings.aws.defaultInstanceProfile",
          value: instanceProfile.name,
        },
        {
          name: "controller.resources.requests.cpu",
          value: "0.7",
        },
        {
          name: "controller.resources.requests.memory",
          value: "1Gi",
        },
        {
          name: "controller.resources.limits.cpu",
          value: "0.7",
        },
        {
          name: "controller.resources.limits.memory",
          value: "1Gi",
        },
      ],
    })
  }
}
