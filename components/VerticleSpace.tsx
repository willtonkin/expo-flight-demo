import React from "react";
import { View } from "react-native";

const VerticalSpace = ({ height = 20 }: { height?: number }) => (
  <View style={{ height }} />
);

export default VerticalSpace;
