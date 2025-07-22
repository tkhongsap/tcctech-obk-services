import { Construct } from "constructs"
import { TerraformStack } from "cdktf"
import initBackend from "../lib/init-backend"
import RDSConstructor from "./../constructor/rds"


export default class OBNotificationStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const { group, vpc } = config
    initBackend(this, group, id)
    
    new RDSConstructor(this, `${id}-rds`, {
      vpc,
      dbIdentifier: 'ob-notification',
      dbName: 'ob_notification',
      repository: 'one-bangkok',
      secretPrefix: 'OB_NOTIFICATION_',
    })
  }
}