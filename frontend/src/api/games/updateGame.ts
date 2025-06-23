import type { Game } from "../../types";

export const updateGame = async (
  gameId: string,
  data: {
    name: string;
    minimumPlayers: number;
    maximumPlayers: number;
    players: string[];
  }
): Promise<Game | null> => {
  const API = import.meta.env.VITE_API_BASE_URL;

  try {
    console.log("🧠 updateGame() appelé pour :", gameId);

    const response = await fetch(`${API}/games/${gameId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur updateGame [${response.status}]:`, errorText);
      return null;
    }

    try {
      return await response.json(); // ✅ Sécurisé : on évite de planter si le body est vide
    } catch {
      return null;
    }
  } catch (error) {
    console.error("❌ Erreur réseau updateGame :", error);
    return null;
  }
};
