import { View, Image, StyleSheet, Platform } from "react-native";
import React from "react";
import {
  CollapsibleHeaderScrollView,
} from "react-native-collapsible-header-views";
import Header from "../../components/Header";
import { colors, sizes } from "../../config";

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
      <Image
        style={{
          width: 155,
          height: 150,
          alignSelf: "center",
          marginTop: 200,
        }}
        source={require("../../../assets/wip.png")}
      />

      <View style={{ marginBottom: sizes.tabbarSpace }} />
    </CollapsibleHeaderScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark1,
    flex: 1,
  },
});

export default ProfileScreen;
