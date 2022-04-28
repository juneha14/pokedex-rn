import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouteParams } from "../../navigation/useRoutes";
import { BaseName, Type } from "../../models/server";
import { TagList } from "../../components/TagList";
import { NavBackButton } from "../../components/NavBackButton";
import { Section } from "../../components/Section";
import { getColorForAttribute } from "../../utils/getColorForAttribute";
import { Colors, Spacing } from "../../utils/theme";
import { LoadingIndicator } from "../../components/LoadingIndicator";

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
            </View>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
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
      {/* TODO: figure out unit conversion */}
      <AboutRow title="Height" value={String(height)} />
      <AboutRow title="Weight" value={String(weight)} />
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
        marginLeft: Spacing.s,
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
