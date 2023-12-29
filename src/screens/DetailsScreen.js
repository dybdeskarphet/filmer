import React, { useContext, useEffect, useState, useRef } from "react";
import {
  TouchableOpacity,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MovieContext from "../context/MovieContext";
import tmdbApi from "../api/tmdb"; // Import your API module
import CustomSafeAreaView from "../components/CustomSafeAreaView";
import TitleText from "../components/TitleText";
import SimpleCard from "../components/SimpleCard";

const { colors, sizes } = global.config.style;

const DetailsScreen = ({ route }) => {
  const {
    addToWillWatchList,
    addToWatchedList,
    removeFromWillWatchList,
    removeFromWatchedList,
  } = useContext(MovieContext);

  const { id } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState(null);
  const [images, setImages] = useState(null);
  const [imageViewVisible, setImageViewVisible] = useState(false);
  const { state } = useContext(MovieContext);
  const isOnWillWatchList = state.willWatchList.includes(id);
  const isOnWatchedList = state.watchedList.includes(id);

  // Fetch the movie details for the FilmOverview component
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

  // Fetch the recommended movies according to the selected movie
  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      try {
        const response = await tmdbApi.get(`movie/${id}/recommendations`);
        if (response.data.results != null) {
          setRecommendedMovies(response.data.results);
        }
      } catch (error) {
        console.error("Error fetching recommended movies:", error);
      }
    };

    fetchRecommendedMovies();
  }, []);

  // Fetch images of the movie
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await tmdbApi.get(`movie/${id}/images`);
        if (response.data.backdrops != null) {
          setImages(response.data.backdrops);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
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
    poster_path,
    title,
    overview,
    release_date,
    original_language,
    popularity,
    vote_count,
    vote_average,
  } = movieDetails;

  // Set image
  const baseImageUrl = "https://image.tmdb.org/t/p/";
  const posterSize = "w500"; // Choose the appropriate size
  let image = poster_path
    ? `${baseImageUrl}${posterSize}/${poster_path}`
    : null;

  // Film overview, the first component
  const FilmOverview = () => {
    const icons = [
      <View style={filmOverview.icon.container} key="star">
        <FontAwesome name="star" size={24} color={colors.yellow} />
        <Text style={filmOverview.icon.text}>{vote_average.toFixed(1)}/10</Text>
      </View>,
      <View style={filmOverview.icon.container} key="user">
        <FontAwesome name="user" size={24} color={colors.cyan} />
        <Text style={filmOverview.icon.text}>{vote_count} votes</Text>
      </View>,
    ];

    return (
      <View style={filmOverview.container}>
        {poster_path != null && (
          <Image style={filmOverview.image} source={{ uri: image }} />
        )}
        <Text style={filmOverview.title}>{title}</Text>
        {release_date != "" && (
          <Text style={filmOverview.releaseDate}>
            {release_date.match(/^(\d{4})/g)}
          </Text>
        )}
        <Text style={filmOverview.desc}>{overview}</Text>
        <View style={filmOverview.iconsContainer}>{icons}</View>
        <View style={filmOverview.bottomSectionContainer}>
          <BottomSection />
        </View>
      </View>
    );
  };

  // Bottom section, the buttons
  const BottomSection = () => {
    // Will Watch button, heart
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
        <TouchableOpacity style={bottomSection.willWatch} onPress={addOrRemove}>
          <FontAwesome name={icon} size={28} color={colors.red} />
          <Text style={bottomSection.watchedText}>Save</Text>
        </TouchableOpacity>
      );
    };

    // Watched button, star
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

  const MovieImages = () => {
    let imageViewList = [
      "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
    ];

    return (
      <View>
        <View style={{ marginBottom: 15, marginHorizontal: 15 }}>
          <TitleText text="Images" />
        </View>
        <FlatList
          data={images}
          keyExtractor={(item) => item.file_path.toString()}
          horizontal
          contentContainerStyle={{ paddingHorizontal: 15 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, key }) => {
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setImageViewVisible(true)}
              >
                <Image
                  style={movieImages.image}
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${item.file_path}`,
                  }}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  const Recommended = () => {
    if (recommendedMovies != null && recommendedMovies.length > 0) {
      return (
        <View>
          <View style={{ marginBottom: 15, marginHorizontal: 15 }}>
            <TitleText text="Recommended" />
          </View>
          <FlatList
            data={recommendedMovies}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            contentContainerStyle={{ paddingHorizontal: 15 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, key }) => (
              <SimpleCard
                key={key}
                id={item.id}
                title={item.title}
                image={`https://image.tmdb.org/t/p/w500/${
                  item.poster_path || item.backdrop_path
                }`}
              />
            )}
          />
        </View>
      );
    }
  };

  const components = [<FilmOverview />];

  const otherComponents = [<MovieImages />, <Recommended />];

  return (
    <CustomSafeAreaView>
      <ScrollView>
        <View style={screen.container}>
          {components.map((item, key) => (
            <View style={{ marginBottom: 15 }} key={key}>
              {item}
            </View>
          ))}
        </View>
        <View style={screen.otherContainer}>
          {otherComponents.map((item, key) => (
            <View style={{ marginBottom: 15 }} key={key}>
              {item}
            </View>
          ))}
        </View>
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
  otherContainer: {
    flex: 1,
    backgroundColor: colors.dark1,
  },
});

const bottomSection = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  willWatch: {
    backgroundColor: colors.dark1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 20,
    borderRadius: sizes.radius,
  },
  watchedButton: {
    backgroundColor: colors.dark1,
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

const movieImages = StyleSheet.create({
  image: {
    width: 355,
    height: 200,
    borderRadius: sizes.radius,
    marginRight: 20,
    borderWidth: 1,
    borderColor: `${colors.light3}cc`,
  },
});

const filmOverview = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: colors.dark0,
    borderRadius: sizes.radiusBig,
  },
  bottomSectionContainer: {
    marginTop: 15,
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
