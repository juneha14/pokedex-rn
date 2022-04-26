import { gql } from "@apollo/client";

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
    pokemon(name: $pokemonName) {
      types {
        type {
          name
        }
      }
    }
  }
`;

export type PokemonAttributeQueryVariables = {
  pokemonName: string;
};
