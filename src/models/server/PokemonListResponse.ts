import { PokemonItem } from "./PokemonItem";

export type PokemonListResponse = {
  pokemons: {
    status: boolean;
    message?: string;
    results: PokemonItem[];
  };
};
