import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { colors } from "../config";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";

const SearchButton = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <TouchableOpacity
      style={{
        padding: 15,
      }}
      onPress={() => navigation.navigate("Search")}
    >
      <Feather name="search" size={24} color={colors.light1} />
    </TouchableOpacity>
  );
};

type ButtonType = "search";

interface HeaderProps {
  title: string;
  buttons?: ButtonType[];
}

const Header = ({ title, buttons = [] }: HeaderProps) => {
  const buttonComponents = buttons
    .map((buttonType, index) => {
      switch (buttonType) {
        case "search":
          return <SearchButton key={`button-${buttonType}-${index}`} />;
          break;
        default:
          return null;
      }
    })
    .filter((component) => component !== null);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={{ width: 40, height: 40, marginRight: 10 }}
          source={require("../../assets/dino.png")}
        />
        <Text style={{ fontSize: 24, color: colors.light1, fontWeight: "700" }}>
          {title}
        </Text>
      </View>
      <View style={styles.buttons}>{buttonComponents}</View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark1,
    paddingLeft: 15,
    flexDirection: "row",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttons: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: "auto",
  },
});
