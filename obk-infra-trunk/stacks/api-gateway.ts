import { Construct } from "constructs"
import { TerraformOutput, TerraformStack } from "cdktf"
import initBackend from "../lib/init-backend"
import getVariable from './../config/variable'
import { Apigatewayv2Api } from "../.gen/providers/aws/apigatewayv2-api"
import { Apigatewayv2Stage } from "../.gen/providers/aws/apigatewayv2-stage"
import { SecurityGroup } from "../.gen/providers/aws/security-group"
import { Apigatewayv2VpcLink } from "../.gen/providers/aws/apigatewayv2-vpc-link"
import { Apigatewayv2Integration } from "../.gen/providers/aws/apigatewayv2-integration"
import { Apigatewayv2Route } from "../.gen/providers/aws/apigatewayv2-route"

interface config {
  group: string
  vpc: any
}

export default class APIGatewayStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: config) {
    super(scope, id)
    const { group, vpc } = config
    const vars = getVariable(this)
    initBackend(this, group, id)
    
    const agw = new Apigatewayv2Api(this, 'api-gateway', {
      name: `${vars.PROJECT_ID}-${id}`,
      protocolType: 'HTTP',
    })

    const agwStage = new Apigatewayv2Stage(this, 'api-gateway-stage', {
      apiId: agw.id,
      name: vars?.ENVIRONMENT,
      autoDeploy: true,
    })

    const agwVpcLinkSg = new SecurityGroup(this, 'vpc-link-sg', {
      name: `${vars.PROJECT_ID}-${id}-vpc-link-sg`,
      vpcId: vpc?.vpc?.id,
      egress: [
        {
          fromPort: 80,
          toPort: 80,
          protocol: 'tcp',
          cidrBlocks: ['0.0.0.0/0'],
        }
      ],
    })

    const agwVpcLink = new Apigatewayv2VpcLink(this, 'vpc-link', {
      name: `${vars.PROJECT_ID}-${id}-vpc-link`,
      securityGroupIds: [agwVpcLinkSg.id],
      subnetIds: vpc?.privateSubnets?.map((subnet: any) => subnet.id),
    })

    const agwIntegration = new Apigatewayv2Integration(this, 'agw-integration', {
      apiId: agw.id,
      integrationType: 'HTTP_PROXY',
      connectionType: 'VPC_LINK',
      connectionId: agwVpcLink.id,
      integrationMethod: 'ANY',
      integrationUri: 'arn:aws:elasticloadbalancing:ap-southeast-1:479397374389:listener/net/k8s-staging-echoserv-0a774328e4/5c9f0f39fda1707e/7a8fff063e08cf72',
    })

    new Apigatewayv2Route(this, 'agw-route', {
      apiId: agw.id,
      routeKey: 'GET /echo',
      target: `integrations/${agwIntegration.id}`
    })

    new TerraformOutput(this, 'vpc-link-output', {
      value: `${agwStage.invokeUrl}/echo`,
    })
  }
}
