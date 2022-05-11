export type Chain = {
  species: Species;
  evolves_to: Chain[];
  evolution_details: EvolutionDetails[];
};

type Species = {
  name: string;
  url: string;
};

type EvolutionDetails = {
  min_level: number;
};
