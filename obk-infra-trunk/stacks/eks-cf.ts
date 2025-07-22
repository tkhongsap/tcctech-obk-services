import { Construct } from "constructs"
import { TerraformStack, TerraformOutput, Fn } from "cdktf"

import getVariable from './../config/variable'
import initBackend from "../lib/init-backend"

import { CloudfrontDistribution } from '../.gen/providers/aws/cloudfront-distribution'
// import split from 'lodash/split'
// import map from 'lodash/map'

interface config {
  group: string
}

export default class EksCFStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: config) {
    super(scope, id)
    const { group } = config
    const vars = getVariable(this)
    initBackend(this, group, id)
    const appDomains = Fn.split(',', vars?.EKS_CF_DOMAINS)
    
    const cf = new CloudfrontDistribution(this, 'cf-distribution', {
      enabled: true,
      comment: `${vars.PROJECT_ID}-app-cf`,
      aliases: appDomains,
      origin: [
        {
          domainName: vars?.EKS_ALB_DNS,
          originId: 'eks-alb',
          customOriginConfig: {
            httpPort: 80,
            httpsPort: 443,
            originProtocolPolicy: "http-only",
            originSslProtocols: [
              "TLSv1.2",
            ],
          }
        }
      ],
      defaultCacheBehavior: {
        targetOriginId: "eks-alb",
        allowedMethods: [
          "GET",
          "HEAD",
          "OPTIONS",
          "PUT",
          "POST",
          "PATCH",
          "DELETE",
        ],
        cachedMethods: ["GET", "HEAD"],
        viewerProtocolPolicy: "redirect-to-https",
        minTtl: 0,
        defaultTtl: 0,
        maxTtl: 0,
        compress: true,
        forwardedValues: {
          headers: ["*"],
          queryString: true,
          queryStringCacheKeys: ["*"],
          cookies: {
            forward: "all",
          },
        },
      },
      restrictions: {
        geoRestriction: {
          restrictionType: 'none',
        }
      },
      viewerCertificate: {
        acmCertificateArn: vars?.APP_ACM_CERTIFICATE_ARN,
        cloudfrontDefaultCertificate: true,
        minimumProtocolVersion: "TLSv1.2_2021",
        sslSupportMethod: "sni-only",
      }
    })

    new TerraformOutput(this, 'output-cloudfront', {
      value: {
        arn: cf.arn,
        domain: cf.domainName,
      },
    })
  }
}