import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

const { colors, sizes } = global.config.style;

const WatchedScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          cursorColor={colors.light2}
          placeholder="Search for movies..."
          placeholderTextColor={colors.light3}
          value={""}
          onChangeText={""}
          onSubmitEditing={""}
        />
        <TouchableOpacity style={styles.searchButton} onPress={""}>
          <Feather name="search" size={24} color={colors.light2} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark1,
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 16,
  },
  searchInputContainer: {
    position: "absolute",
    top: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "",
    width: "100%",
    backgroundColor: `${colors.dark2}f5`,
    color: colors.light1,
    paddingLeft: 10,
    paddingRight: 15,
    borderRadius: sizes.radius,
    borderColor: colors.light3,
    borderWidth: 1,
  },
  searchInput: {
    width: "80%",
    paddingVertical: 7.5,
    color: colors.light1,
  },
  searchButton: {
    width: "20%",
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
});

export default WatchedScreen;
