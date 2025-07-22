import { Construct } from "constructs"
import { TerraformStack } from "cdktf"
import initBackend from "../lib/init-backend"
import getVariable from '../config/variable'
import { S3Bucket } from '../.gen/providers/aws/s3-bucket'
import { S3BucketVersioningA } from '../.gen/providers/aws/s3-bucket-versioning'

export default class S3Stack extends TerraformStack {

  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const { group, name  } = config
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
  }
}