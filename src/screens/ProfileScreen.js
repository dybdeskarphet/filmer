import { View, Text } from "react-native";
import React from "react";

const { colors, sizes } = global.config.style;

const ProfileScreen = () => {
  return (
    <View>
      <Text>ProfileScreen</Text>

      <View style={{ marginBottom: sizes.tabbarSpace }} />
    </View>
  );
};

export default ProfileScreen;
