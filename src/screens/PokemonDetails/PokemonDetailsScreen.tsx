import React from "react";
import { ScrollView, View } from "react-native";
import { useQuery } from "@apollo/client";
import { useRouteParams } from "../../navigation/useRoutes";
import { NavBackButton } from "../../components/NavBackButton";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { Colors, Spacing } from "../../utils/theme";
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

// header background scale when scrolling down
// header nav bar title animation
// bottom sheet animation
// pokemon list scroll up scale down opacity animation

export const PokemonDetailsScreen = () => {
  const {
    params: { imgUri, name, id, attributes },
  } = useRouteParams("PokemonDetails");

  const { loading, data } = useQuery<
    PokemonDetailResponse,
    PokemonDetailQueryVariables
  >(POKEMON_DETAILS, { variables: { name } });

  return (
    <>
      <NavBackButton />
      <ScrollView
        style={{ backgroundColor: Colors.SurfaceBackground }}
        contentContainerStyle={{ backgroundColor: Colors.SurfaceBackground }}
      >
        <Header imgUri={imgUri} name={name} id={id} attributes={attributes} />
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
      </ScrollView>
    </>
  );
};
