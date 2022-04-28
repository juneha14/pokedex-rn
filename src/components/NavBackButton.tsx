import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouteNavigation } from "../navigation/useRoutes";
import { Colors } from "../utils/theme";

export const NavBackButton = () => {
  const { pop } = useRouteNavigation();
  const { top, left } = useSafeAreaInsets();

  return (
    <Pressable
      style={{
        position: "absolute",
        top,
        left: left + 10,
        zIndex: 1,
      }}
      onPress={() => pop()}
    >
      <Ionicons name="ios-arrow-back" size={26} color={Colors.IconNeutral} />
    </Pressable>
  );
};
