import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";
import { gql, useApolloClient, useQuery } from "@apollo/client";
import { SafeAreaView } from "react-native-safe-area-context";

export const PokemonListScreen = () => {
  const { loading, data } = usePokemonList();

  const renderItem = useCallback(
    ({ item, index }: { item: Pokemon; index: number }) => {
      return (
        <View
          style={{
            width: WIDTH,
            marginRight: index % 2 === 0 ? 4 : 0,
            marginBottom: 4,
            borderRadius: 10,
            overflow: "hidden",
            backgroundColor: "orange",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "pink",
            }}
          >
            <Image
              source={{ uri: item.artwork }}
              style={{ width: IMG_SIZE, height: IMG_SIZE }}
              resizeMode="cover"
            />
          </View>
          <View
            style={{
              paddingHorizontal: 4,
              paddingBottom: 8,
              marginTop: 8,
            }}
          >
            <Text>{item.id}</Text>
            <Text style={{ textTransform: "capitalize" }}>{item.name}</Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              {item.attributes.map((attribute) => {
                return (
                  <View
                    key={`${attribute.type.id} + ${attribute.type.name}`}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 5,
                      paddingHorizontal: 16,
                      marginRight: 5,
                      borderRadius: 6,
                      backgroundColor: "green",
                    }}
                  >
                    <Text style={{ textTransform: "capitalize" }}>
                      {attribute.type.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
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

const usePokemonList = () => {
  const client = useApolloClient();
  const pokemons = useQuery<PokemonListResponse>(POKEMON_LIST);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchAttributes = async (pokemons: PokemonItem[]) => {
      const attributedPokemons: Pokemon[] = [];

      for (let i = 0; i < pokemons.length; i++) {
        const pokemon = pokemons[i];

        const attribute = await client.query<
          PokemonAttributeResponse,
          PokemonAttributeQueryVariables
        >({
          query: POKEMON_ATTRIBUTE,
          variables: { pokemonName: pokemon.name },
          notifyOnNetworkStatusChange: false,
        });

        if (!attribute.loading && attribute.data) {
          attributedPokemons.push({
            ...pokemon,
            attributes: attribute.data.pokemon.types,
          });
        }
      }

      return attributedPokemons;
    };

    if (!pokemons.loading && pokemons.data) {
      fetchAttributes(pokemons.data.pokemons.results).then((p) => {
        setLoading(false);
        setData(p);
      });
    }
  }, [client, pokemons.data, pokemons.loading]);

  return {
    loading,
    data,
  };
};

const WIDTH = (Dimensions.get("window").width - 2 * 5) / 2 - 2;
const IMG_SIZE = WIDTH * 0.7;

const POKEMON_LIST = gql`
  query PokemonList {
    pokemons {
      status
      message
      results {
        id
        name
        artwork
      }
    }
  }
`;

const POKEMON_ATTRIBUTE = gql`
  query AttributeType($pokemonName: String!) {
    pokemon(name: $pokemonName) {
      types {
        type {
          name
        }
      }
    }
  }
`;

// Local models

interface Pokemon extends PokemonItem {
  attributes: Type[];
}

// GraphQL server models

type PokemonAttributeQueryVariables = {
  pokemonName: string;
};

type PokemonListResponse = {
  pokemons: {
    status: boolean;
    message?: string;
    results: PokemonItem[];
  };
};

type PokemonAttributeResponse = {
  pokemon: {
    types: Type[];
  };
};

type PokemonItem = {
  id: number;
  name: string;
  artwork: string;
};

type BaseList = {
  status?: boolean;
  message?: string;
  results: BaseName[];
};

type BaseName = {
  id: number;
  name: string;
};

type Type = {
  type: BaseName;
};
