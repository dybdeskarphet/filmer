import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import TextTicker from "react-native-text-ticker";
import { getMovieDetails, MovieDetails } from "../api/tmdb";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { colors, sizes } from "../config";

interface SimpleCardProps {
  id: number;
}

const SimpleCard = ({ id }: SimpleCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [filmDetails, setFilmDetails] = useState<MovieDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.push("Details", {
          id,
        })
      }
    >
      <Image
        style={styles.image}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${filmDetails?.poster_path}`,
        }}
      />
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
            {filmDetails?.title || ""}
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
