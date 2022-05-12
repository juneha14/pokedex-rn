import React from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Type } from "../../../models/server";
import { TagList } from "../../../components/TagList";
import {
  getColorForAttribute,
  getPokemonColorForAttribute,
} from "../../../utils/getColorForAttribute";
import { Colors, Spacing } from "../../../utils/theme";
import { SharedElement } from "react-navigation-shared-element";

export const Header = ({
  imgUri,
  name,
  id,
  attributes,
  scrollY,
}: {
  imgUri: string;
  id: number;
  name: string;
  attributes: Type[];
  scrollY: Animated.SharedValue<number>;
}) => {
  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-60, 0, 95, 96],
            [-30, 0, 0, 1],
            Extrapolate.EXTEND
          ),
        },
      ],
    };
  });

  const backgroundAStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(scrollY.value, [-100, 0], [3, 1], {
            extrapolateLeft: "extend",
            extrapolateRight: "clamp",
          }),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          paddingTop: 20,
          paddingBottom: 30,
          paddingHorizontal: Spacing.defaultMargin,
        },
        aStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: getPokemonColorForAttribute(
              attributes[0].type.name
            ),
          },
          backgroundAStyle,
        ]}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ justifyContent: "center" }}>
          <Text
            style={{
              textTransform: "capitalize",
              fontSize: 30,
              fontWeight: "700",
              color: Colors.TextOnSurfacePrimary,
            }}
          >
            {name}
          </Text>
          <TagList
            style={{ marginTop: Spacing.m }}
            tags={attributes.map((a) => ({
              title: a.type.name,
              color: getColorForAttribute(a.type.name),
            }))}
          />
        </View>
        <Text
          style={{
            color: Colors.TextOnSurfacePrimary,
            fontSize: 16,
            marginBottom: Spacing.m,
          }}
        >
          {`#${String(id).padStart(3, "0")}`}
        </Text>
      </View>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: Spacing.m,
        }}
      >
        <SharedElement id={`${id}.${imgUri}`}>
          <Image
            source={{ uri: imgUri }}
            style={{ width: IMG_WIDTH, height: IMG_HEIGHT }}
            resizeMode="contain"
          />
        </SharedElement>
      </View>
    </Animated.View>
  );
};

const IMG_WIDTH = Dimensions.get("window").width;
const IMG_HEIGHT = (IMG_WIDTH * 9) / 16;
