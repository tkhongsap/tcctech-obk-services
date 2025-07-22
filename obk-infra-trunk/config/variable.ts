import { TerraformVariable } from "cdktf";
import 'dotenv/config'
import forEach from 'lodash/forEach'
import isNaN from 'lodash/isNaN'
import toNumber from 'lodash/toNumber'

const INPUT_VARS = [
    { name: 'ID', type: 'string' },
    { name: 'ENVIRONMENT', type: 'string' },
    { name: 'ENVIRONMENT_FULL_NAME', type: 'string' },
    { name: 'DEFAULT_REGION', type: 'string' },
    { name: 'CIDR_BLOCK', type: 'string' },
    { name: 'AZ_COUNT', type: 'number' },
    { name: 'EKS_CLUSTER', type: 'string' },
    { name: 'EKS_CLUSTER_VERSION', type: 'string' },
    { name: 'EKS_NG_DISK_SIZE', type: 'number' },
    { name: 'EKS_NG_INSTANCE_TYPE', type: 'string' },
    { name: 'EKS_NG_CAPACITY_TYPE', type: 'string' },
    { name: 'EKS_NG_DESIRED_SIZE', type: 'number' },
    { name: 'EKS_NG_MIN_SIZE', type: 'number' },
    { name: 'EKS_NG_MAX_SIZE', type: 'number' },
    { name: 'EKS_NODE_GROUP_VERSION', type: 'string' },
    { name: 'GITHUB_TOKEN', type: 'string' },
    { name: 'PG_PUBLIC', type: 'number' },
    { name: 'PG_COMMON_INSTANCE_TYPE', type: 'string', default: 'db.t3.medium', },
    { name: 'PG_COMMON_STORAGE_SIZE', type: 'number', default: 20, },
    { name: 'PG_COMMON_STORAGE_TYPE', type: 'string', default: 'gp2', },
    { name: 'PG_COMMON_VERSION', type: 'string', default: '15.5', },
    { name: 'PG_COMMON_USERNAME', type: 'string' },
    { name: 'PG_COMMON_PASSWORD', type: 'string' },
    { name: 'PG_COMMON_BACKUP_RETENTION_PERIOD', type: 'number', default: 4, },
    { name: 'REDIS_NODE_TYPE', type: 'string', default: 'cache.t2.micro', },
    { name: 'REDIS_NUM_CACHE_NODES', type: 'number', default: 1, },
    { name: 'REDIS_PARAM_GROUP_NAME', type: 'string', default: 'default.redis6.x', },
    { name: 'REDIS_VERSION', type: 'string', default: '6.2', },
    { name: 'MSK_INSTANCE_TYPE', type: 'string', default: 'kafka.t3.small', },
    { name: 'MSK_DISK_SIZE', type: 'number', default: 100, },
    { name: 'MSK_VERSION', type: 'string', default: '3.5.1', },
    { name: "MSK_NO_OF_BROKER_NODES", type: "number" },
    { name: 'ARGO_HOST', type: 'string' },
    { name: 'ARGO_GOOGLE_CLIENT_ID', type: 'string' },
    { name: 'ARGO_GOOGLE_CLIENT_SECRET', type: 'string' },
    { name: 'EKS_CF_DOMAINS', type: 'string' },
    { name: 'EKS_ALB_DNS', type: 'string' },
    { name: 'APP_ACM_CERTIFICATE_ARN', type: 'string' },
    { name: 'KARPENTER_INSTANCE_TYPES', type: 'string' },
    { name: 'KIBANA_PROTOCOL', type: 'string' },
    { name: 'KIBANA_DOMAIN', type: 'string' },
    { name: 'ELASTICSEARCH_REQUEST_CPU', type: 'string' },
    { name: 'ELASTICSEARCH_REQUEST_MEMORY', type: 'string' },
    { name: 'ELASTICSEARCH_LIMIT_CPU', type: 'string' },
    { name: 'ELASTICSEARCH_LIMIT_MEMORY', type: 'string' },
    { name: 'ELASTICSEARCH_NUM_OF_NODES', type: 'number' },
    { name: 'ELASTICSEARCH_NODE_STORAGE', type: 'string' },
    { name: 'ELASTICSEARCH_DATA_REQUEST_CPU', type: 'string' },
    { name: 'ELASTICSEARCH_DATA_REQUEST_MEMORY', type: 'string' },
    { name: 'ELASTICSEARCH_DATA_LIMIT_CPU', type: 'string' },
    { name: 'ELASTICSEARCH_DATA_LIMIT_MEMORY', type: 'string' },
    { name: 'ELASTICSEARCH_DATA_NUM_OF_NODES', type: 'number' },
    { name: 'ELASTICSEARCH_DATA_NODE_STORAGE', type: 'string' },
    { name: 'ELASTICSEARCH_DATA_WARM_REQUEST_CPU', type: 'string' },
    { name: 'ELASTICSEARCH_DATA_WARM_REQUEST_MEMORY', type: 'string' },
    { name: 'ELASTICSEARCH_DATA_WARM_LIMIT_CPU', type: 'string' },
    { name: 'ELASTICSEARCH_DATA_WARM_LIMIT_MEMORY', type: 'string' },
    { name: 'ELASTICSEARCH_DATA_WARM_NUM_OF_NODES', type: 'number' },
    { name: 'ELASTICSEARCH_DATA_WARM_NODE_STORAGE', type: 'string' },
    { name: 'ELASTICSEARCH_USERNAME', type: 'string' },
    { name: 'ELASTICSEARCH_INSTANCE_TYPE_SMALL', type: 'string' },
    { name: 'ELASTICSEARCH_INSTANCE_TYPE_LARGE', type: 'string' },
]

interface ENV_CONFIG {
    name: string
    type: string
    default?: any
}

export default (_this:any) => {
    const variables = {} as any
    forEach(INPUT_VARS, (inputVar:ENV_CONFIG) => {
        let value = inputVar?.default
        if (process?.env?.[inputVar.name]) {
            value = process?.env?.[inputVar.name]
            if (inputVar.type === 'number') {
                value = toNumber(value)
                if (isNaN(value)) {
                    value = inputVar?.default
                }
            }
        }

        const variable = new TerraformVariable(_this, inputVar.name, {
            type: inputVar.type,
            default: value,
            description: `Missing ENV:${inputVar.name}`,
        })
        variables[inputVar.name] = variable.value
    })

    const PROJECT_ID = process?.env?.ID && process?.env?.ENVIRONMENT ? `${process?.env?.ID}-${process?.env?.ENVIRONMENT}` : undefined

    const TF_PROJECT_ID = new TerraformVariable(_this, 'PROJECT_ID', {
        type: 'string',
        default: PROJECT_ID,
        description: 'Missing ENV:PROJECT_ID, make sure ID and ENVIRONMENT are entered',
    })
    variables.PROJECT_ID = TF_PROJECT_ID.value

    const EKS_CLUSTER_NAME = process?.env?.ENVIRONMENT && process?.env?.EKS_CLUSTER ? `${process?.env?.EKS_CLUSTER}-${process?.env?.ENVIRONMENT}` : undefined
    
    const TF_EKS_CLUSTER_NAME = new TerraformVariable(_this, 'EKS_CLUSTER_NAME', {
        type: 'string',
        default: EKS_CLUSTER_NAME,
        description: 'Missing ENV:PROJECT_ID, make sure ID and ENVIRONMENT are entered',
    })
    variables.EKS_CLUSTER_NAME = TF_EKS_CLUSTER_NAME.value
    
    return variables
}
