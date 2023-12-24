import React, { useContext, useEffect, useState, useRef } from "react";
import {
  TouchableOpacity,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MovieContext from "../context/MovieContext";
import tmdbApi from "../api/tmdb"; // Import your API module
import CustomSafeAreaView from "../components/CustomSafeAreaView";

const { colors, sizes } = global.config.style;

const DetailsScreen = ({ route }) => {
  const {
    addToWillWatchList,
    addToWatchedList,
    removeFromWillWatchList,
    removeFromWatchedList,
  } = useContext(MovieContext);

  const [movieDetails, setMovieDetails] = useState(null);
  const isInitialLoad = useRef(true);

  const { id } = route.params;

  const { state } = useContext(MovieContext);
  const isOnWillWatchList = state.willWatchList.includes(id);
  const isOnWatchedList = state.watchedList.includes(id);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await tmdbApi.get(`movie/${id}`);
        setMovieDetails(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, []);

  if (!movieDetails) {
    // Display a loading indicator or handle loading state
    return (
      <View style={loading.container}>
        <Text> Loading...</Text>
      </View>
    );
  }

  const {
    poster_path: posterPath,
    title,
    overview,
    release_date: releaseDate,
    original_language: language,
    popularity,
    vote_count: votes,
    vote_average: voteAverage,
  } = movieDetails;

  const baseImageUrl = "https://image.tmdb.org/t/p/";

  const posterSize = "w500"; // Choose the appropriate size

  const image = posterPath
    ? `${baseImageUrl}${posterSize}/${posterPath}`
    : null;

  const icons = [
    <View style={filmOverview.icon.container} key="star">
      <FontAwesome name="star" size={24} color={colors.yellow} />
      <Text style={filmOverview.icon.text}>{voteAverage.toFixed(1)}/10</Text>
    </View>,
    <View style={filmOverview.icon.container} key="user">
      <FontAwesome name="user" size={24} color={colors.cyan} />
      <Text style={filmOverview.icon.text}>{votes} votes</Text>
    </View>,
  ];

  const FilmOverview = () => {
    return (
      <View style={filmOverview.container}>
        {posterPath != null && (
          <Image style={filmOverview.image} source={{ uri: image }} />
        )}
        <Text style={filmOverview.title}>{title}</Text>
        {releaseDate != "" && (
          <Text style={filmOverview.releaseDate}>
            {releaseDate.match(/^(\d{4})/g)}
          </Text>
        )}
        <Text style={filmOverview.desc}>{overview}</Text>
        <View style={filmOverview.iconsContainer}>{icons}</View>
      </View>
    );
  };

  const WillWatchButton = ({ add, remove }) => {
    const [icon, setIcon] = useState(isOnWillWatchList ? "heart" : "heart-o");

    const addOrRemove = () => {
      if (isOnWillWatchList) {
        setIcon("heart-o");
        remove();
      } else {
        setIcon("heart");
        add();
      }
    };

    return (
      <TouchableOpacity
        style={bottomSection.watchedButton}
        onPress={addOrRemove}
      >
        <FontAwesome name={icon} size={28} color={colors.red} />
        <Text style={bottomSection.watchedText}>Save</Text>
      </TouchableOpacity>
    );
  };

  const WatchedButton = ({ add, remove }) => {
    const [icon, setIcon] = useState(isOnWatchedList ? "star" : "star-o");

    const addOrRemove = () => {
      if (isOnWatchedList) {
        setIcon("star-o");
        remove();
      } else {
        setIcon("star");
        add();
      }
    };

    return (
      <TouchableOpacity
        style={bottomSection.watchedButton}
        onPress={addOrRemove}
      >
        <FontAwesome name={icon} size={28} color={colors.yellow} />
        <Text style={bottomSection.watchedText}>Watched</Text>
      </TouchableOpacity>
    );
  };

  const BottomSection = () => {
    return (
      <View style={bottomSection.container}>
        <WillWatchButton
          add={() => addToWillWatchList(id)}
          remove={() => removeFromWillWatchList(id)}
        />
        <View style={{ marginHorizontal: 5 }} />
        <WatchedButton
          add={() => addToWatchedList(id)}
          remove={() => removeFromWatchedList(id)}
        />
      </View>
    );
  };

  const components = [<FilmOverview key="filmOverview" />, <BottomSection />];

  return (
    <CustomSafeAreaView>
      <ScrollView style={screen.container}>
        {components.map((item, key) => (
          <View style={{ marginBottom: 15 }} key={key}>
            {item}
          </View>
        ))}
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const screen = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: colors.dark1,
  },
});

const bottomSection = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  willWatch: {
    backgroundColor: colors.dark2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 20,
    borderRadius: sizes.radius,
  },
  watchedButton: {
    backgroundColor: colors.dark2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 20,
    borderRadius: sizes.radius,
  },
  watchedText: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 10,
    color: colors.light1,
  },
  willWatchText: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 10,
    color: colors.light1,
  },
});

const loading = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark1,
  },
});

const filmOverview = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: colors.dark2,
    borderRadius: sizes.radiusBig,
  },
  image: {
    height: 450,
    borderRadius: sizes.radiusBig,
  },
  title: {
    fontSize: 24,
    color: colors.light1,
    fontWeight: "500",
    marginTop: 10,
  },
  releaseDate: {
    fontSize: 16,
    color: colors.light3,
    fontWeight: "500",
  },
  desc: {
    fontSize: 16,
    color: colors.light1,
    marginTop: 10,
  },
  iconsContainer: {
    marginTop: 15,
    marginHorizontal: 15,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  icon: {
    container: {
      flexDirection: "row",
      alignItems: "center",
    },
    text: {
      color: colors.light1,
      marginLeft: 8,
    },
  },
});

export default DetailsScreen;
