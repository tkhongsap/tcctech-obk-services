import * as OBIAMSDK from 'ob-iam-sdk';

OBIAMSDK.setBaseUrl(process.env.OB_IAM_URL || 'https://dev.glorymtel.xyz/ob-iam');

export default {
  IAM: OBIAMSDK,
};
