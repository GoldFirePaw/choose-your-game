import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getGames } from "../api/games/getGames";
import { addGame as apiAddGame } from "../api/games/addGame";
import { deleteGame as apiDeleteGame } from "../api/games/deleteGame";
import { updateGame as apiUpdateGame } from "../api/games/updateGame";
import type { Game, NewGame, GameUpdatePayload } from "../types";

type GamesContextType = {
  games: Game[];
  loading: boolean;
  addGame: (game: NewGame) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  refetchGames: () => Promise<void>;
  updateGame: (
    id: string,
    updatedGame: {
      name: string;
      minimumPlayers: number;
      maximumPlayers: number;
      players: string[];
    }
  ) => Promise<void>;
};

const GamesContext = createContext<GamesContextType | undefined>(undefined);

export const GamesProvider = ({ children }: { children: ReactNode }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    setLoading(true);
    const data = await getGames();
    console.log("🎯 Données fetchées du backend :", data); // <= ICI
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

  const updateGame = async (id: string, updatedGame: GameUpdatePayload) => {
    const updated = await apiUpdateGame(id, updatedGame);
    console.log("📦 Réponse backend après updateGame :", updated);

    if (updated) {
      console.log("📦 updateGame terminé, on refetch...");
      fetchGames();
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
      value={{
        games,
        loading,
        addGame,
        deleteGame,
        refetchGames: fetchGames,
        updateGame,
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
