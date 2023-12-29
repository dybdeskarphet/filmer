import { View, StyleSheet } from "react-native";
import React from "react";
i
const { colors } = global.config.style;

const GenreDiscoverScreen = ({ route }) => {
  const { id } = route.params;
  return (
    <View style={styles.container}>
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
