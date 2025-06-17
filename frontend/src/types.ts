export type Game = {
  _id: string;
  name: string;
  minimumPlayers: number;
  maximumPlayers: number;
  players?: Player[];
};

export type Player = {
  _id: string;
  name: string;
};

export type NewGame = {
  name: string;
  minimumPlayers: number;
  maximumPlayers: number;
  players: Player[];
};
