import { Construct } from "constructs"
import { TerraformStack } from "cdktf"
import initBackend from "../lib/init-backend"
import getVariable from './../config/variable'
import ECRConstructor from "../constructor/ecr"
import { GithubProvider } from "../.gen/providers/github/provider"

interface config {
  group: string
}

export default class ECRStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: config) {
    super(scope, id)
    const { group } = config
    const vars = getVariable(this)
    initBackend(this, group, id)
    new GithubProvider(this, 'github', {
      owner: 'mtel-thailand',
      token: vars.GITHUB_TOKEN,
    })

    // ob-infra-status
    new ECRConstructor(this, 'ecr-ob-infra-status', {
      name: `ob-infra-status/${vars.ENVIRONMENT_FULL_NAME}`,
      repository: 'ob-infra-status',
      repositoryURL: 'REPOSITORY_URL',
    })
    
    // ob-cms
    new ECRConstructor(this, 'ecr-ob-cms', {
      name: `ob-cms/${vars.ENVIRONMENT_FULL_NAME}`,
      repository: 'ob-cms',
      repositoryURL: 'REPOSITORY_URL',
    })
    // ob-bms
    new ECRConstructor(this, 'ecr-ob-bms', {
      name: `ob-bms/${vars.ENVIRONMENT_FULL_NAME}`,
      repository: 'ob-bms',
      repositoryURL: 'REPOSITORY_URL',
    })

    new ECRConstructor(this, 'ecr-ob-bus', {
      name: `ob-bus/${vars.ENVIRONMENT_FULL_NAME}`,
      repository: 'ob-bus',
      repositoryURL: 'REPOSITORY_URL',
    })

    // ob-iam
    new ECRConstructor(this, 'ecr-ob-iam', {
      name: `ob-iam/${vars.ENVIRONMENT_FULL_NAME}`,
      repository: 'ob-iam',
      repositoryURL: 'REPOSITORY_URL',
    })
    // ob-document
    new ECRConstructor(this, 'ecr-ob-document', {
      name: `ob-document/${vars.ENVIRONMENT_FULL_NAME}`,
      repository: 'ob-document',
      repositoryURL: 'REPOSITORY_URL',
    })
    // ob-notification
    new ECRConstructor(this, 'ecr-ob-notification', {
      name: `ob-notification/${vars.ENVIRONMENT_FULL_NAME}`,
      repository: 'one-bangkok',
      repositoryURL: 'OB_NOTIFICATION_REPOSITORY_URL',
    })
    // ob-websocket
    new ECRConstructor(this, 'ecr-ob-websocket', {
      name: `ob-websocket/${vars.ENVIRONMENT_FULL_NAME}`,
      repository: 'one-bangkok',
      repositoryURL: 'OB_WEBSOCKET_REPOSITORY_URL',
    })
    // ob-gw
    new ECRConstructor(this, 'ecr-ob-gw', {
      name: `ob-gw/${vars.ENVIRONMENT_FULL_NAME}`,
      repository: 'one-bangkok',
      repositoryURL: 'OB_GW_REPOSITORY_URL',
    })
  }
}
