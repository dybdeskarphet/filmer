import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import TextTicker from "react-native-text-ticker";

const { colors, sizes } = global.config.style;

const SimpleCard = ({ id, image, title }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.push("Details", {
          id,
        })
      }
    >
      <Image style={styles.image} source={{ uri: image }} />
      <LinearGradient
        style={styles.titleGradient}
        colors={["#00000000", "#000000"]}
      >
        <View style={styles.titleContainer}>
          <TextTicker
            duration={6000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={2500}
            style={styles.title}
          >
            {title}
          </TextTicker>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    borderRadius: sizes.radius,
    width: 170,
    height: 250,
    marginRight: 20,
    overflow: "hidden",
    backgroundColor: colors.dark1,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: sizes.radius,
  },
  titleGradient: {
    position: "absolute",
    width: "100%",
    height: 65,
    bottom: -1,
  },
  titleContainer: {
    width: 150,
    marginHorizontal: 10,
    position: "absolute",
    bottom: 12,
  },
  title: {
    color: colors.light1,
    fontSize: 20,
    fontWeight: "300",
  },
});

export default SimpleCard;
