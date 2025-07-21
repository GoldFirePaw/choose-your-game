import type { Game, NewGame } from "../../types";
import { clearGamesCache } from "./getGames";

export const addGame = async (game: NewGame): Promise<Game | null> => {
  const API = import.meta.env.VITE_API_BASE_URL;

  console.log("🔍 API utilisée :", API);

  try {
    const response = await fetch(`${API}/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    });

    if (!response.ok) {
      throw new Error("Failed to add game");
    }

    const newGame = await response.json();
    console.log("📬 Réponse reçue de l'API :", newGame);

    // Clear cache so next fetch gets fresh data
    clearGamesCache();

    return newGame;
  } catch (error) {
    console.error("Error adding game:", error);
    return null;
  }
};
