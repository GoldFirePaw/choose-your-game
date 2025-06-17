import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getGames } from "../api/games/getGames";
import { addGame as apiAddGame } from "../api/games/addGame";
import { deleteGame as apiDeleteGame } from "../api/games/deleteGame";
import type { Game, NewGame } from "../types";

type GamesContextType = {
  games: Game[];
  loading: boolean;
  addGame: (game: NewGame) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
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

  const addGame = async (game: NewGame) => {
    const newGame = await apiAddGame(game);
    if (newGame) {
      console.log("🧠 Insertion dans le contexte :", newGame);
      setGames((prev) => [...prev, newGame]);
    }
  };

  const deleteGame = async (id: string) => {
    const success = await apiDeleteGame(id);
    if (success) {
      console.log("✅ Jeu supprimé :", id);
      setGames((prev) => prev.filter((g) => g._id !== id));
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
    throw new Error("useGamesContext must be used within a <GamesProvider>");
  }
  return context;
};
