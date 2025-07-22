import { Construct } from "constructs"
import { TerraformOutput, TerraformStack } from "cdktf"
import initBackend from "../lib/init-backend"
import getVariable from '../config/variable'

export default class VariablesStack extends TerraformStack {

  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const { group  } = config
    initBackend(this, group, id)
    const vars = getVariable(this)
    new TerraformOutput(this, 'vars', {
      value: vars,
    })
    
  }
}