import { Construct } from "constructs"
import { TerraformStack, Fn } from "cdktf"
import { CloudfrontFunction } from "../../.gen/providers/aws/cloudfront-function"

import getVariable from './../../config/variable'
import initBackend from "../../lib/init-backend"

export default class CloudFrontFunctionStack extends TerraformStack {
  public readonly S3PrettyUrl:CloudfrontFunction
  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const { group } : { group: string } = config
    const vars = getVariable(this)
    initBackend(this, group, id)

    const S3PrettyUrl = new CloudfrontFunction(this, 'cf-func-s3-pretty-url', {
      name: `${vars.PROJECT_ID}-s3-pretty-url`,
      code: Fn.file(`${__dirname}/functions/s3-pretty-url.js`),
      runtime: 'cloudfront-js-1.0',
    })

    this.S3PrettyUrl = S3PrettyUrl
  }
}