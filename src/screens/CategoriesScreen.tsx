import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { fetchGenres, Genre } from "../api/tmdb";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { colors, sizes } from "../config";
import { Shadow } from "react-native-shadow-2";
import { FlatGrid } from "react-native-super-grid";
import ScreenLoading from "../components/ScreenLoading";

const CategoriesScreen = () => {
  const [genres, setGenres] = useState<Genre[]>([]);

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

  interface IconComponentProps {
    name: string;
  }

  const IconComponent = ({ name }: IconComponentProps) => {
    const icon = genreIconMapping[name] || (
      <MaterialIcons
        name="local-movies"
        size={genreIconSize}
        color={colors.light2}
      />
    );

    return icon;
  };

  interface GenresButtonProps {
    id: number;
    name: string;
  }

  const GenresButton = ({ id, name }: GenresButtonProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    return (
      <Shadow style={genreSection.shadowContainer} stretch={true}>
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
      </Shadow>
    );
  };

  const Genres = () => {
    if (!genres || genres.length === 0) {
      return (
        <View style={{ flex: 1 }}>
          <ScreenLoading message="Loading genres..." />
        </View>
      ); // Or any other placeholder
    }

    return (
      <View>
        <FlatGrid
          data={genres}
          contentContainerStyle={{
            marginTop: 10,
            paddingBottom: 20,
          }}
          renderItem={({ item, index }) => {
            const namePrimitive: string = item.name.toString();

            return (
              <View key={index}>
                <GenresButton id={item.id} name={namePrimitive} />
              </View>
            );
          }}
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
    flexDirection: "column",
    height: 100,
    borderRadius: sizes.radius,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dark0,
  },
  shadowContainer: {},
  buttonText: {
    fontSize: 14,
    color: colors.light1,
    fontWeight: "400",
  },
  iconContainer: {
    marginBottom: 8,
  },
});

export default CategoriesScreen;
