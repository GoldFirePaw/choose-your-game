import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { getGames } from '../api/games/getGames';
import { addGame as apiAddGame } from '../api/games/addGame';
import { deleteGame as apiDeleteGame } from '../api/games/deleteGame';
import type { Game } from '../types';

type GamesContextType = {
  games: Game[];
  loading: boolean;
  addGame: (game: Omit<Game, 'id'>) => Promise<void>;
  deleteGame: (id: number) => Promise<void>;
  refetchGames: () => Promise<void>;
};

const GamesContext = createContext<GamesContextType | undefined>(undefined);

export const GamesProvider = ({ children }: { children: ReactNode }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    setLoading(true);
    const data = await getGames();
    setGames(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const addGame = async (game: Omit<Game, 'id'>) => {
    const newGame = await apiAddGame(game);
    if (newGame) {
      setGames((prev) => [...prev, newGame]);
    }
  };

  const deleteGame = async (id: number) => {
    const success = await apiDeleteGame(id);
    if (success) {
      setGames((prev) => prev.filter((g) => g.id !== id));
    }
  };

  return (
    <GamesContext.Provider
      value={{ games, loading, addGame, deleteGame, refetchGames: fetchGames }}
    >
      {children}
    </GamesContext.Provider>
  );
};

export const useGamesContext = () => {
  const context = useContext(GamesContext);
  if (!context) {
    throw new Error('useGamesContext must be used within a <GamesProvider>');
  }
  return context;
};