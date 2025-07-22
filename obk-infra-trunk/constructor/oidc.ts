import { Construct } from "constructs"
import getVariable from './../config/variable'

import { TlsProvider } from '../.gen/providers/tls/provider'
import { DataTlsCertificate } from '../.gen/providers/tls/data-tls-certificate'
import { IamOpenidConnectProvider } from "../.gen/providers/aws/iam-openid-connect-provider"

export default class EksOidcConstructor extends Construct {
  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)

    const { eks } = config
    const vars = getVariable(this)


    new TlsProvider(this, 'tls-provider', {})
    const dataCert = new DataTlsCertificate(this, 'data-cert', {
      url: eks.cluster.identity.get(0).oidc.get(0).issuer,
    })

    // const oidcProvider = 
    new IamOpenidConnectProvider(this, 'oidc-provider', {
      clientIdList: ["sts.amazonaws.com"],
      url: eks.cluster.identity.get(0).oidc.get(0).issuer,
      thumbprintList: [
        dataCert.certificates.get(0).sha1Fingerprint,
      ],
      tags: {
        Name: `${vars.PROJECT_ID}-eks-irsa`,
      }
    })
  }
}
