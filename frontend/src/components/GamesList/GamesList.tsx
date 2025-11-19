import React, { useState } from "react";
import s from "./GamesList.module.css";
import { useGamesContext } from "../../contexts/gamesContext";
import { GameCard } from "../GameCard/GameCard";
import { LoadingSkeleton } from "../LoadingSkeleton/LoadingSkeleton";

export const GamesList: React.FC = () => {
  const { games, loading } = useGamesContext();
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGames = [...games]
    .filter((game) =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={s.wrapper}>
      <h1 className={s.title} id="games-list">
        Liste des jeux
      </h1>

      <input
        type="text"
        placeholder="Rechercher un jeu"
        className={s.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <LoadingSkeleton count={8} />
      ) : filteredGames.length === 0 ? (
        <p className={s.noGames}>
          {searchTerm
            ? `Aucun jeu trouvé pour "${searchTerm}"`
            : "Aucun jeu disponible"}
        </p>
      ) : (
        <div className={s.gamesListContainer}>
          {filteredGames.map((game) => (
            <GameCard
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
