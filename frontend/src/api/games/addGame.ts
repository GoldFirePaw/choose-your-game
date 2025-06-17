import type { Game } from "../../types";

export const addGame = async (game: Omit<Game, 'id'>): Promise<Game | null> => {
  try {
    const response = await fetch('http://localhost:3001/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(game),
    });

    if (!response.ok) {
      throw new Error('Failed to add game');
    }

    const newGame = await response.json();
    return newGame;
  } catch (error) {
    console.error('Error adding game:', error);
    return null;
  }
};