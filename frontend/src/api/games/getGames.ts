import type { Game } from "../../types";

export const getGames = async (): Promise<Game[]> => {
  const API = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await fetch(`${API}/games`);

    if (!response.ok) {
      throw new Error("Erreur serveur");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Erreur getGames:", error);
    return [];
  }
};
