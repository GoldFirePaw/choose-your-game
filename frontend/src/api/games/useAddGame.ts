import { useState } from 'react';
import { addGame } from '../api/addGame';
import type { Game } from '../../types';

export const useAddGame = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitGame = async (game: Omit<Game, 'id'>): Promise<Game | null> => {
    setLoading(true);
    setError(null);

    const result = await addGame(game);

    if (!result) {
      setError('Impossible d’ajouter le jeu.');
    }

    setLoading(false);
    return result;
  };

  return { submitGame, loading, error };
};