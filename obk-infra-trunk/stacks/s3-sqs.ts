import { Construct } from "constructs"
import { TerraformOutput, TerraformStack } from "cdktf"
import initBackend from "../lib/init-backend"
import getVariable from '../config/variable'

import { S3Bucket } from '../.gen/providers/aws/s3-bucket'
import { S3BucketVersioningA } from '../.gen/providers/aws/s3-bucket-versioning'
import { S3BucketNotification } from '../.gen/providers/aws/s3-bucket-notification'
import { DataAwsIamPolicyDocument } from '../.gen/providers/aws/data-aws-iam-policy-document'
import { SqsQueue } from '../.gen/providers/aws/sqs-queue'

export default class S3SqsStack extends TerraformStack {

  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const vars = getVariable(this)
    const { group  } = config
    initBackend(this, group, id)

    const sqsQueueName = `${vars.PROJECT_ID}-s3-event-notification-queue`
    const bucketName = `${vars.PROJECT_ID}-s3-event-test`

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

    const dataSQSPolicy = new DataAwsIamPolicyDocument(this, 'sqs-policy', {
      dependsOn: [bucket],
      statement: [
        {
          actions: [
            'sqs:SendMessage',
          ],
          effect: 'Allow',
          resources: [
            `arn:aws:sqs:*:*:${sqsQueueName}`,
          ],
          principals: [{
            identifiers: ['s3.amazonaws.com'],
            type: 'Service',
          }],
          condition: [
            {
              test: 'ArnEquals',
              variable: 'aws:SourceArn',
              values: [`${bucket.arn}`],
            }
          ]
        },
      ],
    })

    const sqsQueue = new SqsQueue(this, 'sqs-queue', {
      dependsOn: [dataSQSPolicy],
      name: sqsQueueName,
      policy: dataSQSPolicy.json,
    })

    const bucketNotification = new S3BucketNotification(this, 'bucket-notification', {
      dependsOn: [bucket, sqsQueue],
      bucket: bucket.id,
      queue: [
        {
          id: 'fs-tenants',
          queueArn: sqsQueue.arn,
          events: ['s3:ObjectCreated:*'],
          filterPrefix: 'data/',
          filterSuffix: 'tenants.json',
        },
        {
          id: 'fs-towers',
          queueArn: sqsQueue.arn,
          events: ['s3:ObjectCreated:*'],
          filterPrefix: 'data/',
          filterSuffix: 'towers.json',
        },
        {
          id: 'fs-locations',
          queueArn: sqsQueue.arn,
          events: ['s3:ObjectCreated:*'],
          filterPrefix: 'data/',
          filterSuffix: 'locations.json',
        },
      ]
    })
    
    new TerraformOutput(this, 'output-bucket', {
      value: bucket,
    })
    
    new TerraformOutput(this, 'output-sqs', {
      value: sqsQueue,
    })
    
    new TerraformOutput(this, 'output-bucket-noti', {
      value: bucketNotification,
    })

    new TerraformOutput(this, 'output-test', {
      value: {
        bucket: bucket.id,
        queue: [{
          id: 's3-event-notification',
          queueArn: sqsQueue.arn,
          events: ['s3:ObjectCreated:*'],
          filterSuffix: '.log',
        }]
      },
    })
  }
}