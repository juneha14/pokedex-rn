import React from "react";
import { View, Image, Text, Dimensions } from "react-native";
import { Type } from "../models/server";

const WIDTH = (Dimensions.get("window").width - 2 * 5) / 2 - 2;
const IMG_SIZE = WIDTH * 0.7;

export const PokemonListItem = ({
  imageUri,
  name,
  id,
  attributes,
  index,
}: {
  imageUri: string;
  name: string;
  id: number;
  attributes: Type[];
  index: number;
}) => {
  return (
    <View
      style={{
        width: WIDTH,
        marginRight: index % 2 === 0 ? 4 : 0,
        marginBottom: 4,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "orange",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "pink",
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
          paddingHorizontal: 4,
          paddingBottom: 8,
          marginTop: 8,
        }}
      >
        <Text>{id}</Text>
        <Text style={{ textTransform: "capitalize" }}>{name}</Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          {attributes.map((attribute) => {
            return (
              <View
                key={`${attribute.type.id} + ${attribute.type.name}`}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 5,
                  paddingHorizontal: 16,
                  marginRight: 5,
                  borderRadius: 6,
                  backgroundColor: "green",
                }}
              >
                <Text style={{ textTransform: "capitalize" }}>
                  {attribute.type.name}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
