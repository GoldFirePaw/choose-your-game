import { useGamesContext } from "../../contexts/gamesContext";

export const useGames = () => {
  const { games, loading } = useGamesContext();
  return { games, loading };
};