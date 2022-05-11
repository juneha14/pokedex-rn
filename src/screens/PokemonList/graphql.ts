import { gql } from "@apollo/client";
import { PokemonItem, Type } from "../../models/server";

export const POKEMON_LIST = gql`
  query PokemonList {
    pokemons(offset: 0) {
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

export const POKEMON_ATTRIBUTE = gql`
  query AttributeType($pokemonName: String!) {
    attributes: pokemon(name: $pokemonName) {
      id
      types {
        type {
          name
        }
      }
    }
  }
`;

export type PokemonListResponse = {
  pokemons: {
    status: boolean;
    message?: string;
    results: PokemonItem[];
  };
};

export type PokemonAttributeQueryVariables = {
  pokemonName: string;
};

export type PokemonAttributeResponse = {
  attributes: {
    types: Type[];
  };
};
