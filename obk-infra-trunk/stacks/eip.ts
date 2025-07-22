import { Construct } from "constructs"
import { TerraformStack, TerraformOutput } from "cdktf"
// import { TerraformStack, TerraformOutput, Fn } from "cdktf"

import getVariable from './../config/variable'
import initBackend from "../lib/init-backend"

import { Eip } from "../.gen/providers/aws/eip"
// import { DataAwsAvailabilityZones } from "../.gen/providers/aws/data-aws-availability-zones"
// import toNumber from 'lodash/toNumber'

export default class EipStack extends TerraformStack {
  public natEip: Eip
  // public nlbEips: Eip[]

  constructor(scope: Construct, id: string, config: any) {
    super(scope, id)
    const { group } : { group: string } = config
    const vars = getVariable(this)
    initBackend(this, group, id)

    const natEip = new Eip(this, ' nat-eip', {
      tags: {
        Name: `${vars.PROJECT_ID}-eip-nat`,
        environment: vars.ENVIRONMENT,
      }
    })
    
    // const azs = new DataAwsAvailabilityZones(this, 'azs')

    // const azCount = toNumber(process?.env?.AZ_COUNT)
    // const azCountArr = Array.from(Array(azCount).keys())
    // const nlbEips = azCountArr.map((index) => {
    //   const az = Fn.element(azs.names, index)
    //   return new Eip(this, `nlb-eips-${index}`, {
    //     tags: {
    //       Name: `${vars.PROJECT_ID}-eip-nlb-${az}`,
    //       environment: vars.ENVIRONMENT,
    //       az,
    //     }
    //   })
    // })


    this.natEip = natEip
    // this.nlbEips = nlbEips

    new TerraformOutput(this, 'output-nat-eip', {
      value: this.natEip,
    })
    // new TerraformOutput(this, 'output-nlb-eips', {
    //   value: nlbEips,
    // })

  }
}