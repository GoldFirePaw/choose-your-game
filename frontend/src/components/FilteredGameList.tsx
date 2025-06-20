import { useState } from "react";

import { SelectedPlayersFilter } from "./SelectedPlayersFilter";
import { useGamesContext } from "../contexts/gamesContext";
import type { Game, Player } from "../types";

export const FilteredGameList = () => {
  const { games, loading } = useGamesContext();
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const playerCount = selectedPlayers.length;

  const filteredGames =
    playerCount === 0
      ? []
      : games.filter((game: Game) => {
          const ownedByAll = selectedPlayers.every((p) =>
            game.players?.includes(p._id)
          );
          const compatiblePlayerCount =
            game.minimumPlayers <= playerCount &&
            playerCount <= game.maximumPlayers;

          return ownedByAll && compatiblePlayerCount;
        });

  return (
    <div>
      <SelectedPlayersFilter
        selected={selectedPlayers}
        onChange={setSelectedPlayers}
      />

      <h2>
        Jeux compatibles avec {playerCount} joueur{playerCount > 1 ? "s" : ""}
      </h2>
      {loading ? (
        <p>Chargement des jeux...</p>
      ) : filteredGames.length > 0 ? (
        filteredGames.map((game) => <div> {game.name} </div>)
      ) : (
        <p>Aucun jeu compatible pour ce groupe 😢</p>
      )}
    </div>
  );
};
