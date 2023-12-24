import React, { useContext, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import "../config";
import SimpleCard from "../components/SimpleCard";
import tmdbApi from "../api/tmdb";
import TitleText from "../components/TitleText";
import MovieContext from "../context/MovieContext";
import DetailedCard from "../components/DetailedCard";
import { CollapsibleHeaderScrollView } from "react-native-collapsible-header-views";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/core";
import { Entypo } from "@expo/vector-icons";
import CustomSafeAreaView from "../components/CustomSafeAreaView";

const { colors, sizes } = global.config.style;

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const { addToWillWatchList, addToWatchedList } = useContext(MovieContext);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await tmdbApi.get("discover/movie", {
          params: {
            sort_by: "popularity.desc",
          },
        });
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <View>
      <View style={{ marginHorizontal: 15, marginBottom: 15 }}>
        <TitleText text="Popular Movies" />
      </View>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={popularMovies.flatlistContainer}
        renderItem={({ item, key }) => (
          <SimpleCard
            key={key}
            id={item.id}
            title={item.title}
            image={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
          />
        )}
      />
    </View>
  );
};

const ShowMore = ({ list, navigateTo }) => {
  const navigation = useNavigation();

  if (list.length > 3) {
    return (
      <TouchableOpacity
        style={showMore.container}
        onPress={() => navigation.navigate(navigateTo)}
      >
        <Entypo name="dots-three-horizontal" size={24} color={colors.light2} />
      </TouchableOpacity>
    );
  }
};

const WillWatch = ({ willWatchList }) => {
  const [willWatchMovies, setWillWatchMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const moviesData = await Promise.all(
        willWatchList.map(async (movieId) => {
          try {
            const response = await tmdbApi.get(`movie/${movieId}`);
            return response.data;
          } catch (error) {
            console.error("Error fetching movie details:", error);
            return null;
          }
        })
      );

      setWillWatchMovies(moviesData.filter(Boolean));
    };

    fetchMovies();
  }, [willWatchList]);

  return (
    <View>
      <TitleText style={willWatch.title} text="Will Watch" />
      {willWatchMovies
        .reverse()
        .slice(0, 3)
        .map((item, index) => (
          <React.Fragment key={index}>
            <DetailedCard
              id={item.id}
              desc={item.overview}
              title={item.title}
              voteAverage={item.vote_average}
              image={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
            />

            {index !== willWatchMovies.length - 1 && (
              <View style={{ margin: 6 }} />
            )}
          </React.Fragment>
        ))}
      <ShowMore list={willWatchMovies} navigateTo={"Profile"} />
    </View>
  );
};

const Watched = ({ watchedList }) => {
  const [watchedMovies, setWatchedMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const moviesData = await Promise.all(
        watchedList.map(async (movieId) => {
          try {
            const response = await tmdbApi.get(`movie/${movieId}`);
            return response.data;
          } catch (error) {
            console.error("Error fetching movie details:", error);
            return null;
          }
        })
      );

      setWatchedMovies(moviesData.filter(Boolean));
    };

    fetchMovies();
  }, [watchedList]);

  return (
    <View>
      <TitleText style={watched.title} text="Watched" />
      {watchedMovies
        .reverse()
        .slice(0, 3)
        .map((item, index) => (
          <React.Fragment key={index}>
            <DetailedCard
              id={item.id}
              desc={item.overview}
              title={item.title}
              voteAverage={item.vote_average}
              image={`https://image.tmdb.org/t/p/w154/${item.poster_path}`}
            />

            {index !== watchedMovies.length - 1 && (
              <View style={{ margin: 6 }} />
            )}
          </React.Fragment>
        ))}
      <ShowMore list={watchedMovies} navigateTo={"Profile"} />
    </View>
  );
};

// PopularMovies are not included because of a styling difference

const HomeScreen = () => {
  const { state } = useContext(MovieContext);
  const components = [
    <WillWatch willWatchList={state.willWatchList} />,
    <Watched watchedList={state.watchedList} />,
  ];

  return (
    <CustomSafeAreaView>
      <CollapsibleHeaderScrollView
        CollapsibleHeaderComponent={
          <Header title="Filmer" searchButton={true} />
        }
        headerHeight={60}
        showsVerticalScrollIndicator={false}
        statusBarHeight={Platform.OS === "ios" ? 20 : 0}
        headerContainerBackgroundColor={colors.dark1}
        style={screen.container}
      >
        <PopularMovies />
        <View style={screen.otherSections}>
          {components.map((item, key) => {
            return (
              <View key={key} style={{ marginBottom: 15 }}>
                {item}
              </View>
            );
          })}
        </View>
        <View style={{ marginBottom: sizes.tabbarSpace }} />
      </CollapsibleHeaderScrollView>
    </CustomSafeAreaView>
  );
};

const screen = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark1,
  },
  otherSections: {
    marginHorizontal: 15,
    marginTop: 16,
  },
});

const popularMovies = StyleSheet.create({
  flatlistContainer: {
    paddingLeft: 15,
  },
});

const willWatch = StyleSheet.create({
  title: {
    marginBottom: 10,
  },
});

const watched = StyleSheet.create({
  title: {
    marginBottom: 10,
  },
});

const listStyles = StyleSheet.create({
  flatlistContainer: {
    paddingLeft: 15,
  },
});

const showMore = StyleSheet.create({
  container: {
    backgroundColor: colors.dark0,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: sizes.radius,
  },
});

export default HomeScreen;
