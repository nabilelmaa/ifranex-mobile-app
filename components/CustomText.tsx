import React from "react";
import { Text, TextProps } from "react-native";

const CustomText: React.FC<TextProps> = ({ style, ...props }) => {
  return <Text {...props} style={[{ fontFamily: "Freedom-10eM" }, style]} />;
};

export default CustomText;
