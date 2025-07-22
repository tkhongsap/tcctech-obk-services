import dotenv from 'dotenv'

dotenv.config({
  debug: true,
  path: `./.env.${process?.env?.ENV}`,
  override: true,
})

import { App } from "cdktf"

// stacks
import EipStack from './stacks/eip'
import VpcStack from './stacks/vpc'
import EksStack from './stacks/eks'
import NodeGroupIamStack from './stacks/ng-iam'
import NodeGroupStack from './stacks/ng'
import HelmLbcStack from './stacks/lbc'
import HelmKarpenterStack from './stacks/karpenter'
import HelmKarpenterProvisionerStack from './stacks/karpenter-provisioner'
import HelmArgo from './stacks/argo'
import AppStack from './stacks/app'
import S3SqsStack from './stacks/s3-sqs'
// import S3Stack from './stacks/s3'
import CloudFrontS3Static from './stacks/cf-s3'
import CloudFrontFunction from './stacks/cf-func'
import ECRStack from './stacks/ecr'
import BMSStack from './stacks/ob-bms'
import OBIAMStack from './stacks/ob-iam'
import OBDocumentStack from './stacks/ob-document'
import OBNotificationStack from './stacks/ob-notification'
import ElastiCacheRedisStack from './stacks/redis'
import VariablesStack from './stacks/variables'
import MSKStack from './stacks/msk'
import SESStack from './stacks/ses'
import IngressNginxStack from './stacks/ingress-nginx'
import AutoscalerStack from './stacks/autoscaler'
import APIGatewayStack from './stacks/api-gateway'
import OBWebsocketStack from "./stacks/ob-websocket";
import EksCFStack from "./stacks/eks-cf";
import ECKStack from "./stacks/eck";
import FilebeatStack from "./stacks/filebeat";
import OBBUSStack from "./stacks/ob-bus";

const app = new App()

const eipStack = new EipStack(app, 'eip', {
  group: 'eip',
})

const vpcStack = new VpcStack(app, 'vpc', {
  group: 'vpc',
  eip: eipStack,
})

new EksStack(app, 'eks', {
  group: 'eks',
  vpc: vpcStack,
})

const ngIamStack = new NodeGroupIamStack(app, 'ng-iam', {
  group: 'ng',
})

new NodeGroupStack(app, 'ng', {
  group: 'ng',
  iam: ngIamStack,
})

// eks karpenter
new HelmKarpenterStack(app, 'karpenter', {
  group: 'helm',
  iam: ngIamStack,
})

// eks karpenter provisioner
new HelmKarpenterProvisionerStack(app, 'provisioner', {
  group: 'helm',
  iam: ngIamStack,
})


// eks autoscaler
new AutoscalerStack(app, 'autoscaler', {
  group: 'eks-autoscaler',
})

// eks loadbalancer controller
const lbc = new HelmLbcStack(app, 'lbc', {
  group: 'helm',
})

// eks argoCD
new HelmArgo(app, 'argo', {
  group: 'helm',
})

// eks testing app
new AppStack(app, 'app', {
  group: 'app',
  lbc,
})

new S3SqsStack(app, 's3-sqs', {
  group: 's3-sqs',
})


const cfFunction = new CloudFrontFunction(app, 'cf-func', {
  group: 'cf-func',
})

new CloudFrontS3Static(app, 'integration-doc', {
  group: 'integration-doc',
  name: 'integration-doc',
  cfFunction,
  gh: {
    owner: 'mtel-thailand',
    repos: [
      'one-bangkok-doc-internal'
    ],
  },
})

new ECRStack(app, 'ecr', {
  group: 'ecr',
})


new BMSStack(app, 'ob-bms', {
  group: 'ob-bms',
  vpc: vpcStack,
})

new OBIAMStack(app, 'ob-iam', {
  group: 'ob-iam',
  vpc: vpcStack,
})

new OBDocumentStack(app, 'ob-document', {
  group: 'ob-document',
  vpc: vpcStack,
})

new OBBUSStack(app, 'ob-bus', {
  group: 'ob-bus',
  vpc: vpcStack,
})

new OBWebsocketStack(app, 'ob-websocket', {
  group: 'ob-websocket',
  vpc: vpcStack,
})

new OBNotificationStack(app, 'ob-notification', {
  group: 'ob-notification',
  vpc: vpcStack,
})

new ElastiCacheRedisStack(app, 'redis', {
  group: 'elasticache/redis',
  vpc: vpcStack,
})

new VariablesStack(app, 'vars', {
  group: 'variables',
}) 

new MSKStack(app, 'msk', {
  group: 'msk',
  vpc: vpcStack,
})

new SESStack(app, 'ses', {
  group: 'ses',
  smtpHost: 'email-smtp.ap-southeast-1.amazonaws.com',
  smtpPort: '587',
})

new IngressNginxStack(app, 'inginx', {
  group: 'eks-ingress-nginx',
  eipStack,
  vpcStack,
})


new APIGatewayStack(app, 'agw', {
  group: 'api-gateway',
  vpc: vpcStack,
})

new EksCFStack(app, 'app-cf', {
  group: 'cloudfront',
})

const eckStack = new ECKStack(app, 'eck', {})

new FilebeatStack(app, 'filebeat', {
  group: 'filebeat',
  eck: eckStack,
})

app.synth()