import 'dotenv/config'
import toNumber from 'lodash/toNumber'

const config = {
    PROJECT_ID: `${process?.env?.ID}-${process?.env?.ENVIRONMENT}`,
    DEFAULT_REGION: process?.env?.DEFAULT_REGION,
    AZ_COUNT: toNumber(process?.env?.AZ_COUNT),
    EKS_CLUSTER_NAME: process?.env?.EKS_CLUSTER_NAME,
}

export default config