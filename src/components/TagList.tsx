import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Tag, TagProps } from "./Tag";

export const TagList = ({
  tags,
  style,
}: {
  tags: TagProps[];
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View
      style={[
        {
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "center",
        },
        style,
      ]}
    >
      {tags.map((tag) => {
        return <Tag key={tag.title} {...tag} />;
      })}
    </View>
  );
};
