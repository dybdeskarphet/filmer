import React, { createContext, useReducer, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MovieState {
  willWatchList: string[];
  watchedList: string[];
}

type MovieAction =
  | {
      type:
        | "ADD_TO_WILL_WATCH"
        | "ADD_TO_WATCHED"
        | "REMOVE_FROM_WILL_WATCH"
        | "REMOVE_FROM_WATCHED";
      payload: string;
    }
  | { type: "INITIALIZE_STATE"; payload: MovieState };

const initialState: MovieState = {
  willWatchList: [],
  watchedList: [],
};

const reducer = (state: MovieState, action: MovieAction) => {
  switch (action.type) {
    case "ADD_TO_WILL_WATCH":
      // Check for duplicate item before adding to the list
      if (!state.willWatchList.includes(action.payload)) {
        return {
          ...state,
          willWatchList: [...state.willWatchList, action.payload],
        };
      }
      return state;
    case "ADD_TO_WATCHED":
      // Check for duplicate item before adding to the list
      if (!state.watchedList.includes(action.payload)) {
        return {
          ...state,
          watchedList: [...state.watchedList, action.payload],
        };
      }
      return state;
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
    case "INITIALIZE_STATE":
      return action.payload; // Use the payload as the new state
    default:
      return state;
  }
};

interface MovieContextType {
  state: MovieState;
  addToWillWatchList: (movieId: string) => void;
  addToWatchedList: (movieId: string) => void;
  removeFromWillWatchList: (movieId: string) => void;
  removeFromWatchedList: (movieId: string) => void;
}

const defualtContextValue: MovieContextType = {
  state: initialState,
  addToWillWatchList: () => {},
  addToWatchedList: () => {},
  removeFromWillWatchList: () => {},
  removeFromWatchedList: () => {},
};

const MovieContext = createContext<MovieContextType>(defualtContextValue);

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
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

  const addToWillWatchList = (movieId: string) => {
    dispatch({ type: "ADD_TO_WILL_WATCH", payload: movieId });
  };

  const addToWatchedList = (movieId: string) => {
    dispatch({ type: "ADD_TO_WATCHED", payload: movieId });
  };

  const removeFromWillWatchList = (movieId: string) => {
    dispatch({ type: "REMOVE_FROM_WILL_WATCH", payload: movieId });
  };

  const removeFromWatchedList = (movieId: string) => {
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
