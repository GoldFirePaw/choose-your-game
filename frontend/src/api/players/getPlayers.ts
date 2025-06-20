import type { Player } from "../../types";

export const getPlayers = async (): Promise<Player[]> => {
  const API = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await fetch(`${API}/players`);

    if (!response.ok) {
      throw new Error("Erreur serveur");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("❌ Erreur getPlayers:", error);
    return [];
  }
};
