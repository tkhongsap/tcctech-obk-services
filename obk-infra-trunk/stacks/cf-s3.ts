import forEach from 'lodash/forEach'

import { Construct } from "constructs"
import { TerraformStack, TerraformOutput } from "cdktf"

import getVariable from './../config/variable'
import initBackend from "../lib/init-backend"

import { S3Bucket } from '../.gen/providers/aws/s3-bucket'
import { CloudfrontDistribution } from '../.gen/providers/aws/cloudfront-distribution'
import { CloudfrontOriginAccessIdentity } from '../.gen/providers/aws/cloudfront-origin-access-identity'
import { DataAwsIamPolicyDocument } from '../.gen/providers/aws/data-aws-iam-policy-document'
import { S3BucketPolicy } from '../.gen/providers/aws/s3-bucket-policy'
import { GithubProvider } from "../.gen/providers/github/provider"
import { ActionsVariable } from "../.gen/providers/github/actions-variable";

interface config {
  name: string
  group: string
  region?: string
  cfFunction?: any
  gh?: GH
}

type GH = {
  owner: string
  repos: string[]
}

export default class CloudFrontS3Static extends TerraformStack {
  constructor(scope: Construct, id: string, config: config) {
    super(scope, id)
    const { group, name, cfFunction, gh } = config
    const vars = getVariable(this)
    initBackend(this, group, id)

    const bucketName = `${vars.ID}-${name}`
    const bucket = new S3Bucket(this, 'bucket', {
      bucket: bucketName,
      tags: {
        Name: bucketName,
        environment: vars.ENVIRONMENT,
      },
    })

    const oai = new CloudfrontOriginAccessIdentity(this, 'oai', {
      comment: `${bucketName}-oai`
    })

    const policyDoc = new DataAwsIamPolicyDocument(this, 's3-policy-doc', {
      statement: [
        {
          actions: ['s3:GetObject'],
          effect: 'Allow',
          resources: [`${bucket.arn}/*`],
          principals: [{
            identifiers: [`${oai.iamArn}`],
            type: "AWS",
          }]
        },
        {
          actions: ['s3:ListBucket'],
          effect: 'Allow',
          resources: [bucket.arn],
          principals: [{
            identifiers: [oai.iamArn],
            type: "AWS",
          }]
        },
      ]
    })

    new S3BucketPolicy(this, 's3-bucket-policy', {
      bucket: bucket.id,
      policy: policyDoc.json,
    })

    const cf = new CloudfrontDistribution(this, 'cf-distribution', {
      enabled: true,
      origin: [
        {
          originId: bucket.bucket,
          domainName: bucket.bucketRegionalDomainName,
          s3OriginConfig: {
            originAccessIdentity: oai.cloudfrontAccessIdentityPath,
          }
        }
      ],
      defaultCacheBehavior: {
        targetOriginId: bucket.bucket,
        allowedMethods: ["GET", "HEAD"],
        cachedMethods: ["GET", "HEAD"],
        forwardedValues: {
          queryString: true,
          cookies: {
            forward: "all",
          }
        },
        viewerProtocolPolicy: "redirect-to-https",
        functionAssociation: [
          {
            functionArn: cfFunction.S3PrettyUrl.arn,
            eventType: "viewer-request",
          }
        ]
      },
      restrictions: {
        geoRestriction: {
          restrictionType: 'none',
        }
      },
      viewerCertificate: {
        cloudfrontDefaultCertificate: true
      }
    })

    if (gh) {
      new GithubProvider(this, 'github', {
        owner: gh.owner,
        token: vars.GITHUB_TOKEN,
      })

      forEach(gh.repos, (repository) => {
        new ActionsVariable(this, 'actions-variable-cf', {
          repository,
          variableName: 'CLOUDFRONT_ID',
          value: cf.id,
        })
        
        new ActionsVariable(this, 'actions-variable-bucket', {
          repository,
          variableName: 'BUCKET',
          value: bucket.id,
        })
      })
    }

    new TerraformOutput(this, 'output-bucket', {
      value: bucket.arn,
    })

    new TerraformOutput(this, 'output-cloudfront', {
      value: {
        arn: cf.arn,
        domain: cf.domainName,
      },
    })
  }
}