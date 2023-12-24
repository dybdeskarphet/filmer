import React from "react";
import { Text } from "react-native";

const { colors } = global.config.style;

const TitleText = ({ text, style }) => {
  return (
    <>
      <Text
        style={[
          {
            fontSize: 24,
            fontWeight: "500",
            color: colors.light1,
          },
          style,
        ]}
      >
        {text}
      </Text>
    </>
  );
};

export default TitleText;
