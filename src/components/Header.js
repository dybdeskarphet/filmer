import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import "../config";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { colors } = global.config.style;

const SearchButton = () => {
  const navigation = useNavigation();

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

const Header = ({ title, buttons }) => {
  let buttonComponents = [];

  buttons.forEach((button) => {
    switch (button) {
      case "search":
        buttonComponents.push(<SearchButton />);
        break;
    }
  });

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
      <View style={styles.buttons}>
        {buttonComponents.map((item, key) => {
          return <View key={key}>{item}</View>;
        })}
      </View>
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
