# One Bangkok Infrastructure

## Pre-requisite
1. Clone repo
2. Install cdktf cli 
```
npm install --global cdktf-cli@latest
```
3. Terraform **v1.5.7**

## Get Started
There are **5 environments** with corresponding env files
 - development -> .env.development
 - sit -> .env.sit
 - uat -> .env.uat
 - production -> .env.production
 - common -> .env.common

**common** is for resource share across environment such as SES and SNS, they share across dev and sit.  
Revise env files for your needs.

### Step 1
Install node modules
```
yarn
```

### Step 2

Pull Terraform data such as providers, modules
```
cdktf get
```

Expect result
```
Generated typescript constructs in the output directory: .gen
```

### Step 3
Choose env, run
```
export ENV=development
```

### Step 4
Pull remote states
```
cdktf synth
```

Expect result
```
Generated Terraform code for the stacks: vpc, eks, ng-iam, ng, karpenter, provisioner, lbc, argo, app, s3-sqs, cf-func, integration-doc, ecr, ob-bms, ob-iam, ob-document, ob-notification, redis, vars, msk, ses
```

### Step 5
Provisioning

#### Deploy VPC
```
cdktf deploy vpc
```

#### Deploy EKS
eks stack has bind with vpc stack, so we need to apply both
```
cdktf deploy eks vpc
```

#### Deploy Node Group
```
cdktf deploy ng-iam ng
```

#### Deploy Karpenter 
```
cdktf deploy karpenter ng-iam
```

#### Deploy Karpenter Provisioner
```
cdktf deploy provisioner
```

#### Deploy Load Balancer Controller
```
cdktf deploy lbc
```

#### Deploy ArgoCD
```
cdktf deploy argo
```

#### Deploy ECR
```
cdktf deploy ecr
```

Check the file `/stacks/ecr.ts`
```js
new ECRConstructor(this, 'ecr', {
    name: `ob-infra-status/${vars.ENVIRONMENT_FULL_NAME}`,
    repository: 'ob-infra-status',
})
```

There are two params
 - name: registry name
 - repository: the name from github repository, will create a variable on Github for ECR URL 

#### Deploy ob-bms stack
 - RDS PG
 - S3 bucket for FS
```
cdktf deploy ob-bms
```

#### Deploy ob-iam stack
 - RDS PG
```
cdktf deploy ob-iam
```

#### Deploy ob-document stack
```
cdktf deploy ob-document
```

#### Deploy ob-notification stack
```
cdktf deploy ob-notification
```

#### Deploy ElastiCache Redis
```
cdktf deploy redis
```

#### Deploy MSK
```
cdktf deploy msk
```


### Deploy Application on ArgoCD
Install kustomize  
https://formulae.brew.sh/formula/kustomize


go to dir
```
cd app-argo
```

Copy from example
```
cd infra-status someting
cd someting
```

revise `gen`
```json
patches:
- patch: |-
    - op: replace
      path: /spec/source/repoURL
      value: https://github.com/mtel-thailand/ob-infra-status // replace repo url
    - op: replace
      path: /spec/source/targetRevision
      value: $ENV // replace branch name
    - op: replace
      path: /spec/source/path
      value: k8s/$ENV // application k8s working dir
  target:
    kind: Application
- patch: |-
    - op: replace
      path: /stringData/url
      value: https://github.com/mtel-thailand/ob-infra-status // replace repo url
  target:
    kind: Secret
```

```
envsubst < gen > kustomization.yaml
```

verify
```
kustomize build
```

apply
```
kubectl apply -k .
```