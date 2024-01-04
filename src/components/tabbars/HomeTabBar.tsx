import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "../../config";
import { Shadow } from "react-native-shadow-2";
import { colors, hexTransparencies, sizes } from "../../config";

export interface HomeTabBarProps {
  state: {
    index: number;
    routes: Array<{
      key: string;
      name: string;
    }>;
  };
  descriptors: {
    [key: string]: {
      options: any;
    };
  };
  navigation: {
    navigate: (name: string) => void;
    emit: (args: {
      type: string;
      target: string;
      canPreventDefault: boolean;
    }) => { defaultPrevented: boolean };
  };
}

const HomeTabBar: React.FC<HomeTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.containerShadow}>
      <Shadow stretch={true} distance={10}>
        <View style={styles.container}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];

            const isFocused = state.index === index;

            type IconName =
              | "home"
              | "home-outline"
              | "person"
              | "person-outline"
              | "compass"
              | "compass-outline";
            let icon: IconName;

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
