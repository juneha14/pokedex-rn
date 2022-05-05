import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@apollo/client";
import { useRouteNavigation, useRouteParams } from "../../navigation/useRoutes";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getPokemonColorForAttribute } from "../../utils/getColorForAttribute";

// header background scale when scrolling down
// header nav bar title animation
// bottom sheet animation
// pokemon list scroll up scale down opacity animation

const NavigationHeader = ({ backgroundColor }: { backgroundColor: string }) => {
  const { pop } = useRouteNavigation();
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 44 + top,
        paddingTop: top,
        paddingHorizontal: Spacing.defaultMargin,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor,
        zIndex: 1,
      }}
    >
      <Pressable onPress={() => pop()}>
        <Ionicons name="ios-arrow-back" size={26} color={Colors.IconNeutral} />
      </Pressable>
    </View>
  );
};

export const PokemonDetailsScreen = () => {
  const { top } = useSafeAreaInsets();

  const {
    params: { imgUri, name, id, attributes },
  } = useRouteParams("PokemonDetails");

  const { loading, data } = useQuery<
    PokemonDetailResponse,
    PokemonDetailQueryVariables
  >(POKEMON_DETAILS, { variables: { name } });

  return (
    <>
      <NavigationHeader
        backgroundColor={getPokemonColorForAttribute(attributes[0].type.name)}
      />
      <ScrollView
        style={{
          backgroundColor: Colors.SurfaceBackground,
        }}
        contentContainerStyle={{
          marginTop: 44 + top,
          backgroundColor: Colors.SurfaceBackground,
        }}
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
