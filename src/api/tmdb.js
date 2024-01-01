import axios from "axios";
import {API_KEY} from '@env'

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
});

// Add your API key as a default parameter
tmdbApi.defaults.params = {
  api_key: API_KEY,
};

let genreCache = {};

export const fetchGenres = async () => {
  try {
    const response = await tmdbApi.get("genre/movie/list");
    genreCache = response.data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`movie/${movieId}`);

    // Map genre IDs to names
    if (response.data.genres) {
      response.data.genres = response.data.genres.map((genre) => {
        return {
          id: genre.id,
          name: genreCache[genre.id] || "Unknown Genre",
        };
      });
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPopularMovies = async () => {
  try {
    const response = await tmdbApi.get("discover/movie", {
      params: {
        sort_by: "popularity.desc",
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
  }
};

export const fetchPopularMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await tmdbApi.get(`/discover/movie`, {
      params: {
        sort_by: "popularity.desc",
        with_genres: genreId,
        page, // Added page parameter
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching popular movies by genre:", error);
    return { results: [], total_pages: 0 };
  }
};

export const fetchImages = async (movieId) => {
  try {
    const response = await tmdbApi.get(`movie/${movieId}/images`);
    if (response.data.backdrops != null) {
      return response.data.backdrops;
    }
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

export const fetchRecommendedMovies = async (movieId) => {
  try {
    const response = await tmdbApi.get(`movie/${movieId}/recommendations`);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching recommended movies:", error);
  }
};

export const fetchWatchProviders = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/watch/providers`);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching watch providers:", error);
  }
};

fetchGenres().catch(console.error);

export default tmdbApi;
