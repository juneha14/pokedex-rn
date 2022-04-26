import { Type } from "./Type";

export type PokemonAttributeResponse = {
  pokemon: {
    types: Type[];
  };
};
