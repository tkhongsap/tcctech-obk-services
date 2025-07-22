
data "aws_availability_zones" "available" {}

locals {
  cluster_name = "${var.app_name}-${var.env}"
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.2"

  name                 = "${var.app_name}-${var.env}"
  cidr                 = "172.16.0.0/16"
  azs                  = data.aws_availability_zones.available.names
  private_subnets      = ["172.16.1.0/24", "172.16.2.0/24", "172.16.3.0/24"]
  public_subnets       = ["172.16.4.0/24", "172.16.5.0/24", "172.16.6.0/24"]
  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true


  tags = {
    Name = "${var.app_name}-${var.env}"
  }

  public_subnet_tags = {
    "kubernetes.io/cluster/${local.cluster_name}" = "shared"
    "kubernetes.io/role/elb"                      = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/cluster/${local.cluster_name}" = "shared"
    "kubernetes.io/role/internal-elb"             = "1"
  }
}


provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
  token                  = data.aws_eks_cluster_auth.cluster.token

}

module "eks-kubeconfig" {
  source  = "hyperbadger/eks-kubeconfig/aws"
  version = "1.0.0"
  cluster_id = "${var.app_name}-${var.env}"
}

resource "local_file" "kubeconfig" {
  content  = module.eks-kubeconfig.kubeconfig
  filename = "kubeconfig_${local.cluster_name}"
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.17.2"

  cluster_name    = local.cluster_name
  cluster_version = "1.28"
  subnet_ids      = module.vpc.private_subnets
  vpc_id          = module.vpc.vpc_id

  cluster_endpoint_public_access  = true
  cluster_endpoint_private_access  = false

  eks_managed_node_groups = {
    default = {
      name         = "default"
      min_size     = 1
      max_size     = 10
      desired_size = 1

      instance_types = ["m5.large"]

      tags  = {
        Name = "${var.app_name}-${var.env}"
      }
    }
  }

  node_security_group_additional_rules = {
    ingress_allow_access_from_control_plane_sit = {
      type                          = "ingress"
      protocol                      = "tcp"
      from_port                     = 9443
      to_port                       = 9443
      source_cluster_security_group_sit = true
      description                   = "Allow access from SIT control plane to webhook port of AWS load balancer controller"
    }

    egress_limited = {
      type        = "egress"
      from_port   = 443
      to_port     = 443
      protocol    = "all"
      cidr_blocks = ["10.0.0.0/16"]
      description = "Allow only necessary egress traffic"
    }
  }
}

data "aws_eks_cluster" "cluster" {
  name = "${var.app_name}-${var.env}"
}

data "aws_eks_cluster_auth" "cluster" {
  name = "${var.app_name}-${var.env}"
}

resource "aws_iam_policy" "worker_policy" {
  name        = "${var.app_name}-worker-policy-${var.env}"
  description = "Worker policy for the ALB Ingress"

  policy = file("iam-policy.json")
}

resource "aws_iam_role_policy_attachment" "additional" {
  for_each = module.eks.eks_managed_node_groups

  policy_arn = aws_iam_policy.worker_policy.arn
  role       = each.value.iam_role_name
}

provider "helm" {
  kubernetes {
    host                   = data.aws_eks_cluster.cluster.endpoint
    cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
    token                  = data.aws_eks_cluster_auth.cluster.token
  }
}

resource "helm_release" "ingress" {
  name       = "ingress"
  chart      = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  version    = "1.4.6"

  set {
    name  = "autoDiscoverAwsRegion"
    value = "true"
  }
  set {
    name  = "autoDiscoverAwsVpcID"
    value = "true"
  }
  set {
    name  = "clusterName"
    value = local.cluster_name
  }
}
