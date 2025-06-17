import type { Player } from "../../types";

export const getPlayers = async (): Promise<Player[]> => {
  const API = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await fetch(`${API}/players`);
    if (!response.ok) {
      throw new Error("Network error");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
};
