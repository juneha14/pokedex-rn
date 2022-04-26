import React from "react";
import { ActivityIndicator } from "react-native";
import { Colors } from "../utils/theme";

export const LoadingIndicator = () => {
  return (
    <ActivityIndicator
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      color={Colors.IconNeutral}
    />
  );
};
