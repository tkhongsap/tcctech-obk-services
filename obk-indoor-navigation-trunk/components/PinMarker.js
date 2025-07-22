import { MarkerView } from "@rnmapbox/maps";
import { Image } from "react-native";
import PinIcon from "../assets/pin.png";

export default PinMarker = ({ coordinate }) => (
  <MarkerView coordinate={coordinate} allowOverlap={true}>
    <Image
      source={PinIcon}
      style={{ width: 28, height: 40, marginBottom: 20 }}
    />
  </MarkerView>
);

