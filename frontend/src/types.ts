export type Game = {
  id: string;
  name: string;
  minimumPlayers: number;
  maximumPlayers: number;
  players?: Player[];
};

export type Player = {
  id: string;
  name: string;
};
