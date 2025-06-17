export type Game = {
    id: number;
    name: string;
    minimumPlayers: number;
    maximumPlayers: number;
    players?: Player[];
}

export type Player = {
    id: number;
    name: string;
}