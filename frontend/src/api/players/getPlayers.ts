import type { Player } from "../../types";

export const getPlayers = async (): Promise<Player[]> => {
  try {
    const response = await fetch('http://localhost:3001/players');
    if (!response.ok) {
      throw new Error('Network error');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching players:', error);
    return [];
  }
};