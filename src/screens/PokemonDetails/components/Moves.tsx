import React, { useCallback, useMemo } from "react";
import { View, Text, FlatList } from "react-native";
import { Section } from "../../../components/Section";
import { Move } from "../../../models/server";
import { Colors, Spacing } from "../../../utils/theme";

export const Moves = ({ moves }: { moves: Move[] }) => {
  const data = useMemo(() => {
    const names = moves.map((move) => move.move.name);
    const data: string[][] = [];

    while (names.length) {
      data.push(names.splice(0, 3));
    }
    return data;
  }, [moves]);

  const renderItem = useCallback(
    ({ item, index }: { item: string[]; index: number }) => {
      return (
        <View style={{ marginRight: index < data.length - 1 ? Spacing.l : 0 }}>
          {item.map((move, index) => {
            return (
              // Individual pill
              <View
                key={move}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: Spacing.m,
                  borderRadius: 30,
                  borderWidth: 1,
                  borderColor: Colors.BorderSubdued,
                  marginBottom: index < item.length - 1 ? Spacing.s : 0,
                }}
              >
                <Text>{move}</Text>
              </View>
            );
          })}
        </View>
      );
    },
    [data.length]
  );

  return (
    <Section title="Moves" style={{ marginTop: Spacing.xl }}>
      <FlatList
        keyExtractor={(_, index) => index.toString()}
        data={data}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </Section>
  );
};
