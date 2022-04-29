import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { gql, useQuery } from "@apollo/client";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouteParams } from "../../navigation/useRoutes";
import { BaseName, Type } from "../../models/server";
import { TagList } from "../../components/TagList";
import { NavBackButton } from "../../components/NavBackButton";
import { Section } from "../../components/Section";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { getColorForAttribute } from "../../utils/getColorForAttribute";
import { Colors, Spacing } from "../../utils/theme";
import { clamp } from "../../utils/redash";

const POKEMON_DETAILS = gql`
  query Pokemon($name: String!) {
    pokemon(name: $name) {
      id
      height
      weight
      abilities {
        ability {
          name
        }
      }
      stats {
        base_stat
        stat {
          name
        }
      }
      moves {
        move {
          name
        }
      }
    }
  }
`;

type PokemonDetailQueryVariables = {
  name: string;
};

type PokemonDetailResponse = {
  pokemon: {
    id: number;
    height: number;
    weight: number;
    abilities: Ability[];
    stats: Stat[];
    moves: Move[];
  };
};

type Ability = {
  ability: BaseName;
};

type Stat = {
  base_stat: number;
  stat: BaseName;
};

type Move = {
  move: BaseName;
};

const EVOLUTION_CHAIN = gql`
  query Evolution($id: String!) {
    evolutionChain(id: $id) {
      response
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JSON = Record<string, any>;

type BaseResponse = {
  status: boolean;
  response: JSON;
};

type EvolutionChainQueryVariables = {
  id: string;
};

type EvolutionChainResponse = {
  evolutionChain: BaseResponse;
};

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
            <View>
              <About
                height={data.pokemon.height}
                weight={data.pokemon.weight}
                abilities={data.pokemon.abilities}
              />
              <EvolutionChain id={id} />
              <Moves moves={data.pokemon.moves} />
              <Stats stats={data.pokemon.stats} />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
};

type Species = {
  name: string;
  url: string;
};

type EvolvesTo = {
  species: Species;
  evolves_to: EvolvesTo[];
};

type Chain = {
  species: Species;
  evolves_to: EvolvesTo[];
};

type EvolvePokemon = {
  name: string;
  imgUri: string;
};

const EvolutionChain = ({ id }: { id: number }) => {
  const { loading, data } = useQuery<
    EvolutionChainResponse,
    EvolutionChainQueryVariables
  >(EVOLUTION_CHAIN, {
    variables: { id: `${Math.round((id + (id % 3)) / 3)}` },
  });

  const [chain, setChain] = useState<EvolvePokemon[]>();

  useEffect(() => {
    const chainForSpecies = (species: Species): EvolvePokemon => {
      const id = species.url.charAt(species.url.length - 2);
      return {
        name: species.name,
        imgUri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      };
    };

    if (!loading && data) {
      const chain = data.evolutionChain.response["chain"] as Chain;
      setChain([
        chainForSpecies(chain.species),
        chainForSpecies(chain.evolves_to[0].species),
        chainForSpecies(chain.evolves_to[0].evolves_to[0].species),
      ]);
    }
  }, [loading, data]);

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
          {chain.map(({ name, imgUri }, index) => {
            return (
              <View
                key={name}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      borderWidth: 1,
                      borderColor: Colors.BorderSubdued,
                      backgroundColor: Colors.SurfaceBackgroundPressed,
                    }}
                  >
                    <Image
                      source={{ uri: imgUri }}
                      style={{ width: 80, height: 80 }}
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

                {index < chain.length - 1 ? (
                  <Ionicons
                    name="ios-arrow-forward"
                    size={26}
                    color={Colors.IconNeutral}
                  />
                ) : null}
              </View>
            );
          })}
        </View>
      ) : null}
    </Section>
  );
};

const Moves = ({ moves }: { moves: Move[] }) => {
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
        <View style={{ marginRight: index < data.length - 1 ? Spacing.m : 0 }}>
          {item.map((move, index) => {
            return (
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

const Stats = ({ stats }: { stats: Stat[] }) => {
  return (
    <Section title="Base Stats" style={{ marginTop: Spacing.xl }}>
      {stats.map(({ stat, base_stat }) => {
        return <StatRow key={stat.name} name={stat.name} value={base_stat} />;
      })}
    </Section>
  );
};

const StatRow = ({ name, value }: { name: string; value: number }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: Spacing.m,
        marginHorizontal: Spacing.s,
      }}
    >
      <Text style={{ flex: 1, color: Colors.TextSubdued, fontSize: 16 }}>
        {localizedStatName[name]}
      </Text>
      <View
        style={{
          flexGrow: 3,
          borderRadius: 10,
          overflow: "hidden",
          backgroundColor: Colors.BorderSubdued,
        }}
      >
        <StatIndicator value={clamp(value, 0, 100)} />
      </View>
    </View>
  );
};

const StatIndicator = ({ value }: { value: number }) => {
  const [width, setWidth] = useState(0);
  const translateX = useSharedValue(-500);

  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  useEffect(() => {
    if (width > 0) {
      const percentage = value / 100;
      const normalized = width * (1 - percentage);
      translateX.value = withDelay(
        200,
        withSequence(
          withTiming(-width, { duration: 0 }),
          withTiming(0 - normalized, { duration: 2000 })
        )
      );
    }
  }, [translateX, value, width]);

  return (
    <Animated.View
      style={[
        {
          justifyContent: "center",
          alignItems: "flex-end",
          paddingHorizontal: Spacing.m,
          paddingVertical: 1,
          borderRadius: 10,
          backgroundColor: colorForStat(value),
        },
        aStyle,
      ]}
      onLayout={(e) => {
        if (width === 0) {
          setWidth(e.nativeEvent.layout.width);
        }
      }}
    >
      <Text>{value.toString()}</Text>
    </Animated.View>
  );
};

const localizedStatName: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP-ATK",
  "special-defense": "SP-DEF",
  speed: "SPD",
  total: "TOT",
};

const colorForStat = (stat: number) => {
  if (stat <= 50) {
    return Colors.SurfaceCritical;
  } else if (stat > 50 && stat < 80) {
    return Colors.SurfaceWarning;
  } else {
    return Colors.SurfaceSuccess;
  }
};

const About = ({
  height,
  weight,
  abilities,
}: {
  height: number;
  weight: number;
  abilities: Ability[];
}) => {
  return (
    <Section title="About">
      <Text style={{ fontSize: 14, marginBottom: Spacing.l }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Text>
      {/* TODO: figure out unit conversion */}
      <AboutRow title="Height" value={height.toString()} />
      <AboutRow title="Weight" value={weight.toString()} />
      <AboutRow
        title="Abilities"
        value={abilities.map((a) => a.ability.name).join(", ")}
      />
    </Section>
  );
};

const AboutRow = ({ title, value }: { title: string; value: string }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: Spacing.s,
        paddingVertical: Spacing.m,
      }}
    >
      <Text style={{ flex: 1, color: Colors.TextSubdued, fontSize: 16 }}>
        {title}
      </Text>
      <Text style={{ flex: 3, fontSize: 16, textTransform: "capitalize" }}>
        {value}
      </Text>
    </View>
  );
};

const Header = ({
  imgUri,
  name,
  id,
  attributes,
}: {
  imgUri: string;
  id: number;
  name: string;
  attributes: Type[];
}) => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: top + 50,
        paddingBottom: 30,
        paddingHorizontal: Spacing.defaultMargin,
      }}
    >
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          opacity: 0.5,
          backgroundColor: getColorForAttribute(attributes[0].type.name),
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ justifyContent: "center" }}>
          <Text
            style={{
              textTransform: "capitalize",
              fontSize: 30,
              fontWeight: "700",
              color: Colors.TextOnSurfacePrimary,
            }}
          >
            {name}
          </Text>
          <TagList
            style={{ marginTop: Spacing.m }}
            tags={attributes.map((a) => ({
              title: a.type.name,
              color: getColorForAttribute(a.type.name),
            }))}
          />
        </View>
        <Text
          style={{
            color: Colors.TextOnSurfacePrimary,
            fontSize: 16,
            marginBottom: Spacing.m,
          }}
        >
          {`#${String(id).padStart(3, "0")}`}
        </Text>
      </View>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: Spacing.m,
        }}
      >
        <Image
          source={{ uri: imgUri }}
          style={{ width: IMG_WIDTH, height: IMG_HEIGHT }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const IMG_WIDTH = Dimensions.get("window").width;
const IMG_HEIGHT = (IMG_WIDTH * 9) / 16;
