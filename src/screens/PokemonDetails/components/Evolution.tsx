import React, { useEffect, useState } from "react";
import { Dimensions, Image, View, Text } from "react-native";
import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import {
  EvolutionChainResponse,
  EvolutionChainQueryVariables,
  EVOLUTION_CHAIN,
} from "../graphql";
import { Chain } from "../../../models/server";
import { Section } from "../../../components/Section";
import { Colors, Spacing } from "../../../utils/theme";

export const EvolutionChain = ({ id }: { id: number }) => {
  const { chain } = useEvolutionChain(id);

  return (
    <Section title="Evolution" style={{ marginTop: Spacing.xl }}>
      {chain ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: Spacing.m,
          }}
        >
          {chain.map(({ name, imgUri, minimumLevel }) => {
            return (
              <View
                key={name}
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                {/* Evolution arrow */}
                {minimumLevel ? (
                  <View
                    style={{
                      position: "absolute",
                      right: 90,
                      justifyContent: "center",
                      alignItems: "center",
                      width:
                        (Dimensions.get("window").width -
                          2 * Spacing.defaultMargin -
                          3 * 90) /
                        2,
                    }}
                  >
                    <Ionicons
                      name="ios-arrow-forward-outline"
                      size={26}
                      color={Colors.IconNeutral}
                    />
                    <Text style={{ color: Colors.TextSubdued, fontSize: 11 }}>
                      {`Lvl ${minimumLevel}`}
                    </Text>
                  </View>
                ) : null}

                {/* Pokemon image and name */}
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: 90,
                      height: 90,
                      borderRadius: 90 / 2,
                      borderWidth: 1,
                      borderColor: Colors.BorderSubdued,
                      backgroundColor: Colors.SurfaceBackgroundPressed,
                    }}
                  >
                    <Image
                      source={{ uri: imgUri }}
                      style={{ width: 70, height: 70 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    style={{
                      textTransform: "capitalize",
                      marginTop: Spacing.m,
                      color: Colors.TextOnSurfaceNeutral,
                    }}
                  >
                    {name}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
    </Section>
  );
};

const useEvolutionChain = (id: number) => {
  const { loading, data } = useQuery<
    EvolutionChainResponse,
    EvolutionChainQueryVariables
  >(EVOLUTION_CHAIN, {
    variables: { id: `${Math.round((id + (id % 3)) / 3)}` },
  });

  const [chain, setChain] = useState<Pokemon[]>();

  useEffect(() => {
    if (!loading && data) {
      const chain = data.evolutionChain.response["chain"] as Chain;
      setChain([
        getPokemonForChain(chain),
        getPokemonForChain(chain.evolves_to[0]),
        getPokemonForChain(chain.evolves_to[0].evolves_to[0]),
      ]);
    }
  }, [loading, data]);

  return { chain };
};

const getPokemonForChain = (chain: Chain): Pokemon => {
  const id = extractIdFromUrl(chain.species.url);
  const minLevel =
    chain.evolution_details.length > 0
      ? chain.evolution_details[0].min_level
      : undefined;

  return {
    name: chain.species.name,
    imgUri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    minimumLevel: minLevel,
  };
};

const extractIdFromUrl = (url: string) => {
  const id: string[] = [];
  for (let i = url.length - 1; i >= 0; i--) {
    const char = url.charAt(i);
    const num = Number(char);
    if (num || num === 0) {
      id.push(char);
    } else if (char === "/" && id.length > 0) {
      break;
    }
  }

  const res = id.reverse().reduce((prev, curr) => prev + curr, "");
  return res;
};

type Pokemon = {
  name: string;
  imgUri: string;
  minimumLevel?: number;
};
