import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import TextTicker from "react-native-text-ticker";
import { useNavigation } from "@react-navigation/native";
import { getMovieDetails, MovieDetails } from "../api/tmdb";
import { Shadow } from "react-native-shadow-2";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";

const { colors, sizes } = global.config.style;

interface DetailedCardProps {
  id: number;
}

const DetailedCard = ({ id }: DetailedCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [filmDetails, setFilmDetails] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilmDetails = async () => {
      try {
        const data = await getMovieDetails(id);
        setFilmDetails(data);
      } catch (error) {
        setError("Failed to fetch film details.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilmDetails();
  }, [id]);

  if (isLoading) {
    return (
      <View style={[styles.container, { height: 200 }]}>
        <ActivityIndicator size="large" color={colors.light1} />
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <Shadow>
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigation.navigate("Details", { id })}
      >
        {filmDetails && filmDetails.poster_path && (
          <Image
            style={styles.image}
            source={{
              uri: `https://image.tmdb.org/t/p/w500${filmDetails.poster_path}`,
            }}
          />
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
                {filmDetails?.title || ""}
              </TextTicker>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>
                {filmDetails ? filmDetails.vote_average?.toFixed(1) : "0.0"}/10
              </Text>
              <FontAwesome
                name="star-half-full"
                size={22}
                color={colors.yellow}
              />
            </View>
          </View>
          <Text numberOfLines={4} style={styles.desc}>
            {filmDetails?.overview || ""}
          </Text>
        </View>
      </TouchableOpacity>
    </Shadow>
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
    borderWidth: 1,
    borderColor: colors.dark2,
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
