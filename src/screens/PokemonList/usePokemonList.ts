import { useState, useEffect } from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import { Pokemon } from "../../models/local";
import {
  PokemonListResponse,
  PokemonItem,
  PokemonAttributeResponse,
} from "../../models/server";
import {
  POKEMON_LIST,
  POKEMON_ATTRIBUTE,
  PokemonAttributeQueryVariables,
} from "./graphql";

export const usePokemonList = () => {
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
