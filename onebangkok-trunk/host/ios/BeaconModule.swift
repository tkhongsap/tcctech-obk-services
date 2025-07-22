import Foundation
import CoreLocation
import React
import EstimoteProximitySDK
import Reachability

@objc(BeaconModule)
class BeaconModule: RCTEventEmitter, CLLocationManagerDelegate {
    var locationManager: CLLocationManager?
    var proximityObserver: ProximityObserver?

    override init() {
        super.init()
        self.locationManager = CLLocationManager()
        self.locationManager?.delegate = self
        self.locationManager?.requestAlwaysAuthorization()
    }

    // React Native module name
    override static func moduleName() -> String! {
        return "BeaconScanner"
    }

    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func supportedEvents() -> [String]! {
        return ["onEnterRegion", "onExitRegion"]
    }

    @objc
    func startScanning(_ tag: String) {
        let reachability = try! Reachability()
        if reachability.connection != .unavailable {
            print("connecting with: \(reachability.connection.description)")
            print("startScanning")
            if #available(iOS 13.0, *) {
                let estimoteCloudCredentials = CloudCredentials(appID: "onebangkokapp-frasersprope-lcc", appToken: "4241ac93ceaa11cab472388b56c1fb7d")

                self.proximityObserver = ProximityObserver(credentials: estimoteCloudCredentials, onError: { error in
                    print("ProximityObserver error: \(error)")
                })

                let zone = defineZone(tag: tag)
                DispatchQueue.main.async {
                    self.proximityObserver?.startObserving([zone])
                }
            }
        } else {
            print("No internet connection available.")
            // Handle lack of internet connectivity appropriately
            // You might want to send a notification back to React Native code if needed
      }
    }

    func defineZone(tag: String) ->  ProximityZone {
        let zone = ProximityZone(tag: tag, range: ProximityRange(desiredMeanTriggerDistance: 5.0)!)
      
        zone.onEnter = { zoneContext in
            print("Entered near range of tag \(tag). Attachments payload: \(zoneContext.attachments)")
            let attachment = zoneContext.attachments
            self.sendEvent(withName: "onEnterRegion", body: ["tag": tag, "major": attachment["Major"], "minor": attachment["Minor"] ])
        }
        zone.onExit = { zoneContext in
            print("Exited near range of tag \(tag). Attachment payload: \(zoneContext.attachments)")
        }

        return zone
    }

    @objc
    func stopScanning(_ tag: String) {
        print("stopScanning")
        if #available(iOS 13.0, *) {
          self.proximityObserver?.stopObservingZones()
        }
    }
      
  
//    func locationManager(_ manager: CLLocationManager, didRangeBeacons beacons: [CLBeacon], in region: CLBeaconRegion) {
//        for beacon in beacons {
//            var beaconProximity: String;
//            switch (beacon.proximity) {
//            case CLProximity.unknown:    beaconProximity = "Unknown";
//            case CLProximity.far:        beaconProximity = "Far";
//            case CLProximity.near:       beaconProximity = "Near";
//            case CLProximity.immediate:  beaconProximity = "Immediate";
//            }
//            print(beacon)
//            print("BEACON RANGED: uuid: \(beacon.proximityUUID) major: \(beacon.major)  minor: \(beacon.minor) proximity: \(beaconProximity)")
//          self.sendEvent(withName: "onEnterRegion", body: ["uuid": beacon.uuid.uuidString, "major": beacon.major, "minor": beacon.minor, "proximity": beaconProximity ])
//        }
//    }

    // Add other delegate methods if necessary
}
