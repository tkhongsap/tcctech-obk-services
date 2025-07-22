import { useEffect, useState } from "react";
import { MarkerView } from "@rnmapbox/maps";
import { View, TouchableHighlight } from "react-native";
// import Icon from "../assets/wireless-network-icon.png";
import WIFI_LOCATION_DATA from "../assets/wifi_obk";
import { wifiDataState } from "../state/app_recoil_state";
import { useRecoilValue } from "recoil";

export default WirelessMarker = ({ onSelected = () => {} }) => {
  const [wifiPoints, setWifiPoints] = useState([]);
  const wifiData = useRecoilValue(wifiDataState);

  // Mapping with wifi scan data
  useEffect(() => {
    // console.log({ wifiData });

    if (!wifiData) return;
    // map for show on map
    const mapShowMarker = WIFI_LOCATION_DATA.map((wc) => {
      const findWd = wifiData.find((wd) => wc.bssid.includes(wd.BSSID));
      if (findWd) {
        return { ...wc, ...findWd };
      }
      return wc;
    });

    setWifiPoints(mapShowMarker);
  }, [wifiData]);

  return wifiPoints.map((e, i) => (
    <MarkerView coordinate={e.cod} allowOverlap={true} key={i}>
      <TouchableHighlight
        onPress={() => onSelected(e)}
        underlayColor="grey"
        style={{
          borderRadius: 100,
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            borderRadius: 30,
            width: 15,
            height: 15,
            alignContent: "center",
            justifyContent: "center",
            borderWidth: 3,
            borderColor: e.level
              ? "rgba(231,0,246,0.6)"
              : "rgba(231,0,246,0.3)",
          }}
        ></View>
        {/* <Text style={{ ...styles.text }}>
          ({id}){title}
        </Text>
        <Text style={styles.text}>{level || "-"}</Text>
        <Text style={styles.text}>{coordinate.join(", ")}</Text> */}
        {/* <Image source={Icon} style={styles.image} /> */}
      </TouchableHighlight>
    </MarkerView>
  ));
};

