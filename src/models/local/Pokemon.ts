import { PokemonItem, Type } from "../server";

export interface Pokemon extends PokemonItem {
  attributes: Type[];
}
