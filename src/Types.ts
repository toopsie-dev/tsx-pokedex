export type ThemeType = "light" | "dark";

export type PokemonType = {
  name: string;
  url: string;
};

export type SelectedPokemonType = {
  index: number;
  name: string;
  url: string;
};

export type CapturedPokemonType = {
  index: number;
  name: string;
  url: string;
  nickname: string;
  date: string;
};
