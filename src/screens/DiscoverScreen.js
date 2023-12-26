import { View, Text, StyleSheet } from "react-native";
import React from "react";
import CustomSafeAreaView from "../components/CustomSafeAreaView";
import { CollapsibleHeaderScrollView } from "react-native-collapsible-header-views";
import Header from "../components/Header";

const { colors } = global.config.style;

const DiscoverScreen = () => {
  return (
    <CustomSafeAreaView>
      <CollapsibleHeaderScrollView
        CollapsibleHeaderComponent={<Header title="Filmer" />}
        headerHeight={60}
        showsVerticalScrollIndicator={false}
        statusBarHeight={Platform.OS === "ios" ? 20 : 0}
        headerContainerBackgroundColor={colors.dark1}
        style={styles.container}
      >
        <Text>DiscoverScreen</Text>
      </CollapsibleHeaderScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: 16,
  },
});

export default DiscoverScreen;
