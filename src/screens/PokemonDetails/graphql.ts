import { gql } from "@apollo/client";
import { Ability, Stat, Move, BaseResponse } from "../../models/server";

export const POKEMON_DETAILS = gql`
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

export type PokemonDetailQueryVariables = {
  name: string;
};

export type PokemonDetailResponse = {
  pokemon: {
    id: number;
    height: number;
    weight: number;
    abilities: Ability[];
    stats: Stat[];
    moves: Move[];
  };
};

export const EVOLUTION_CHAIN = gql`
  query Evolution($id: String!) {
    evolutionChain(id: $id) {
      response
    }
  }
`;

export type EvolutionChainQueryVariables = {
  id: string;
};

export type EvolutionChainResponse = {
  evolutionChain: BaseResponse;
};
