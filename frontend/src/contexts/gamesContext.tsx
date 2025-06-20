import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getGames } from "../api/games/getGames";
import { addGame as apiAddGame } from "../api/games/addGame";
import { deleteGame as apiDeleteGame } from "../api/games/deleteGame";
import {
  removePlayerFromGame as apiRemovePlayerFromGame,
  addPlayerToGame as apiAddPlayerToGame,
} from "../api/games/updatePlayers";
import type { Game, NewGame } from "../types";

type GamesContextType = {
  games: Game[];
  loading: boolean;
  addGame: (game: NewGame) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  refetchGames: () => Promise<void>;
  removePlayerFromGame: (playerId: string, gameId: string) => Promise<void>;
  addPlayerToGame: (gameId: string, playerId: string) => Promise<void>;
};

const GamesContext = createContext<GamesContextType | undefined>(undefined);

export const GamesProvider = ({ children }: { children: ReactNode }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const data = await getGames();
      setGames(data);
    } catch (error) {
      console.error("❌ Erreur fetchGames :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const addGame = async (game: NewGame) => {
    const newGame = await apiAddGame(game);
    if (newGame) {
      setGames((prev) => [...prev, newGame]);
    }
  };

  const deleteGame = async (id: string) => {
    const success = await apiDeleteGame(id);
    if (success) {
      setGames((prev) => prev.filter((g) => g._id !== id));
    }
  };

  const removePlayerFromGame = async (playerId: string, gameId: string) => {
    const success = await apiRemovePlayerFromGame(gameId, playerId);
    if (success) {
      await fetchGames();
    }
  };

  const addPlayerToGame = async (gameId: string, playerId: string) => {
    const success = await apiAddPlayerToGame(gameId, playerId);
    if (success) {
      await fetchGames();
    }
  };

  return (
    <GamesContext.Provider
      value={{
        games,
        loading,
        addGame,
        deleteGame,
        refetchGames: fetchGames,
        removePlayerFromGame,
        addPlayerToGame,
      }}
    >
      {children}
    </GamesContext.Provider>
  );
};

export const useGamesContext = () => {
  const context = useContext(GamesContext);
  if (!context) {
    throw new Error("useGamesContext must be used within a <GamesProvider>");
  }
  return context;
};
