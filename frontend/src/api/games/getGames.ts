import type { Game } from "../../types";

export const getGames = async (): Promise<Game[]> => {
  const API = import.meta.env.VITE_API_BASE_URL;
  console.log("📡 Appel API:", `${API}/games`);

  try {
    const response = await fetch(`${API}/games`);
    console.log("↩️ Réponse brute:", response);

    if (!response.ok) {
      throw new Error("Erreur serveur");
    }

    const data = await response.json();
    console.log("✅ Données reçues:", data);

    return data;
  } catch (error) {
    console.error("❌ Erreur getGames:", error);
    return [];
  }
};
