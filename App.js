import React, { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  TransitionPresets,
} from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import DetailsScreen from "./src/screens/DetailsScreen";
import "./src/config";
import { MovieProvider } from "./src/context/MovieContext";
import SearchScreen from "./src/screens/SearchScreen";
import HomeTabBar from "./src/components/tabbars/HomeTabBar";
import ProfileScreen from "./src/screens/ProfileScreen";
import DiscoverScreen from "./src/screens/DiscoverScreen";
import WatchedScreen from "./src/screens/WatchedScreen";
import WillWatchScreen from "./src/screens/WillWatchScreen";
import GenreDiscoverScreen from "./src/screens/GenreDiscoverScreen";

const { colors } = global.config.style;
const Stack = createNativeStackNavigator();
const HomeTab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <HomeTab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <HomeTabBar {...props} />}
    >
      <HomeTab.Screen name="Home" component={HomeScreen} />
      <HomeTab.Screen name="Discover" component={DiscoverScreen} />
      <HomeTab.Screen name="Profile" component={ProfileScreen} />
    </HomeTab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <MovieProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.dark1} />
        <View style={{ flex: 1, backgroundColor: colors.dark1 }}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.dark1,
              },
              headerShadowVisible: false,
              headerTitleStyle: {
                color: colors.light1,
                fontSize: 24,
              },
              headerTintColor: colors.light1,
              title: "Filmer",
            }}
          >
            <Stack.Screen
              options={{ headerShown: false }}
              name="HomeTabs"
              component={HomeTabs}
            />
            <Stack.Screen
              options={{ title: "Movie Details" }}
              name="Details"
              component={DetailsScreen}
            />
            <Stack.Screen
              options={{ title: "Search Films" }}
              name="Search"
              component={SearchScreen}
            />
            <Stack.Screen
              options={{ title: "Watched Films" }}
              name="Watched"
              component={WatchedScreen}
            />
            <Stack.Screen
              options={{ title: "Watch Later" }}
              name="WillWatch"
              component={WillWatchScreen}
            />
            <Stack.Screen
              options={{ title: "Discover" }}
              name="GenreDiscover"
              component={GenreDiscoverScreen}
            />
          </Stack.Navigator>
        </View>
      </MovieProvider>
    </NavigationContainer>
  );
};

export default App;
