import { View, StyleSheet, Platform, Text } from "react-native";
import React, { useContext, useEffect } from "react";
import { CollapsibleHeaderScrollView } from "react-native-collapsible-header-views";
import Header from "../../components/Header";
import { SimpleGrid } from "react-native-super-grid";
import BigButton from "../../components/BigButton";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, sizes, hexTransparencies } from "../../config";
import TitleText from "src/components/TitleText";
import { fetchPopularMoviesByGenre, getMovieDetails } from "src/api/tmdb";
import MovieContext from "src/context/MovieContext";

interface ButtonData {
  title: string;
  nav: string;
  icon: JSX.Element;
}

const DiscoverScreen = () => {
  const { state } = useContext(MovieContext);
  const watchedMovies = state.watchedList;
  console.log(watchedMovies);
  let genreList = [];

  watchedMovies.forEach((movie) => {
    useEffect(() => {
      const fetchGenres = async () => {
        try {
          const data = await getMovieDetails(movie);
          data.genres.forEach((genres) => {
            if (genres.hasOwnProperty("id")) {
              genreList.push(genres.id);
            }
          });
          console.log(genreList);
        } catch (error) {
          console.error("Error while retrieving genre data: ", error);
        }
      };

      fetchGenres();
    }, []);
  });

  genreList.forEach((value, index) => {
    useEffect(() => {});
  });

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
    return (
      <View style={recommendedByGenre.container}>
        <TitleText
          text={`Because you like ${genre}`}
          style={recommendedByGenre.title}
        />
      </View>
    );
  };

  const components = [
    <DiscoverScreenButtons />,
    <RecommendedByGenre genre="Drama" />,
  ];

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
          <View key={index} style={{ marginBottom: 10 }}>
            {item}
          </View>
        );
      })}
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
  },
});

export default DiscoverScreen;
