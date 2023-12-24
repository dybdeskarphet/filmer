import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "../../config";

const { colors } = global.config.style;

const HomeTabBar = ({ state, descriptors, navigation }) => {
  return (
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          let icon = "";

          switch (route.name) {
            case "Home":
              icon = "home";
              break;
            case "Profile":
              icon = "person";
          }

          if (!isFocused) {
            icon += "-outline";
          }

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity key={index} onPress={onPress} style={styles.icon}>
              <Ionicons name={icon} size={24} color={colors.light1} />
            </TouchableOpacity>
          );
        })}
      </View>
  );
};

export default HomeTabBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 10,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.dark2,
    alignSelf: "center",
  },
  icon: {
    padding: 17,
  },
});
