import type { Player } from "../../types";

export const getPlayers = async (): Promise<Player[]> => {
  const API = import.meta.env.VITE_API_BASE_URL;
  console.log("📡 Appel API:", `${API}/players`);

  try {
    const response = await fetch(`${API}/players`);
    console.log("↩️ Réponse brute:", response);

    if (!response.ok) {
      throw new Error("Erreur serveur");
    }

    const data = await response.json();
    console.log("✅ Données reçues (players):", data);

    return data;
  } catch (error) {
    console.error("❌ Erreur getPlayers:", error);
    return [];
  }
};
