// TODO: issue from viro: takeScreenshot, cannot run on emulator

import { useState, useRef } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Icon } from "@rneui/base";
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  ViroTrackingReason,
  ViroTrackingStateConstants,
} from "@viro-community/react-viro";
import ViewShot from "react-native-view-shot";
import openai from "../utils/openai";
// import * as FileSystem from "expo-file-system";

const HelloWorldSceneAR = () => {
  const [text, setText] = useState("Initializing AR...");

  function onInitialized(state, reason) {
    console.log("onInitialized", state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText("Hello OBK");
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      // Handle loss of tracking
    }
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={styles.helloWorldTextStyle}
      />
    </ViroARScene>
  );
};

export default () => {
  const sceneNavigator = useRef();
  const viewShotRef = useRef();
  const [captionImage, setCaptionImage] = useState("");
  const [imageCaptureUri, setImageCaptureUri] = useState("");

  async function takeScreenshot() {
    if (sceneNavigator) {
      console.log({ sceneNavigator });
      const result = await sceneNavigator.current._takeScreenshot(
        "screenshot",
        false
      );
      console.log({ result });
      const base64 = await FileSystem.readAsStringAsync(result.url, {
        encoding: "base64",
      });
      const resultAi = await openai({
        text: "What’s in this image?",
        image_url: base64,
      });

      console.log(resultAi);

      if (resultAi?.choices?.length > 0) {
        setCaptionImage(resultAi.choices[0].message.content);
      }
    }

    // viewShotRef.current.capture().then(async (uri) => {
    //   console.log("do something with ", uri);
    //   setImageCaptureUri(uri);
    //   // const base64 = await FileSystem.readAsStringAsync(uri, {
    //   //   encoding: "base64",
    //   // });
    //   // const result = await openai({
    //   //   text: "What’s in this image?",
    //   //   image_url: uri,
    //   // });

    //   // console.log(result);

    //   // if (result?.choices?.length > 0) {
    //   //   setCaptionImage(result.choices[0].message.content);
    //   // }
    // });

    // captureRef(sceneNavigator, {
    //   format: "jpg",
    //   quality: 0.8,
    //   result: "data-uri",
    // }).then(
    //   (uri) => console.log("Image saved to", uri),
    //   (error) => console.error("Oops, snapshot failed", error)
    // );
  }

  return (
    <View
      style={{
        height: 500,
        width: "100%",
      }}
      collapsable={false}
    >
      <ViroARSceneNavigator
        ref={sceneNavigator}
        autofocus={true}
        initialScene={{
          scene: HelloWorldSceneAR,
        }}
        style={styles.f1}
      />

      <View
        style={{
          position: "absolute",
          bottom: 10,
          left: 0,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Image width={100} height={150} source={{ uri: imageCaptureUri }} />
        <Text style={{ color: "white" }}>{captionImage}</Text>
        <Icon
          raised
          name="tips-and-updates"
          title="What is"
          onPress={takeScreenshot}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  f1: { flex: 1, backgroundColor: "white" },
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});

