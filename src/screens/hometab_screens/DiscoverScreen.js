import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import CustomSafeAreaView from "../../components/CustomSafeAreaView";
import { CollapsibleHeaderScrollView } from "react-native-collapsible-header-views";
import Header from "../../components/Header";
import { fetchGenres } from "../../api/tmdb";
import { SimpleGrid } from "react-native-super-grid";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

const { colors, sizes, hexTransparencies } = global.config.style;

const DiscoverScreen = ({ navigation }) => {
  const [genres, setGenres] = useState();
  const [showAllGenres, setShowAllGenres] = useState(false);
  const initialDisplayGenres = 8;

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData.genres);
      } catch (error) {
        console.log("Failed to fetch genres:", error);
      }
    };

    loadGenres();
  }, []);

  const genreIconSize = 20;

  const genreIconMapping = {
    Action: (
      <FontAwesome5 name="rocket" size={genreIconSize} color={colors.light2} />
    ),
    Adventure: (
      <FontAwesome5 name="book" size={genreIconSize} color={colors.light2} />
    ),
    Animation: (
      <MaterialIcons
        name="animation"
        size={genreIconSize}
        color={colors.light2}
      />
    ),
    Comedy: (
      <FontAwesome5 name="laugh" size={genreIconSize} color={colors.light2} />
    ),
    Crime: (
      <MaterialCommunityIcons
        name="knife"
        size={genreIconSize}
        color={colors.light2}
      />
    ),
    Documentary: (
      <FontAwesome5 name="horse" size={genreIconSize} color={colors.light2} />
    ),
    Drama: (
      <FontAwesome5
        name="sad-tear"
        size={genreIconSize}
        color={colors.light2}
      />
    ),
    Family: (
      <MaterialIcons
        name="family-restroom"
        size={genreIconSize}
        color={colors.light2}
      />
    ),
    Fantasy: (
      <MaterialCommunityIcons
        name="star-shooting"
        size={genreIconSize}
        color={colors.light2}
      />
    ),
    History: (
      <MaterialIcons
        name="history-edu"
        size={genreIconSize}
        color={colors.light2}
      />
    ),
    Horror: (
      <FontAwesome5 name="crow" size={genreIconSize} color={colors.light2} />
    ),
    Music: (
      <MaterialIcons
        name="music-note"
        size={genreIconSize}
        color={colors.light2}
      />
    ),
    Mystery: (
      <MaterialCommunityIcons
        name="magnify"
        size={genreIconSize}
        color={colors.light2}
      />
    ),
    Romance: (
      <MaterialCommunityIcons
        name="heart"
        size={genreIconSize}
        color={colors.light2}
      />
    ),
    "Science Fiction": (
      <MaterialIcons
        name="science"
        size={genreIconSize}
        color={colors.light2}
      />
    ),
    "TV Movie": (
      <FontAwesome5 name="tv" size={genreIconSize} color={colors.light2} />
    ),
    Thriller: (
      <FontAwesome5 name="eye" size={genreIconSize} color={colors.light2} />
    ),
    War: (
      <MaterialCommunityIcons
        name="sword-cross"
        size={genreIconSize}
        color={colors.light2}
      />
    ),
    Western: (
      <FontAwesome5
        name="hat-cowboy"
        size={genreIconSize}
        color={colors.light2}
      />
    ),
  };

  const IconComponent = ({ name }) => {
    const icon = genreIconMapping[name] || (
      <MaterialIcons
        name="local-movies"
        size={genreIconSize}
        color={colors.light2}
      />
    );

    return icon;
  };

  const GenresButton = ({ id, name }) => {
    return (
      <TouchableOpacity
        style={genreSection.buttonContainer}
        onPress={() => {
          console.log("Genre is pressed: " + name);
          navigation.navigate("GenreDiscover", { id, name });
        }}
      >
        <IconComponent name={name} />
        <Text style={genreSection.buttonText}>{name}</Text>
      </TouchableOpacity>
    );
  };

  const ShowMoreGenres = () => {
    return (
      <TouchableOpacity
        style={showMoreGenres.container}
        onPress={() => setShowAllGenres(!showAllGenres)}
      >
        <Text style={showMoreGenres.text}>
          {showAllGenres ? "Show Less" : "Show More"}
        </Text>
      </TouchableOpacity>
    );
  };

  const Genres = () => {
    if (!genres || genres.length === 0) {
      return <Text>Loading genres...</Text>; // Or any other placeholder
    }

    const displayedGenres = showAllGenres
      ? genres
      : genres.slice(0, initialDisplayGenres);

    return (
      <View>
        <SimpleGrid
          data={displayedGenres}
          renderItem={({ item, key }) => (
            <GenresButton key={key} id={item.id} name={item.name} />
          )}
        />
        {genres.length > initialDisplayGenres && <ShowMoreGenres />}
      </View>
    );
  };

  return (
    <CustomSafeAreaView>
      <CollapsibleHeaderScrollView
        CollapsibleHeaderComponent={<Header title="Filmer" />}
        headerHeight={60}
        showsVerticalScrollIndicator={false}
        statusBarHeight={Platform.OS === "ios" ? 20 : 0}
        headerContainerBackgroundColor={colors.dark1}
        style={screen.container}
      >
        <Genres />
      </CollapsibleHeaderScrollView>
    </CustomSafeAreaView>
  );
};

const screen = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: 16,
  },
});

const showMoreGenres = StyleSheet.create({
  container: {
    backgroundColor: `${colors.dark0}${hexTransparencies[80]}`,
    marginHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: sizes.radiusBig,
  },
  text: {
    color: `${colors.light1}${hexTransparencies[80]}`,
  },
});

const genreSection = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.dark0,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.dark2,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 12,
    color: colors.light1,
  },
});

export default DiscoverScreen;
