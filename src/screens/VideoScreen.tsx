import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import YoutubePlayer from "react-native-youtube-iframe";
import { sizes, colors } from "../config";
import * as ScreenOrientation from "expo-screen-orientation";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import ErrorBoundary from "../ErrorBoundary";

const VideoScreen = ({ route }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [videoWidth, setVideoWidth] = useState(
    1.778 * Dimensions.get("window").height
  );
  const [videoHeight, setVideoHeight] = useState(
    Dimensions.get("window").height
  );

  useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );

        StatusBar.setHidden(true);
        console.log("VideoScreen is focused, orientation locked.");
      } catch (error) {
        console.error("Error locking orientation:", error);
      }
    };

    lockOrientation();

    return () => {
      console.log("VideoScreen is unfocused, unlocking orientation.");
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      StatusBar.setHidden(false);
    };
  }, []);

  const { videoId } = route.params;

  return (
    <View style={styles.container}>
      <YoutubePlayer
        webViewProps={{
          renderToHardwareTextureAndroid: true,
        }}
        webViewStyle={styles.iframe}
        height={videoHeight}
        width={videoWidth}
        onReady={() => {
          setVideoWidth(1.778 * Dimensions.get("window").height);
          setVideoHeight(Dimensions.get("window").height);
        }}
        videoId={videoId}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.pop()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.light1} />
      </TouchableOpacity>
    </View>
  );
};

const VideoScreenWithBoundary = ({ route }) => {
  return (
    <ErrorBoundary>
      <VideoScreen route={route} />
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
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

export default VideoScreenWithBoundary;
