export const addPlayerToGame = async (
  gameId: string,
  playerId: string
): Promise<boolean> => {
  const API = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await fetch(`${API}/games/${gameId}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error adding player to game:", error);
    return false;
  }
};

export const removePlayerFromGame = async (
  gameId: string,
  playerId: string
): Promise<boolean> => {
  const API = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await fetch(`${API}/games/${gameId}/players/${playerId}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Error removing player from game:", error);
    return false;
  }
};
