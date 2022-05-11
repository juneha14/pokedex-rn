import React from "react";
import { Text, View, StyleProp, ViewStyle } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Spacing } from "../utils/theme";

type SectionProps = React.PropsWithChildren<{
  title: string;
  style?: StyleProp<ViewStyle>;
}>;

export const Section = ({ title, children, style }: SectionProps) => {
  return (
    <View style={[{}, style]}>
      <View style={{ marginBottom: Spacing.m }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "600",
            color: Colors.TextOnSurfaceNeutral,
          }}
        >
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
};
