import axios from "axios";
import { API_KEY } from "@env";

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
});

// Add your API key as a default parameter
tmdbApi.defaults.params = {
  api_key: API_KEY,
};

export interface Genre {
  id: number;
  name: String;
}

interface GenreResponse {
  genres: Genre[];
}

let genreCache = {};

export const fetchGenres = async (): Promise<GenreResponse> => {
  try {
    const response = await tmdbApi.get<GenreResponse>("genre/movie/list");
    genreCache = response.data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  genres: Genre[];
  tagline: string;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export const getMovieDetails = async (
  movieId: number
): Promise<MovieDetails> => {
  try {
    const response = await tmdbApi.get<MovieDetails>(`movie/${movieId}`);

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

export interface Movie {
  id: number;
  title: string;
}

interface MovieResponse {
  results: Movie[];
}

interface VideosResponse {
  results: Video[];
}

export interface Video {
  id: string;
  name: string;
  key: string;
  site: string;
  type: string;
  published_at: string;
}

export const getVideos = async (movieId: number): Promise<Video[]> => {
  try {
    const response = await tmdbApi.get<VideosResponse>(
      `movie/${movieId}/videos`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching videos:", error);
  }
};

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get<MovieResponse>("discover/movie", {
      params: {
        sort_by: "popularity.desc",
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
  }
};

interface MovieResponsePagination {
  results: Movie[];
  total_pages: number;
}

export const fetchPopularMoviesByGenre = async (
  genreId: number,
  page: number = 1
): Promise<MovieResponsePagination> => {
  try {
    const response = await tmdbApi.get<MovieResponsePagination>(
      `/discover/movie`,
      {
        params: {
          sort_by: "popularity.desc",
          with_genres: genreId,
          page, // Added page parameter
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching popular movies by genre:", error);
    return { results: [], total_pages: 0 };
  }
};

export interface ImageData {
  file_path: string;
  height: number;
  width: number;
  aspect_ratio: number;
}

interface ImagesResponse {
  backdrops: ImageData[];
}

export const fetchImages = async (movieId): Promise<ImageData[]> => {
  try {
    const response = await tmdbApi.get<ImagesResponse>(
      `movie/${movieId}/images`
    );
    if (response.data.backdrops != null) {
      return response.data.backdrops;
    }
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

export const fetchRecommendedMovies = async (
  movieId: number
): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get<MovieResponse>(
      `movie/${movieId}/recommendations`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching recommended movies:", error);
  }
};

export interface Provider {
  logo_path: string;
  provider_name: string;
  provider_id;
}

interface ProviderResponse {
  results: Provider[];
}

export const fetchWatchProviders = async (
  movieId: number
): Promise<Provider[]> => {
  try {
    const response = await tmdbApi.get<ProviderResponse>(
      `/movie/${movieId}/watch/providers`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching watch providers:", error);
  }
};

fetchGenres().catch(console.error);

export default tmdbApi;
