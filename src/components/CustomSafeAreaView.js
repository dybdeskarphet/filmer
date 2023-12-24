import { SafeAreaView, View } from "react-native";
import React from "react";
import "../config";

const { colors } = global.config.style;

const CustomSafeAreaView = ({ children }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.dark1 }}>
      {children}
    </SafeAreaView>
  );
};

export default CustomSafeAreaView;
