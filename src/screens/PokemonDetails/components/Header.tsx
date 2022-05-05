import React from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Type } from "../../../models/server";
import { TagList } from "../../../components/TagList";
import {
  getColorForAttribute,
  getPokemonColorForAttribute,
} from "../../../utils/getColorForAttribute";
import { Colors, Spacing } from "../../../utils/theme";

export const Header = ({
  imgUri,
  name,
  id,
  attributes,
}: {
  imgUri: string;
  id: number;
  name: string;
  attributes: Type[];
}) => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: 20,
        paddingBottom: 30,
        paddingHorizontal: Spacing.defaultMargin,
      }}
    >
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: getPokemonColorForAttribute(attributes[0].type.name),
        }}
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
        <Image
          source={{ uri: imgUri }}
          style={{ width: IMG_WIDTH, height: IMG_HEIGHT }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const IMG_WIDTH = Dimensions.get("window").width;
const IMG_HEIGHT = (IMG_WIDTH * 9) / 16;
