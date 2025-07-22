import obk_outdoor_geojson from "../assets/obk_outdoor.json";
import b1_2_geojson from "../assets/b1_2.json";
import b1_2_border_geojson from "../assets/b1_2_border.json";
import O2_L1_geojson from "../assets/O2_L1.json";
import O2_L1_Border_geojson from "../assets/O2_L1_Border.json";

export default mapKeyGeojson = {
  b1_2: {
    default: b1_2_geojson,
    border: b1_2_border_geojson,
  },
  O2_L1: {
    default: O2_L1_geojson,
    border: O2_L1_Border_geojson,
  },
  obk_outdoor: {
    default: obk_outdoor_geojson,
  },
};

