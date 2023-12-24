import React, { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  TransitionPresets,
} from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import DetailsScreen from "./src/screens/DetailsScreen";
import "./src/config";
import { MovieProvider } from "./src/context/MovieContext";
import SearchScreen from "./src/screens/SearchScreen";

const { colors } = global.config.style;
const Stack = createNativeStackNavigator();

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
              options={{
                headerShown: false,
              }}
              name="Home"
              component={HomeScreen}
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
          </Stack.Navigator>
        </View>
      </MovieProvider>
    </NavigationContainer>
  );
};

export default App;
