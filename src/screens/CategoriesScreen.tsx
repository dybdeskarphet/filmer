import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";

import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { fetchGenres } from "../api/tmdb";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";

const { colors } = global.config.style;

const CategoriesScreen = () => {
  const [genres, setGenres] = useState([]);

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

  const genreIconSize = 26;
  const iconColors = colors.light3;
  const genreIconMapping = {
    Action: (
      <FontAwesome5 name="rocket" size={genreIconSize} color={iconColors} />
    ),
    Adventure: (
      <FontAwesome5 name="book" size={genreIconSize} color={iconColors} />
    ),
    Animation: (
      <MaterialIcons name="animation" size={genreIconSize} color={iconColors} />
    ),
    Comedy: (
      <FontAwesome5 name="laugh" size={genreIconSize} color={iconColors} />
    ),
    Crime: (
      <MaterialCommunityIcons
        name="knife"
        size={genreIconSize}
        color={iconColors}
      />
    ),
    Documentary: (
      <FontAwesome5 name="horse" size={genreIconSize} color={iconColors} />
    ),
    Drama: (
      <FontAwesome5 name="sad-tear" size={genreIconSize} color={iconColors} />
    ),
    Family: (
      <MaterialIcons
        name="family-restroom"
        size={genreIconSize}
        color={iconColors}
      />
    ),
    Fantasy: (
      <MaterialCommunityIcons
        name="star-shooting"
        size={genreIconSize}
        color={iconColors}
      />
    ),
    History: (
      <MaterialIcons
        name="history-edu"
        size={genreIconSize}
        color={iconColors}
      />
    ),
    Horror: (
      <FontAwesome5 name="crow" size={genreIconSize} color={iconColors} />
    ),
    Music: (
      <MaterialIcons
        name="music-note"
        size={genreIconSize}
        color={iconColors}
      />
    ),
    Mystery: (
      <MaterialCommunityIcons
        name="magnify"
        size={genreIconSize}
        color={iconColors}
      />
    ),
    Romance: (
      <MaterialCommunityIcons
        name="heart"
        size={genreIconSize}
        color={iconColors}
      />
    ),
    "Science Fiction": (
      <MaterialIcons name="science" size={genreIconSize} color={iconColors} />
    ),
    "TV Movie": (
      <FontAwesome5 name="tv" size={genreIconSize} color={iconColors} />
    ),
    Thriller: (
      <FontAwesome5 name="eye" size={genreIconSize} color={iconColors} />
    ),
    War: (
      <MaterialCommunityIcons
        name="sword-cross"
        size={genreIconSize}
        color={iconColors}
      />
    ),
    Western: (
      <FontAwesome5 name="hat-cowboy" size={genreIconSize} color={iconColors} />
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
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    return (
      <TouchableOpacity
        style={genreSection.buttonContainer}
        onPress={() => {
          console.log("Genre is pressed: " + name);
          navigation.navigate("GenreDiscover", { id, name });
        }}
      >
        <View style={genreSection.iconContainer}>
          <IconComponent name={name} />
        </View>
        <Text style={genreSection.buttonText}>{name}</Text>
      </TouchableOpacity>
    );
  };

  const Genres = () => {
    if (!genres || genres.length === 0) {
      return <Text>Loading genres...</Text>; // Or any other placeholder
    }

    return (
      <View>
        <FlatList
          data={genres}
          contentContainerStyle={{
            marginTop: 10,
          }}
          renderItem={({ item, index }) => (
            <View key={index}>
              <GenresButton id={item.id} name={item.name} />
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <View style={screen.container}>
      <Genres />
    </View>
  );
};

const screen = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark1,
  },
});

const genreSection = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    paddingVertical: 25,
    paddingLeft: 30,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: colors.light1,
    left: 40,
    fontWeight: "500",
  },
  iconContainer: {
    left: 10,
    height: 26,
    width: 33,
  },
});

export default CategoriesScreen;
