import { useState } from "react";
import { useGames } from "../api/games/useGames";
import { GameCard } from "./GameCard";
import s from "./GamesList.module.css";

export const GamesList = () => {
  const { games, loading } = useGames();
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  return (
    <div>
      <h1>Liste des jeux</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className={s.gamesListContainer}>
          {games.map((game) => (
            <GameCard
              key={game._id}
              game={game}
              isActive={activeGameId === game._id}
              setActiveGameId={setActiveGameId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
