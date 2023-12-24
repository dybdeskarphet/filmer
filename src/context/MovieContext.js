import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MovieContext = createContext();

const initialState = {
  willWatchList: [],
  watchedList: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_WILL_WATCH":
      return {
        ...state,
        willWatchList: [...state.willWatchList, action.payload],
      };
    case "ADD_TO_WATCHED":
      return { ...state, watchedList: [...state.watchedList, action.payload] };
    case "REMOVE_FROM_WILL_WATCH":
      return {
        ...state,
        willWatchList: state.willWatchList.filter(
          (id) => id !== action.payload
        ),
      };
    case "REMOVE_FROM_WATCHED":
      return {
        ...state,
        watchedList: state.watchedList.filter((id) => id !== action.payload),
      };
    default:
      return state;
  }
};

export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedState = await AsyncStorage.getItem("movieLists");
        if (savedState) {
          dispatch({
            type: "INITIALIZE_STATE",
            payload: JSON.parse(savedState),
          });
        } else {
          // If no saved state, initialize with empty arrays
          dispatch({
            type: "INITIALIZE_STATE",
            payload: initialState,
          });
        }
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("movieLists", JSON.stringify(state));
        const storedData = await AsyncStorage.getItem("movieLists");
      } catch (error) {
        console.error("Error saving data to AsyncStorage:", error);
      }
    };

    saveData();
  }, [state]);

  const addToWillWatchList = (movie) => {
    dispatch({ type: "ADD_TO_WILL_WATCH", payload: movie });
  };

  const addToWatchedList = (movie) => {
    dispatch({ type: "ADD_TO_WATCHED", payload: movie });
  };

  const removeFromWillWatchList = (movieId) => {
    dispatch({ type: "REMOVE_FROM_WILL_WATCH", payload: movieId });
  };

  const removeFromWatchedList = (movieId) => {
    dispatch({ type: "REMOVE_FROM_WATCHED", payload: movieId });
  };

  return (
    <MovieContext.Provider
      value={{
        state,
        addToWillWatchList,
        addToWatchedList,
        removeFromWillWatchList,
        removeFromWatchedList,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export default MovieContext;
