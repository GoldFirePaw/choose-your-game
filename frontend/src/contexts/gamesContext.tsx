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
  addGame: (game: NewGame) => Promise<Game | null>;
  deleteGame: (
    id: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  refetchGames: () => Promise<void>;
  forceRefresh: () => Promise<void>;
  updateGame: (
    id: string,
    updatedGame: {
      name: string;
      minimumPlayers: number;
      maximumPlayers: number;
      players: string[];
      isNavGame?: boolean;
    }
  ) => Promise<void>;
};

const GamesContext = createContext<GamesContextType | undefined>(undefined);

export const GamesProvider = ({ children }: { children: ReactNode }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const fetchGames = async (force = false) => {
    // Only fetch if forced or if it's been more than 5 minutes since last fetch
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetch;
    const FIVE_MINUTES = 5 * 60 * 1000;

    if (!force && timeSinceLastFetch < FIVE_MINUTES && games.length > 0) {
      console.log("🚫 Skipping fetch - too recent");
      return;
    }

    // Only show loading state if we have no games yet (initial load)
    if (games.length === 0) {
      setLoading(true);
    }

    const startTime = Date.now();
    console.log("⏱️ Starting fetch games...");

    const data = await getGames();
    const fetchTime = Date.now() - startTime;
    console.log(
      `🎯 Données fetchées du backend en ${fetchTime}ms:`,
      data.length,
      "games"
    );

    setGames(data);
    setLastFetch(now);
    setLoading(false);
  };

  useEffect(() => {
    fetchGames(true); // Force initial fetch
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Only fetch if page is visible AND it's been more than 5 minutes
      if (document.visibilityState === "visible") {
        fetchGames(false); // Non-forced fetch (will check timing)
      }
    }, 5 * 60 * 1000); // Check every 5 minutes instead of 1 minute

    return () => clearInterval(interval);
  }, [lastFetch]);

  // Handle page visibility changes more intelligently
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Only fetch if page was hidden for more than 10 minutes
        const now = Date.now();
        const timeSinceLastFetch = now - lastFetch;
        const TEN_MINUTES = 10 * 60 * 1000;

        if (timeSinceLastFetch > TEN_MINUTES) {
          console.log("📱 Page visible after long time - refreshing data");
          fetchGames(true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [lastFetch]);

  const addGame = async (game: NewGame): Promise<Game | null> => {
    const newGame = await apiAddGame(game);
    if (newGame) {
      console.log("🧠 Insertion dans le contexte :", newGame);
      setGames((prev) => [...prev, newGame]);
    }
    return newGame;
  };

  const updateGame = async (id: string, updatedGame: GameUpdatePayload) => {
    const updated = await apiUpdateGame(id, updatedGame);
    console.log("📦 Réponse backend après updateGame :", updated);

    if (updated) {
      console.log("✅ Updating game in local state immediately");
      setGames((prev) =>
        prev.map((game) => (game._id === id ? updated : game))
      );
    }
  };

  const deleteGame = async (
    id: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const result = await apiDeleteGame(id, password);
    if (result.success) {
      console.log("✅ Jeu supprimé :", id);
      setGames((prev) => prev.filter((g) => g._id !== id));
    }
    return result;
  };

  return (
    <GamesContext.Provider
      value={{
        games,
        loading,
        addGame,
        deleteGame,
        refetchGames: () => fetchGames(false),
        forceRefresh: () => fetchGames(true),
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
