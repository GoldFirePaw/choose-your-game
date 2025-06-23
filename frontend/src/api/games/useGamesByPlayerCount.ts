import { useGamesContext } from "./../../contexts/gamesContext";

export const useGamesByPlayerCount = (count: number) => {
  const { games, loading } = useGamesContext();
  const filteredGames =
    count === 0
      ? games
      : games.filter(
          (g) => g.minimumPlayers <= count && g.maximumPlayers >= count
        );

  return { games: filteredGames, loading };
};
