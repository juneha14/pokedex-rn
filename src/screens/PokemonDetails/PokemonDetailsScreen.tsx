import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useQuery } from "@apollo/client";
import { useRouteParams } from "../../navigation/useRoutes";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { Colors, Spacing } from "../../utils/theme";
import { NavigationHeader } from "./components/NavigationHeader";
import { Header } from "./components/Header";
import { About } from "./components/About";
import { Stats } from "./components/Stats";
import { Moves } from "./components/Moves";
import { EvolutionChain } from "./components/Evolution";
import {
  PokemonDetailQueryVariables,
  PokemonDetailResponse,
  POKEMON_DETAILS,
} from "./graphql";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getPokemonColorForAttribute } from "../../utils/getColorForAttribute";

// bottom sheet animation
// pokemon list scroll up scale down opacity animation

export const PokemonDetailsScreen = () => {
  const { top } = useSafeAreaInsets();

  const {
    params: { imgUri, name, id, attributes },
  } = useRouteParams("PokemonDetails");

  const { loading, data } = useQuery<
    PokemonDetailResponse,
    PokemonDetailQueryVariables
  >(POKEMON_DETAILS, { variables: { name } });

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  return (
    <>
      <NavigationHeader
        backgroundColor={getPokemonColorForAttribute(attributes[0].type.name)}
        title={name}
        scrollY={scrollY}
      />
      <Animated.ScrollView
        style={{
          backgroundColor: Colors.SurfaceBackground,
        }}
        contentContainerStyle={{
          marginTop: 44 + top,
          backgroundColor: Colors.SurfaceBackground,
        }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <Header
          imgUri={imgUri}
          name={name}
          id={id}
          attributes={attributes}
          scrollY={scrollY}
        />
        <View
          style={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            marginTop: -30,
            paddingTop: 30,
            paddingBottom: 30,
            paddingHorizontal: Spacing.defaultMargin,
            backgroundColor: Colors.SurfaceBackground,
          }}
        >
          {loading ? (
            <LoadingIndicator />
          ) : data ? (
            <>
              <About
                height={data.pokemon.height}
                weight={data.pokemon.weight}
                abilities={data.pokemon.abilities}
              />
              <Stats stats={data.pokemon.stats} />
              <EvolutionChain id={id} />
              <Moves moves={data.pokemon.moves} />
            </>
          ) : null}
        </View>
      </Animated.ScrollView>
    </>
  );
};
