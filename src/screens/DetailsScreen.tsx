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
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import MovieContext from "../context/MovieContext";
import tmdbApi, {
  fetchImages,
  fetchRecommendedMovies,
  fetchWatchProviders,
  getMovieDetails,
  ImageData,
  Provider,
  MovieDetails,
  Movie,
  Video,
  getVideos,
} from "../api/tmdb"; // Import your API module
import TitleText from "../components/TitleText";
import SimpleCard from "../components/SimpleCard";
import ScreenLoading from "../components/ScreenLoading";
import { colors, sizes, hexTransparencies } from "../config";
import Gallery from "react-native-awesome-gallery";
import YoutubePlayer from "react-native-youtube-iframe";

const DetailsScreen = ({ route }) => {
  const {
    addToWillWatchList,
    addToWatchedList,
    removeFromWillWatchList,
    removeFromWatchedList,
  } = useContext(MovieContext);

  interface ProcessedProviders {
    buyOrRent: Provider[];
    streamingOn: Provider[];
  }

  const { id } = route.params;
  const { state } = useContext(MovieContext);

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[] | null>(
    null
  );

  const [videos, setVideos] = useState<Video[] | null>(null);
  const [images, setImages] = useState<ImageData[] | null>(null);
  const [gallery, setGallery] = useState<boolean>(false);
  const [watchProviders, setWatchProviders] =
    useState<ProcessedProviders | null>(null);

  const isOnWillWatchList = state.willWatchList.includes(id);
  const isOnWatchedList = state.watchedList.includes(id);

  const processWatchProviders = (providersData, countryCode = "US") => {
    let providers = {
      buyOrRent: [],
      streamingOn: [],
    };

    // Example for getting global providers or a specific country (e.g., 'US')
    const countryProviders =
      providersData[countryCode] || providersData["GB"] || [];

    // Combine providers from different categories with priority: flatrate, buy, rent
    const buyOrRent = [
      ...(countryProviders.buy || []),
      ...(countryProviders.rent || []),
    ];

    const streamingOn = [...(countryProviders.flatrate || [])];

    // Filtering out duplicates
    buyOrRent.forEach((provider) => {
      if (
        !providers.buyOrRent.find((p) => p.provider_id === provider.provider_id)
      ) {
        providers.buyOrRent.push(provider);
      }
    });

    streamingOn.forEach((provider) => {
      providers.streamingOn.push(provider);
    });

    return providers;
  };

  // Fetch all the movie details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          movieDetailsData,
          recommendedMoviesData,
          imagesData,
          watchProvidersData,
          videosData,
        ] = await Promise.all([
          getMovieDetails(id),
          fetchRecommendedMovies(id),
          fetchImages(id),
          fetchWatchProviders(id),
          getVideos(id),
        ]);

        setMovieDetails(movieDetailsData);
        setRecommendedMovies(recommendedMoviesData);
        setImages(imagesData);
        setVideos(videosData);

        if (watchProvidersData) {
          const processedProviders: ProcessedProviders =
            await processWatchProviders(watchProvidersData, "TR");
          setWatchProviders(processedProviders);
        }
      } catch (error) {
        console.error("Error fetching data for the movie: ", error);
      }
    };

    fetchData();
  }, [id]);

  if (!movieDetails) {
    // Display a loading indicator or handle loading state
    return (
      <View style={loading.container}>
        <ScreenLoading message="Movie details are loading..." />
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
    genres,
  } = movieDetails;

  // Set image
  const baseImageUrl = "https://image.tmdb.org/t/p/";
  const posterSize = "w500"; // Choose the appropriate size
  let image = poster_path
    ? `${baseImageUrl}${posterSize}/${poster_path}`
    : null;

  // * Components Part

  interface GenreTagProps {
    genreName: string;
  }

  const GenreTag = ({ genreName }: GenreTagProps) => {
    return (
      <View style={genreSection.tag}>
        <FontAwesome name="hashtag" size={12} color={colors.light3} />
        <Text style={genreSection.tagText}>{genreName}</Text>
      </View>
    );
  };

  const GenreTags = () => {
    if (genres.length > 1) {
      return (
        <View style={genreSection.viewContainer}>
          <FlatList
            data={genres}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const namePrimitive: string = item.name.toString();
              return (
                <View style={{ flexDirection: "row" }}>
                  <GenreTag key={index} genreName={namePrimitive} />

                  {index !== genres.length - 1 && (
                    <View style={{ margin: 3 }} />
                  )}
                </View>
              );
            }}
          />
        </View>
      );
    }
  };

  // Bottom section, the buttons
  const BottomSection = () => {
    // Will Watch button, heart
    const WillWatchButton = ({ add, remove }) => {
      type IconName = "bookmark" | "bookmark-o";

      const [icon, setIcon] = useState<IconName>(
        isOnWillWatchList ? "bookmark" : "bookmark-o"
      );

      const addOrRemove = () => {
        if (isOnWillWatchList) {
          setIcon("bookmark-o");
          remove();
        } else {
          setIcon("bookmark");
          add();
        }
      };

      return (
        <TouchableOpacity style={bottomSection.willWatch} onPress={addOrRemove}>
          <FontAwesome name={icon} size={28} color={colors.yellow} />
          <Text style={bottomSection.watchedText}>Save</Text>
        </TouchableOpacity>
      );
    };

    // Watched button, star
    const WatchedButton = ({ add, remove }) => {
      type IconName = "heart" | "heart-o";
      const [icon, setIcon] = useState<IconName>(
        isOnWatchedList ? "heart" : "heart-o"
      );

      const addOrRemove = () => {
        if (isOnWatchedList) {
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

  // Film overview, the first component
  const FilmOverview = () => {
    const icons = [
      <View style={filmOverview.iconContainer} key="star">
        <FontAwesome name="star-half-full" size={24} color={colors.yellow} />
        <Text style={filmOverview.iconText}>{vote_average.toFixed(1)}/10</Text>
      </View>,
      <View style={filmOverview.iconContainer} key="user">
        <FontAwesome name="user" size={24} color={colors.cyan} />
        <Text style={filmOverview.iconText}>{vote_count} votes</Text>
      </View>,
    ];

    return (
      <View style={filmOverview.container}>
        {poster_path != null && (
          <Image style={filmOverview.image} source={{ uri: image }} />
        )}
        <Text style={filmOverview.title}>{title}</Text>
        <View style={filmOverview.yearAndGenres}>
          {release_date != "" && (
            <Text style={filmOverview.releaseDate}>
              {release_date.match(/^(\d{4})/g)}
            </Text>
          )}
          {genres.length > 0 && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome
                style={{ marginHorizontal: 8 }}
                name="circle"
                size={5}
                color={colors.light3}
              />
              <Text style={filmOverview.genres}>{genres[0].name}</Text>
            </View>
          )}
        </View>
        <Text style={filmOverview.desc}>{overview}</Text>
        <View style={filmOverview.iconsContainer}>{icons}</View>
        <View style={filmOverview.bottomSectionContainer}>
          <GenreTags />
          <BottomSection />
        </View>
      </View>
    );
  };

  const Platforms = () => {
    // Check if both buyOrRent and streamingOn lists are empty
    const noProvidersAvailable =
      watchProviders &&
      watchProviders.buyOrRent.length === 0 &&
      watchProviders.streamingOn.length === 0;

    if (noProvidersAvailable) {
      return (
        <View style={platforms.notFoundContainer}>
          <MaterialCommunityIcons
            name="movie-open-off-outline"
            size={24}
            color={`${colors.light3}${hexTransparencies[80]}`}
          />
          <Text style={platforms.notFoundText}>
            No watch provider available for now...
          </Text>
        </View>
      );
    }

    return (
      <View>
        <View style={platforms.titles}>
          <TitleText text="Available on" style={platforms.title} />
          <Text style={platforms.poweredByJustwatch}>Powered by JustWatch</Text>
        </View>
        <ScrollView
          contentContainerStyle={platforms.contentContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={platforms.container}
        >
          {watchProviders?.streamingOn.map((provider) => (
            <View key={provider.provider_id} style={platforms.item}>
              <Image
                style={platforms.image}
                source={{
                  uri: `https://image.tmdb.org/t/p/original${provider.logo_path}`,
                }}
              />
              <Text style={platforms.provider_name}>
                {provider.provider_name}
              </Text>
            </View>
          ))}

          {watchProviders?.buyOrRent.map((provider, index) => (
            <View style={{ flexDirection: "row" }} key={provider.provider_id}>
              {watchProviders.streamingOn.length > 0 && index === 0 && (
                <View
                  style={{
                    backgroundColor: colors.light3,
                    width: 1,
                    marginVertical: 10,
                    marginRight: 10,
                    marginLeft: 5,
                    bottom: 5,
                  }}
                />
              )}
              <View style={platforms.item}>
                <Image
                  style={platforms.image}
                  source={{
                    uri: `https://image.tmdb.org/t/p/original${provider.logo_path}`,
                  }}
                />
                <Text style={platforms.provider_name}>
                  {provider.provider_name}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const MovieVideo = () => {
    if (videos !== null && videos.length > 0) {
      const latestTrailer = videos.reduce((latest, video) => {
        if (video.site === "YouTube" && video.type === "Trailer") {
          const videoDate = new Date(video.published_at).getTime();
          if (!latest || videoDate > new Date(latest.published_at).getTime()) {
            return video;
          }
        }
        return latest;
      }, null);

      if (latestTrailer) {
        return (
          <View>
            <TitleText style={movieVideo.title} text="Trailer" />
            <View style={movieVideo.container}>
              <YoutubePlayer
                webViewStyle={movieVideo.iframe}
                height={190}
                videoId={latestTrailer.key}
              />
            </View>
          </View>
        );
      }
    }

    return null;
  };

  const MovieImages = () => {
    if (images !== null && images.length > 0) {
      return (
        <View>
          <TitleText style={movieImages.title} text="Images" />
          <View style={movieImages.flatlistWrapper}>
            <FlatList
              data={images}
              keyExtractor={(item) => item.file_path.toString()}
              horizontal
              contentContainerStyle={movieImages.flatlistContainer}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={movieImages.imageContainer}
                    onPress={() => setGallery(true)}
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
        </View>
      );
    }
  };

  const Recommended = () => {
    if (recommendedMovies != null && recommendedMovies.length > 0) {
      return (
        <View>
          <TitleText style={recommended.title} text="Recommended" />
          <View style={recommended.flatlistContainer}>
            <FlatList
              data={recommendedMovies}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <SimpleCard key={index} id={item.id} />
              )}
            />
          </View>
        </View>
      );
    }
  };

  const components = [<FilmOverview />, <Platforms />, <MovieVideo />];

  const otherComponents = [<MovieImages />, <Recommended />];

  return (
    <ScrollView style={{ backgroundColor: colors.dark1, flex: 1 }}>
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
    borderColor: `${colors.light3}${hexTransparencies[80]}`,
  },
  imageContainer: {
    borderRadius: sizes.radius,
    overflow: "hidden",
  },
  title: {
    marginBottom: 15,
    marginHorizontal: 15,
  },
  flatlistWrapper: {
    borderRadius: sizes.radius,
    overflow: "hidden",
    marginHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: colors.dark0,
  },
  flatlistContainer: {
    overflow: "hidden",
    marginLeft: 15,
    paddingRight: 14,
  },
});

const movieVideo = StyleSheet.create({
  title: {
    marginBottom: 15,
  },
  container: {
    borderRadius: sizes.radius,
    borderWidth: 1,
    borderColor: colors.dark2,
    backgroundColor: "black",
    overflow: "hidden",
  },
  iframe: {
    // ! Never delete this, check the related issue: https://github.com/LonelyCpp/react-native-youtube-iframe/issues/110
    opacity: 0.99,
  },
});

const platforms = StyleSheet.create({
  title: {},
  poweredByJustwatch: {
    fontSize: 10,
    color: colors.light3,
    marginTop: -3,
    marginBottom: 15,
  },
  titles: {},
  container: {
    backgroundColor: colors.dark0,
    paddingVertical: 15,
    borderRadius: sizes.radiusBig,
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  provider_name: {
    fontSize: 10,
    color: colors.light1,
    textAlign: "center",
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: sizes.radius,
  },
  item: {
    marginRight: 5,
    alignItems: "center",
    width: 66,
  },
  notFoundContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${colors.dark0}${hexTransparencies[80]}`,
    paddingVertical: 20,
    borderRadius: sizes.radius,
    paddingHorizontal: 100,
  },
  notFoundText: {
    color: `${colors.light1}${hexTransparencies[80]}`,
    marginLeft: 15,
  },
});

const recommended = StyleSheet.create({
  title: {
    marginBottom: 15,
    marginHorizontal: 15,
  },
  flatlistContainer: {
    overflow: "hidden",
    borderTopLeftRadius: sizes.radius,
    borderBottomLeftRadius: sizes.radius,
    marginLeft: 15,
  },
});

const genreSection = StyleSheet.create({
  tag: {
    padding: 8,
    backgroundColor: colors.dark1,
    borderRadius: sizes.radius,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tagText: {
    fontSize: 12,
    color: colors.light1,
    marginLeft: 3,
  },
  viewContainer: {
    marginBottom: 14,
    alignItems: "center",
  },
});

const filmOverview = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: colors.dark0,
    borderRadius: sizes.radiusBig,
  },
  yearAndGenres: {
    flexDirection: "row",
  },
  genres: {
    fontSize: 16,
    color: colors.light3,
    fontWeight: "500",
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
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    color: colors.light1,
    marginLeft: 8,
  },
});

export default DetailsScreen;
