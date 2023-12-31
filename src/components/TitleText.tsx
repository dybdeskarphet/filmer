import React from "react";
import { StyleProp, TextStyle, Text } from "react-native";
import { colors } from "../config";

interface TitleTextProps {
  text: string;
  style?: StyleProp<TextStyle>;
}

const TitleText = ({ text, style = {} }: TitleTextProps) => {
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
