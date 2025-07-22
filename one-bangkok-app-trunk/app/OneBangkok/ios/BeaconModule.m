//
//  BeaconModule.m
//  namo
//
//  Created by Sittitep Tosuwan on 23/11/2566 BE.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(BeaconModule, NSObject)
  RCT_EXTERN_METHOD(startScanning:(NSString *)uuidString)
  RCT_EXTERN_METHOD(stopScanning:(NSString *)uuidString)
@end
