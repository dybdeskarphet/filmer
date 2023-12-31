import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { colors } from "../config";

interface ScreenLoadingProps {
  message: string;
}

const ScreenLoading = ({ message }: ScreenLoadingProps) => {
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
