import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import TextTicker from "react-native-text-ticker";
import { useNavigation } from "@react-navigation/native";

const { colors, sizes } = global.config.style;

const DetailedCard = ({ id, image, title, desc, voteAverage }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("Details", { id })}
    >
      {image != "https://image.tmdb.org/t/p/w500/null" && (
        <Image style={styles.image} source={{ uri: image }} />
      )}
      <View style={styles.textContainer}>
        <View style={styles.titleContainer}>
          <View style={{ flex: 1 }}>
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
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{voteAverage.toFixed(1)}/10</Text>
            <FontAwesome name="star" size={22} color={colors.yellow} />
          </View>
        </View>
        <Text numberOfLines={4} style={styles.desc}>
          {desc}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DetailedCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    width: "100%",
    backgroundColor: colors.dark0,
    borderRadius: sizes.radiusBig,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    marginLeft: 9,
  },
  ratingText: {
    color: colors.light1,
    marginRight: 8,
  },
  title: {
    color: colors.light1,
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
  },
  desc: {
    color: colors.light1,
  },
  image: {
    height: 120,
    width: 80,
    borderRadius: sizes.radius,
  },
});
