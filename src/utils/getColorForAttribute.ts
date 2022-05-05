import { Colors } from "./theme";

const AllTypes = <const>[
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
  "unknown",
  "shadow",
];

type Attributes = typeof AllTypes[number];

const isAttribute = (type: string): type is Attributes => {
  return AllTypes.includes(type as Attributes);
};

export const getColorForAttribute = (type: string) => {
  if (isAttribute(type)) {
    return colorForAttributeType[type];
  } else {
    return Colors.SurfaceNeutral;
  }
};

export const getPokemonColorForAttribute = (type: string) => {
  if (isAttribute(type)) {
    return pokemonColorForAttributeType[type];
  } else {
    return Colors.SurfaceNeutral;
  }
};

const colorForAttributeType: Record<Attributes, string> = {
  normal: "#a4acaf",
  fighting: "#d56723",
  flying: "#3dc7ef",
  poison: "#b97fc9",
  ground: "#f7de3f",
  rock: "#a38c21",
  bug: "#729f3f",
  ghost: "#7b62a3",
  steel: "#9eb7b8",
  fire: "#fd7d24",
  water: "#4592c4",
  grass: "#9bcc50",
  electric: "#eed535",
  psychic: "#f366b9",
  ice: "#51c4e7",
  dragon: "#53a4cf",
  dark: "#707070",
  fairy: "#fdb9e9",
  unknown: "#B4B9BE",
  shadow: "#6C7075",
};

const pokemonColorForAttributeType: Record<Attributes, string> = {
  normal: "#cfd3d4",
  fighting: "#ffbd94",
  flying: "#96e4fa",
  poison: "#dabae3",
  ground: "#faefa5",
  rock: "#d6c887",
  bug: "#b0cf8c",
  ghost: "#bfadd9",
  steel: "#cad8d9",
  fire: "#fac198",
  water: "#a3cae3",
  grass: "#cbeb9b",
  electric: "#f2e58f",
  psychic: "#fcbbe1",
  ice: "#97e1f7",
  dragon: "#a8cde0",
  dark: "#b5b5b5",
  fairy: "#ffdef5",
  unknown: "#B4B9BE",
  shadow: "#aeb1b5",
};
