package com.onebangkok;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.os.Build;
import android.util.Log;

import com.estimote.proximity_sdk.api.ProximityObserver;
import com.estimote.proximity_sdk.api.ProximityObserverBuilder;
import com.estimote.proximity_sdk.api.ProximityZone;
import com.estimote.proximity_sdk.api.ProximityZoneBuilder;
import com.estimote.proximity_sdk.api.ProximityZoneContext;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.estimote.proximity_sdk.api.EstimoteCloudCredentials;

import kotlin.Unit;
import kotlin.jvm.functions.Function1;

public class BeaconModule extends ReactContextBaseJavaModule {

    private BluetoothAdapter bluetoothAdapter;
    private BluetoothLeScanner bluetoothLeScanner;
    private boolean scanning = false;

   private ProximityObserver proximityObserver;

   private EstimoteCloudCredentials cloudCredentials = new EstimoteCloudCredentials("onebangkokapp-frasersprope-lcc", "4241ac93ceaa11cab472388b56c1fb7d");

    public BeaconModule(ReactApplicationContext reactContext) {
        super(reactContext);
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            bluetoothLeScanner = bluetoothAdapter.getBluetoothLeScanner();
        }

       proximityObserver = new ProximityObserverBuilder(reactContext, cloudCredentials)
               .onError(new Function1<Throwable, Unit>() {
                   @Override
                   public Unit invoke(Throwable throwable) {
                       Log.e("beacon", "proximity observer error: " + throwable);
                       return null;
                   }
               })
               .withBalancedPowerMode()
               .withTelemetryReportingDisabled()
               .withEstimoteSecureMonitoringDisabled()
               .build();
    }

    @Override
    public String getName() {
        return "BeaconModule";
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    public void startScanning(String tag) {
        Log.d("beacon", "Call start scan");
        if (!scanning) {
            // Start Bluetooth discovery
                scanning = true;
            Log.d("beacon", "tag = " + tag);
           ProximityZone officeZone = new ProximityZoneBuilder()
                       .forTag(tag)
                       .inFarRange()
                       .onEnter(new Function1<ProximityZoneContext, Unit>() {
                           @Override
                           public Unit invoke(ProximityZoneContext it) {
                               Log.d("beacon", "OfficeZone onEnter major: " + it.getAttachments().get("Major") +
                                       ", " + it.getAttachments().get("Minor"));
                               String major = it.getAttachments().get("Major");
                               String minor = it.getAttachments().get("Minor");
                               sendIBeaconDetailsToReactNative(major, minor);
                               return null;
                           }
                       }).onExit(new Function1<ProximityZoneContext, Unit>() {
                           @Override
                           public Unit invoke(ProximityZoneContext context) {
                               Log.d("beacon", "Bye bye, come again!");
                               return null;
                           }
                       })
                       .build();
               proximityObserver.startObserving(officeZone);
                Log.d("beacon", "Scanning started");
            }
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    public void stopScanning(String uuid) {
        if (scanning) {
            // Stop Bluetooth discovery
            if (bluetoothLeScanner != null) {
                scanning = false;
                // bluetoothLeScanner.stopScan(scanCallback);
                Log.d("beacon", "Scanning stopped");
            }
        }
    }

    @SuppressLint({"MissingPermission", "NewApi"})
    private void sendIBeaconDetailsToReactNative(String major, String minor) {
        WritableMap beaconMap = Arguments.createMap();
        beaconMap.putString("major", major);
        beaconMap.putString("minor", minor);

        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onEnterRegion", beaconMap);
    }
}
