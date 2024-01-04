import React, { useState, useEffect, useContext } from "react";
import { View, TextInput, FlatList, StyleSheet, Text } from "react-native";
import MovieContext from "../context/MovieContext";
import { getMovieDetails, Movie } from "../api/tmdb";
import DetailedCard from "../components/DetailedCard";
import { colors, sizes, hexTransparencies } from "../config";

const WillWatchScreen = () => {
  const [query, setQuery] = useState<string>("");
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { state } = useContext(MovieContext);
  const { willWatchList } = state;

  const fetchWillWatchMoviesDetails = async () => {
    setIsLoading(true);
    try {
      const movieDetailsPromises = willWatchList.map((id: number) =>
        getMovieDetails(id)
      );
      const moviesDetails = await Promise.all(movieDetailsPromises);
      setFilteredMovies(moviesDetails);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWillWatchMoviesDetails();
  }, [willWatchList]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text) {
      const lowerCaseQuery = text.toLowerCase();
      const searchedMovies = filteredMovies.filter((movie) =>
        movie.title.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredMovies(searchedMovies);
    } else {
      // Fetch details for all movies in willWatchList again
      fetchWillWatchMoviesDetails();
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 70, paddingBottom: 20 }}
          renderItem={({ item, index }) => {
            return (
              <React.Fragment>
                <DetailedCard id={item.id} />

                {index !== filteredMovies.length - 1 && (
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
          placeholder="Search your movies..."
          placeholderTextColor={colors.light3}
          cursorColor={colors.light2}
          value={query}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark1,
    paddingHorizontal: 15,
  },
  searchInputContainer: {
    position: "absolute",
    top: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    backgroundColor: `${colors.dark2}${hexTransparencies[96]}`,
    color: colors.light1,
    paddingLeft: 10,
    paddingRight: 15,
    borderRadius: sizes.radius,
    borderColor: colors.light3,
    borderWidth: 1,
  },
  searchInput: {
    width: "100%",
    paddingVertical: 7.5,
    color: colors.light1,
  },
});

export default WillWatchScreen;
