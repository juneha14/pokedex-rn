import React, { useCallback } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { PokemonListItem } from "./PokemonListItem";
import { usePokemonList } from "./usePokemonList";
import { Pokemon } from "../../models/local";
import { Colors, Spacing } from "../../utils/theme";
import { useRouteNavigation } from "../../navigation/useRoutes";

export const PokemonListScreen = () => {
  const { loading, data } = usePokemonList();
  const { navigate } = useRouteNavigation();

  const onSelectPokemon = useCallback(
    (pokemon: Pokemon) => () => {
      navigate("PokemonDetails", { ...pokemon, imgUri: pokemon.artwork });
    },
    [navigate]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Pokemon; index: number }) => {
      return (
        <PokemonListItem
          id={item.id}
          name={item.name}
          imageUri={item.artwork}
          attributes={item.attributes}
          index={index}
          onPress={onSelectPokemon(item)}
        />
      );
    },
    [onSelectPokemon]
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: Spacing.s,
        backgroundColor: Colors.SurfaceBackground,
      }}
    >
      {loading ? (
        <LoadingIndicator />
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
