import { Construct } from "constructs"
import { TerraformOutput, TerraformStack } from "cdktf"
import initBackend from "../lib/init-backend"
import getVariable from '../config/variable'
import { S3Bucket } from '../.gen/providers/aws/s3-bucket'
import { S3BucketVersioningA } from '../.gen/providers/aws/s3-bucket-versioning'
import { DataAwsIamPolicyDocument } from '../.gen/providers/aws/data-aws-iam-policy-document'
import { S3BucketPolicy } from '../.gen/providers/aws/s3-bucket-policy'
import RDSConstructor from "./../constructor/rds"

export default class BMSStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const { group, vpc } = config
    const name = 'fs-bms-data'
    initBackend(this, group, id)
    const vars = getVariable(this)
    const bucketName = `${vars.PROJECT_ID}-${name}`
    const bucket = new S3Bucket(this, 'bucket', {
      bucket: bucketName,
      tags: {
        Name: bucketName,
        environment: vars.ENVIRONMENT,
      },
    })

    new S3BucketVersioningA(this, 'enable-bucket-versioning', {
      dependsOn: [bucket],
      bucket: bucket.id,
      versioningConfiguration: {
        status: 'Enabled',
      }
    })

    const bmsBucketName = `${vars.PROJECT_ID}-bucket-bms`

    const bmsBucket = new S3Bucket(this, 'bucket-bms', {
      bucket: bmsBucketName,
      tags: {
        Name: bmsBucketName,
        environment: vars.ENVIRONMENT,
      },
    })

    new S3BucketVersioningA(this, 'enable-bucket-bms-versioning', {
      dependsOn: [bmsBucket],
      bucket: bmsBucket.id,
      versioningConfiguration: {
        status: 'Enabled',
      }
    })

    const policyDoc = new DataAwsIamPolicyDocument(this, 's3-policy-doc', {
      statement: [
        {
          actions: ['s3:GetObject', 's3:PutObject', 's3:ListBucket'],
          effect: 'Allow',
          resources: [bucket.arn, `${bucket.arn}/*`],
          principals: [{
            identifiers: ["arn:aws:iam::479397374389:user/fs_user_01"],
            type: "AWS",
          }]
        },
      ]
    })

    new RDSConstructor(this, `${id}-rds`, {
      vpc,
      dbIdentifier: 'ob-bms',
      dbName: 'ob_bms',
      repository: 'ob-bms',
    })

    new S3BucketPolicy(this, 's3-bucket-policy', {
      bucket: bucket.id,
      policy: policyDoc.json,
    })

    new TerraformOutput(this, 'output-bucket-name', {
      value: bucket.id,
    })
  }
}