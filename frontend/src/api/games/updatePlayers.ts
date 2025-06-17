export const addPlayerToGame = async (gameId: number, playerId: number): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:3001/games/${gameId}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error adding player to game:', error);
    return false;
  }
};

export const removePlayerFromGame = async (gameId: number, playerId: number): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:3001/games/${gameId}/players/${playerId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error removing player from game:', error);
    return false;
  }
};