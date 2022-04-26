import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pokemon } from "../models/local";
import { PokemonListItem } from "./PokemonListItem";
import { usePokemonList } from "./usePokemonList";

// theme.ts file
// finalize UX
// id number formatted
// different colors for the attributes tag

export const PokemonListScreen = () => {
  const { loading, data } = usePokemonList();

  const renderItem = useCallback(
    ({ item, index }: { item: Pokemon; index: number }) => {
      return (
        <PokemonListItem
          id={item.id}
          name={item.name}
          imageUri={item.artwork}
          attributes={item.attributes}
          index={index}
        />
      );
    },
    []
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 5 }}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color="#0000ff" />
        </View>
      ) : (
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          data={data}
          renderItem={renderItem}
          numColumns={2}
        />
      )}
    </SafeAreaView>
  );
};
