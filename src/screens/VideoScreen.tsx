import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import YoutubePlayer from "react-native-youtube-iframe";
import { sizes, colors } from "../config";
import * as ScreenOrientation from "expo-screen-orientation";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";

const VideoScreen = ({ route }) => {
  StatusBar.setHidden(true);

  useEffect(() => {
    const changeScreenOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
      );
    };

    changeScreenOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const { videoId } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View style={movieVideo.container}>
      <YoutubePlayer
        webViewProps={{
          renderToHardwareTextureAndroid: true,
        }}
        webViewStyle={movieVideo.iframe}
        height={Dimensions.get("window").height}
        width={1.778 * Dimensions.get("window").height}
        videoId={videoId}
      />
      <TouchableOpacity
        style={movieVideo.backButton}
        onPress={() => navigation.pop()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.light1} />
      </TouchableOpacity>
    </View>
  );
};
const movieVideo = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  iframe: {},
  backButton: {
    position: "absolute",
    backgroundColor: colors.dark1,
    padding: 5,
    borderRadius: 12,
    top: 20,
    left: 10,
  },
});

export default VideoScreen;
