import React from "react";
import { View, Pressable } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouteNavigation } from "../../../navigation/useRoutes";
import { Colors, Spacing } from "../../../utils/theme";

export const NavigationHeader = ({
  backgroundColor,
  title,
  scrollY,
}: {
  backgroundColor: string;
  title: string;
  scrollY: Animated.SharedValue<number>;
}) => {
  const { pop } = useRouteNavigation();
  const { top } = useSafeAreaInsets();

  const titleAStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, 60],
            [60, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
      opacity: interpolate(
        scrollY.value,
        [0, 25, 60],
        [0, 0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  const buttonAStyle = useAnimatedStyle(() => {
    return {
      borderWidth: interpolate(
        scrollY.value,
        [0, 25],
        [1, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 44 + top,
        paddingTop: top,
        paddingHorizontal: Spacing.defaultMargin,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor,
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      <AnimatedPressable
        style={[
          {
            justifyContent: "center",
            alignItems: "center",
            width: 35,
            height: 35,
            borderRadius: 35 / 2,
            borderColor: Colors.IconOnPrimary,
            borderWidth: 1,
          },
          buttonAStyle,
        ]}
        onPress={() => pop()}
      >
        <Ionicons
          name="ios-close-outline"
          size={30}
          color={Colors.IconOnPrimary}
        />
      </AnimatedPressable>
      <Animated.Text
        style={[
          {
            color: Colors.TextOnSurfacePrimary,
            textTransform: "capitalize",
            fontWeight: "600",
            fontSize: 20,
            letterSpacing: 0.1,
          },
          titleAStyle,
        ]}
      >
        {title}
      </Animated.Text>

      {/* Dummy right navigation item so that the text is center aligned */}
      <View style={{ width: 26, height: 26 }} />
    </View>
  );
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
