import { View, StyleSheet, Platform, Text, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { CollapsibleHeaderScrollView } from "react-native-collapsible-header-views";
import Header from "../../components/Header";
import { SimpleGrid } from "react-native-super-grid";
import BigButton from "../../components/BigButton";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, sizes, hexTransparencies, genres } from "../../config";
import TitleText from "src/components/TitleText";
import {
  Movie,
  fetchPopularMoviesByGenre,
  getMovieDetails,
} from "src/api/tmdb";
import MovieContext from "src/context/MovieContext";
import { useFocusEffect } from "@react-navigation/native";
import SimpleCard from "src/components/SimpleCard";

interface ButtonData {
  title: string;
  nav: string;
  icon: JSX.Element;
}

const DiscoverScreen = () => {
  const { state } = useContext(MovieContext);
  const watchedMovies = state.watchedList;
  const [genreList, setGenreList] = useState([]);

  console.log(watchedMovies);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieDetailsPromises = watchedMovies.map((movie) =>
          getMovieDetails(movie)
        );
        const movieDetails = await Promise.all(movieDetailsPromises);

        const genres = movieDetails.flatMap((movie) => movie.genres);
        const filteredGenres = genres
          .filter((genre) => genre.hasOwnProperty("id"))
          .map((genre) => genre.id);

        const counts = {};
        filteredGenres.forEach((item) => {
          counts[item] = (counts[item] || 0) + 1;
        });

        const genreCountArray = Object.keys(counts).map((genre) => ({
          genre,
          count: counts[genre],
        }));

        genreCountArray.sort((a, b) => b.count - a.count);

        const sortedGenreList = genreCountArray.map((item) => item.genre);

        setGenreList(sortedGenreList);
      } catch (error) {
        console.error("Error while retrieving genre data: ", error);
      }
    };

    if (watchedMovies.length > 0) {
      fetchData();
    }
  }, [watchedMovies]);

  useEffect(() => {
    console.log("Genre List:", genreList);
  }, [genreList]);

  const DiscoverScreenButtons = () => {
    const buttons: ButtonData[] = [
      {
        title: "Categories",
        nav: "Categories",
        icon: <MaterialIcons name="category" size={24} color={colors.cyan} />,
      },
      {
        title: "Search",
        nav: "Search",
        icon: <MaterialIcons name="search" size={24} color={colors.cyan} />,
      },
    ];

    return (
      <View>
        <SimpleGrid
          data={buttons}
          listKey="buttonsList"
          renderItem={({ item, index }) => (
            <View key={index}>
              <BigButton title={item.title} nav={item.nav} icon={item.icon} />
            </View>
          )}
        />
      </View>
    );
  };

  const RecommendedByGenre = ({ genre }) => {
    const [moviesByGenre, setMoviesByGenre] = useState([]);

    const shuffle = (array) => {
      let currentIndex = array.length,
        randomIndex;

      // While there remain elements to shuffle.
      while (currentIndex > 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    };

    useEffect(() => {
      const popular = async () => {
        try {
          const data = await fetchPopularMoviesByGenre(genre);
          setMoviesByGenre(shuffle(data.results));
        } catch (error) {
          console.error("Error while retrieving popular movies data: ", error);
        }
      };

      popular();
    }, []);

    return (
      <View style={recommendedByGenre.container}>
        <TitleText
          text={`Because you like ${genres[genre]}`}
          style={recommendedByGenre.title}
        />
        <FlatList
          data={moviesByGenre}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <SimpleCard key={index} id={item.id} />
          )}
        />
      </View>
    );
  };

  const RecommendedByGenreList = () => {
    return (
      <View>
        {genreList.slice(0, 3).map((genre, index) => (
          <View key={index}>
            <RecommendedByGenre genre={genre} />
            {index !== genreList.length - 1 && <View style={{ margin: 6 }} />}
          </View>
        ))}
      </View>
    );
  };

  const components = [<DiscoverScreenButtons />, <RecommendedByGenreList />];

  return (
    <CollapsibleHeaderScrollView
      CollapsibleHeaderComponent={<Header title="Filmer" />}
      headerHeight={60}
      showsVerticalScrollIndicator={false}
      statusBarHeight={Platform.OS === "ios" ? 20 : 0}
      headerContainerBackgroundColor={colors.dark1}
      style={screen.container}
    >
      {components.map((item, index) => {
        return (
          <View key={index} style={{ marginBottom: 15 }}>
            {item}
          </View>
        );
      })}

      <View style={{ marginBottom: sizes.tabbarSpace }} />
    </CollapsibleHeaderScrollView>
  );
};

const screen = StyleSheet.create({
  container: {
    backgroundColor: colors.dark1,
    paddingTop: 16,
  },
});

const recommendedByGenre = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
  },
});

export default DiscoverScreen;
