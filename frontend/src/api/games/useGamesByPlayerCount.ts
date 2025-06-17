import { useGames } from './useGames';

export const useGamesByPlayerCount = (count: number) => {
  const { games, loading } = useGames();
  const filteredGames = count === 0
    ? games
    : games.filter(
        (g) => g.minimumPlayers <= count && g.maximumPlayers >= count
      );

  return { games: filteredGames, loading };
};