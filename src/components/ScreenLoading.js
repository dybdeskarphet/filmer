import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

const { colors } = global.config.style;

const ScreenLoading = ({message}) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <ActivityIndicator color={colors.light1} size="large" />
      <Text
        style={{
          fontSize: 12,
          color: colors.light1,
          marginTop: 20,
        }}
      >
        {message}
      </Text>
    </View>
  );
};

export default ScreenLoading;
