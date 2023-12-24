import { View, Text, StyleSheet } from "react-native";
import React from "react";
import {
  CollapsibleHeaderScrollView,
  CollapsibleHeaderSectionList,
} from "react-native-collapsible-header-views";
import Header from "../components/Header";

const { colors, sizes } = global.config.style;

const ProfileScreen = () => {
  return (
    <CollapsibleHeaderScrollView
      CollapsibleHeaderComponent={<Header title="Filmer" />}
      headerHeight={60}
      showsVerticalScrollIndicator={false}
      statusBarHeight={Platform.OS === "ios" ? 20 : 0}
      headerContainerBackgroundColor={colors.dark1}
      style={styles.container}
    >
      <Text>ProfileScreen</Text>

      <View style={{ marginBottom: sizes.tabbarSpace }} />
    </CollapsibleHeaderScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProfileScreen;
