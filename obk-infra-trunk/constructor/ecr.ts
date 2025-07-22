import { Construct } from "constructs"
import { EcrRepository } from "../.gen/providers/aws/ecr-repository"
import { EcrLifecyclePolicy } from "../.gen/providers/aws/ecr-lifecycle-policy"
import { RepositoryEnvironment } from "../.gen/providers/github/repository-environment";
import { ActionsEnvironmentVariable } from "../.gen/providers/github/actions-environment-variable";
import { TerraformOutput } from "cdktf";
import getVariable from './../config/variable'

interface config {
  name: string
  repository: string
  repositoryURL: string
}

export default class ECRConstructor extends Construct {
  public readonly ecr: EcrRepository
  constructor(scope: Construct, id: string, config: config) {
    const { name, repository, repositoryURL } = config
    super(scope, id)

    const vars = getVariable(this)
    const ecr = new EcrRepository(this, 'ecr', {
      name,
      imageTagMutability: 'MUTABLE',
      imageScanningConfiguration: {
        scanOnPush: true,
      }
    })

    new EcrLifecyclePolicy(this, 'ecr-lifecycle-policy', {
      repository: ecr.name,
      policy: JSON.stringify({
        rules: [
          {
            rulePriority: 1,
            description: "cleanup untagged images",
            selection: {
              tagStatus: "untagged",
              countType: "sinceImagePushed",
              countUnit: "days",
              countNumber: 1
            },
            action: {
              type: "expire"
            }
          },
          {
            rulePriority: 2,
            description: "max images to keep",
            selection: {
              tagStatus: "any",
              countType: "imageCountMoreThan",
              countNumber: 10,
            },
            action: {
              type: "expire"
            }
          }
        ]
      })
    })

    new RepositoryEnvironment(this, 'actions-env', {
      repository,
      environment: vars.ENVIRONMENT_FULL_NAME,
    })

    new ActionsEnvironmentVariable(this, 'actions-variable-registry', {
      repository,
      environment: vars.ENVIRONMENT_FULL_NAME,
      variableName: repositoryURL,
      value: ecr.repositoryUrl,
    })

    this.ecr = ecr
    
    new TerraformOutput(this, 'ecr-url', {
      value: ecr.repositoryUrl,
    })
  }
}
