import { useState } from "react";
import type { Game, NewGame } from "../../types";
import { addGame } from "./addGame";

export const useAddGame = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitGame = async (game: NewGame): Promise<Game | null> => {
    setLoading(true);
    setError(null);

    const result = await addGame(game);

    if (!result) {
      setError("Impossible d’ajouter le jeu.");
    }

    setLoading(false);
    return result;
  };

  return { submitGame, loading, error };
};
