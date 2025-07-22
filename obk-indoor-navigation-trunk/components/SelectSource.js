import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { Switch, Icon, ListItem } from "@rneui/themed";
import mapKeyGeojson from "../utils/mapKeyGeojson";

import {
  keySourceState,
  showBorderSourceState,
} from "../state/app_recoil_state";
import { useSetRecoilState, useRecoilState } from "recoil";

const list = Object.keys(mapKeyGeojson);

export default selectSource = () => {
  const setKeySource = useSetRecoilState(keySourceState);
  const [showBorderSource, setShowBorderSource] = useRecoilState(
    showBorderSourceState
  );

  return (
    <View
      style={{
        // margin: 30,
        // backgroundColor: "#ffffff",
        padding: 10,
        flexDirection: "column",
      }}
    >
      <ScrollView style={{ flex: 1, height: "100%" }}>
        <ListItem
          bottomDivider
          containerStyle={{
            paddingHorizontal: 0,
            backgroundColor: "transparent",
          }}
        >
          <ListItem.Content>
            <ListItem.Title>Show Border Source</ListItem.Title>
          </ListItem.Content>
          <Switch
            value={showBorderSource}
            onValueChange={(value) => setShowBorderSource(value)}
          />
        </ListItem>
        {list.map((l) => (
          <TouchableOpacity
            key={l}
            onPress={() => {
              setKeySource(l);
              // setShapeSource(mapKeyGeojson[k].default);
              // setShapeSourceSelected(k);
              // setOpenSelectShape(false);
            }}
            style={{
              width: "100%",
              borderBottomWidth: 1,
              paddingVertical: 20,
              borderColor: "#ddd",
            }}
          >
            <Text>{l}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* <Button
      title="Close"
      style={{}}
      onPress={() => {
        setOpenSelectShape(false);
      }}
    /> */}
    </View>
  );
};

