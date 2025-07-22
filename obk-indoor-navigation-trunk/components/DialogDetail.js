import { View, Text, ScrollView, Image } from "react-native";
import { Icon } from "@rneui/base";

const styles = {
  image: {
    width: 30,
    height: 30,
  },
};

export default function DialogDetail({ data, close }) {
  return (
    data && (
      <View
        style={{
          display: data ? "flex" : "none",
          position: "absolute",
          backgroundColor: "#ffffff",
          borderRadius: 10,
          top: 80,
          left: 0,
          right: 0,
          height: 220,
          margin: 20,
          padding: 20,
          zIndex: 10,
          shadowColor: "#171717",
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}
      >
        <Icon
          name="close"
          color="grey"
          size={30}
          padding={10}
          onPress={() => close()}
          containerStyle={{
            position: "absolute",
            borderRadius: 30,
            top: 10,
            right: 10,
            zIndex: 10,
          }}
        />
        <ScrollView>
          {data.logo && (
            <Image source={{ uri: data.logo }} style={styles.image} />
          )}

          {data.title && <Text style={{ fontSize: 20 }}>{data.title}</Text>}
          {data.content && <Text style={{ fontSize: 20 }}>{data.content}</Text>}
        </ScrollView>
      </View>
    )
  );
}

