import React from "react";
import { View, Image, Text, Dimensions, Pressable } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { TagList } from "../../components/TagList";
import { Type } from "../../models/server";
import { getColorForAttribute } from "../../utils/getColorForAttribute";
import { Colors, Spacing } from "../../utils/theme";

const WIDTH = (Dimensions.get("window").width - 2 * Spacing.s) / 2 - 2;
const IMG_SIZE = WIDTH * 0.7;

export const PokemonListItem = ({
  imageUri,
  name,
  id,
  attributes,
  index,
  onPress,
  scrollY,
}: {
  imageUri: string;
  name: string;
  id: number;
  attributes: Type[];
  index: number;
  onPress: () => void;
  scrollY: Animated.SharedValue<number>;
}) => {
  const height = useSharedValue(0);

  const aStyle = useAnimatedStyle(() => {
    const row = Math.floor(index / 2);
    const inputRange = [row * height.value, (row + 1) * height.value];

    return {
      transform: [
        {
          scale: interpolate(
            scrollY.value,
            inputRange,
            [1, 0.83],
            Extrapolate.CLAMP
          ),
        },
      ],
      opacity: interpolate(scrollY.value, inputRange, [1, 0.3]),
    };
  });

  return (
    <AnimatedPressable
      style={[
        {
          width: WIDTH,
          marginRight: index % 2 === 0 ? Spacing.s : 0,
          marginBottom: Spacing.m,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: Colors.SurfaceBackgroundPressed,
          overflow: "hidden",
          backgroundColor: Colors.SurfaceForeground,
        },
        aStyle,
      ]}
      onPress={onPress}
      onLayout={(e) => {
        if (height.value === 0) {
          height.value = e.nativeEvent.layout.height;
        }
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.SurfaceForegroundPressed,
        }}
      >
        <Image
          source={{ uri: imageUri }}
          style={{ width: IMG_SIZE, height: IMG_SIZE }}
          resizeMode="cover"
        />
      </View>
      <View
        style={{
          paddingHorizontal: Spacing.m,
          paddingBottom: Spacing.m,
          marginTop: Spacing.m,
        }}
      >
        <Text
          style={{
            color: Colors.TextSubdued,
            fontSize: 16,
            marginBottom: Spacing.m,
          }}
        >
          {`#${String(id).padStart(3, "0")}`}
        </Text>
        <Text
          style={{
            color: Colors.TextOnSurfaceNeutral,
            fontWeight: "500",
            fontSize: 18,
            textTransform: "capitalize",
          }}
        >
          {name}
        </Text>

        <TagList
          style={{ marginTop: Spacing.m }}
          tags={attributes.map((attribute) => {
            const name = attribute.type.name;
            return {
              title: name,
              color: getColorForAttribute(name),
            };
          })}
        />
      </View>
    </AnimatedPressable>
  );
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
