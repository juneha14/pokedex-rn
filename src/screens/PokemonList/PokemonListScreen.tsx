import React, { useCallback } from "react";
import { FlatList, FlatListProps } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
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

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

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
          scrollY={scrollY}
        />
      );
    },
    [onSelectPokemon, scrollY]
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
        <AnimatedFlatList
          keyExtractor={(item) => item.id.toString()}
          data={data}
          renderItem={renderItem}
          numColumns={2}
          scrollEventThrottle={16}
          onScroll={onScroll}
        />
      )}
    </SafeAreaView>
  );
};

const AnimatedFlatList =
  Animated.createAnimatedComponent<FlatListProps<Pokemon>>(FlatList);
