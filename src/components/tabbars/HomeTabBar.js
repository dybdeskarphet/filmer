import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "../../config";
import { Shadow } from "react-native-shadow-2";

const { colors, sizes, hexTransparencies } = global.config.style;

const HomeTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.containerShadow}>
      <Shadow stretch={true} distance={10}>
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
                break;
              case "Discover":
                icon = "compass";
                break;
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
              <TouchableOpacity
                key={index}
                onPress={onPress}
                style={styles.icon}
              >
                {isFocused ? (
                  <Ionicons name={icon} size={24} color={colors.light1} />
                ) : (
                  <Ionicons
                    name={icon}
                    size={24}
                    color={`${colors.light3}${hexTransparencies[80]}`}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Shadow>
    </View>
  );
};

export default HomeTabBar;

const styles = StyleSheet.create({
  containerShadow: {
    position: "absolute",
    bottom: 11,
    alignSelf: "center",
    width: "90%",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: `${colors.dark0}${hexTransparencies[95]}`,
    borderRadius: sizes.radius,
    borderWidth: 1,
    borderColor: colors.dark2,
    alignItems: "center",
  },
  icon: {
    padding: 17,
  },
});
