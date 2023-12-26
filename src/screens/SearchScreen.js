import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import DetailedCard from "../components/DetailedCard";
import tmdbApi, { searchMovies } from "../api/tmdb";
import { Feather } from "@expo/vector-icons";
import "../config";
import CustomSafeAreaView from "../components/CustomSafeAreaView";

const { colors, sizes } = global.config.style;

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Function to handle search
  const handleSearch = async () => {
    try {
      const response = await tmdbApi.get("/search/movie", {
        params: { query: searchQuery },
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  const EmptySearchPlaceholder = () => {
    return (
      <View style={styles.emptySearchPlaceholderContainer}>
        <Image
          style={styles.emptySearchPlaceholderImage}
          source={require("../../assets/searchPlaceholder.png")}
        />
        <Text style={styles.emptySearchPlaceholderText}>
          We are waiting for you...
        </Text>
      </View>
    );
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        {searchQuery == "" && searchResults.length == 0 ? (
          <EmptySearchPlaceholder />
        ) : (
          // If you move this FlatList to another component, keyboard closes on every keystroke.
          <FlatList
            data={searchResults}
            contentContainerStyle={{ paddingTop: 70 }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => {
              return (
                <React.Fragment>
                  <DetailedCard
                    id={item.id}
                  />

                  {index !== searchResults.length - 1 && (
                    <View style={{ margin: 6 }} />
                  )}
                </React.Fragment>
              );
            }}
          />
        )}
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            cursorColor={colors.light2}
            placeholder="Search for movies..."
            placeholderTextColor={colors.light3}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Feather name="search" size={24} color={colors.light2} />
          </TouchableOpacity>
        </View>
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: colors.dark1,
  },
  searchInputContainer: {
    position: "absolute",
    top: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "",
    width: "100%",
    backgroundColor: `${colors.dark2}f5`,
    color: colors.light1,
    paddingLeft: 10,
    paddingRight: 15,
    borderRadius: sizes.radius,
    borderColor: colors.light3,
    borderWidth: 1,
  },
  searchInput: {
    width: "80%",
    paddingVertical: 7.5,
    color: colors.light1,
  },
  searchButton: {
    width: "20%",
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  emptySearchPlaceholderContainer: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  emptySearchPlaceholderImage: {
    width: 200,
    height: 200,
  },
  emptySearchPlaceholderText: {
    color: colors.light3,
    fontWeight: "300",
  },
});

export default SearchScreen;
