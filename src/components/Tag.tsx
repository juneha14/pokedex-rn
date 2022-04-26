import React from "react";
import { Text, View } from "react-native";
import { Colors, Spacing } from "../utils/theme";

export interface TagProps {
  title: string;
  color: string;
}

export const Tag = ({ title, color }: TagProps) => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: Spacing.l,
        paddingVertical: Spacing.s,
        marginRight: Spacing.s,
        borderRadius: 5,
        backgroundColor: color,
      }}
    >
      <Text
        style={{
          color: Colors.TextOnSurfacePrimary,
          textTransform: "capitalize",
        }}
      >
        {title}
      </Text>
    </View>
  );
};
