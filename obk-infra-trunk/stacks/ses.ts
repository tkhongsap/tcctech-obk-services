import { Construct } from "constructs"
import { Fn, TerraformOutput, TerraformStack } from "cdktf"
import initBackend from "../lib/init-backend"
import getVariable from '../config/variable'
import { SesDomainIdentity } from "../.gen/providers/aws/ses-domain-identity"
import { IamUser } from "../.gen/providers/aws/iam-user"
import { IamAccessKey } from "../.gen/providers/aws/iam-access-key"
import { DataAwsIamPolicyDocument } from "../.gen/providers/aws/data-aws-iam-policy-document"
import { IamPolicy } from "../.gen/providers/aws/iam-policy"
import { IamUserPolicyAttachment } from "../.gen/providers/aws/iam-user-policy-attachment"

interface config {
  group: string
  smtpHost: string
  smtpPort: string
}

export default class SESStack extends TerraformStack {  
  constructor(scope: Construct, id: string, config: config) {
    super(scope, id)
    const { group, smtpHost, smtpPort } = config
    const vars = getVariable(this)
    initBackend(this, group, id)
    
    const sesIdentify = new SesDomainIdentity(this, 'ses', {
      domain: 'ob-dev.mtel.co.th',
    })

    const iam = new IamUser(this, 'iam', {
      name: `ses-smtp-user-${vars.ENVIRONMENT}`,
      tags: {
        name: 'SES SMTP user',
      },
    })

    const iamAccessKey = new IamAccessKey(this, 'iam-access-key', {
      user: iam.name,
    })

    const policyDoc = new DataAwsIamPolicyDocument(this, 'iam-policy-doc', {
      statement: [
        {
          actions: ["ses:SendEmail", "ses:SendRawEmail"],
          resources: [sesIdentify.arn],
        }
      ]
    })

    const iamPolicy = new IamPolicy(this, 'iam-policy', {
      name: `ses-smtp-policy-${vars.ENVIRONMENT}`,
      policy: policyDoc.json,
    })

    new IamUserPolicyAttachment(this, 'iam-policy-attachment', {
      user: iam.name,
      policyArn: iamPolicy.arn,
    })

    new TerraformOutput(this, 'credential', {
      value: {
        smtpHost,
        smtpPort,
        username: iamAccessKey.id,
        password: Fn.nonsensitive(iamAccessKey.sesSmtpPasswordV4),
      },
    })
    
    
  }
}