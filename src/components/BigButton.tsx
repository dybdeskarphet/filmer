import { Text, TouchableOpacity } from "react-native";
import React, { ReactElement } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { hexTransparencies, sizes, colors } = global.config.style;

export type Props = {
  icon: ReactElement;
  nav: string;
  title: string;
  navParams?: object;
};

const BigButton = ({ icon, nav, title, navParams = {} }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        backgroundColor: `${colors.dark0}${hexTransparencies[90]}`,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        borderRadius: sizes.radius,
      }}
      onPress={() => navigation.navigate(nav, navParams)}
    >
      {icon}
      <Text
        style={{
          fontSize: 18,
          color: colors.light1,
          marginLeft: 10,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default BigButton;
