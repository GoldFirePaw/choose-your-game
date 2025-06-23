import { useState } from "react";
import s from "./GamesList.module.css";
import { useGamesContext } from "../../contexts/gamesContext";
import { Card } from "../Card/Card";

export const GamesList = () => {
  const { games, loading } = useGamesContext();
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  return (
    <div>
      <h1>Liste des jeux</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className={s.gamesListContainer}>
          {games.map((game) => (
            <Card
              content={"gameCard"}
              key={game._id}
              gameId={game._id}
              isActive={activeGameId === game._id}
              setActiveGameId={setActiveGameId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
