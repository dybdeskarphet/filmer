import { View, StyleSheet, Platform, Text } from "react-native";
import React, { useContext, useEffect } from "react";
import { CollapsibleHeaderScrollView } from "react-native-collapsible-header-views";
import Header from "../../components/Header";
import { SimpleGrid } from "react-native-super-grid";
import BigButton from "../../components/BigButton";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, sizes, hexTransparencies } from "../../config";
import { requireNativeModule } from "expo";
import TitleText from "src/components/TitleText";
import { fetchPopularMoviesByGenre } from "src/api/tmdb";

interface ButtonData {
  title: string;
  nav: string;
  icon: JSX.Element;
}

// useEffect(() => {
//   const { state } = useContext(MovieContext);


//   const recommendedByGenre = async () => {
//     try {
//       const data = await fetchPopularMoviesByGenre();
//       setMovies(data as Movie[]);
//     } catch (error) {
//       console.error("Error while retrieving popular movies data: ", error);
//     }
//   };

//   recommendedByGenre();
// }, []);

const DiscoverScreen = () => {
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

  const components = [<DiscoverScreenButtons />, <RecommendedByGenre />];

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
