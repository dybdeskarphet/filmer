import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import "../config";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { colors } = global.config.style;

const Header = ({ title, searchButton }) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.dark1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 15,
        flexDirection: "row",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          style={{ width: 40, height: 40, marginRight: 10 }}
          source={require("../../assets/dino.png")}
        />
        <Text style={{ fontSize: 24, color: colors.light1, fontWeight: "700" }}>
          {title}
        </Text>
      </View>
      <View>
        <TouchableOpacity
          style={{
            paddingRight: 15,
          }}
          onPress={() => navigation.navigate("Search")}
        >
          <Feather name="search" size={24} color={colors.light1} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
