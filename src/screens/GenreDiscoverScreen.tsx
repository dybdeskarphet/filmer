import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { colors } from "../config";
import { RouteParams } from "../../App";

interface GenreDiscoverScreenProps {
  route: {
    params: RouteParams;
  };
}

const GenreDiscoverScreen = ({ route }: GenreDiscoverScreenProps) => {
  return (
    <View style={styles.container}>
      <Text>GenreDiscoverScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark1,
  },
});

export default GenreDiscoverScreen;
