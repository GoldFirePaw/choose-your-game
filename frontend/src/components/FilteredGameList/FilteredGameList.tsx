import { useGamesContext } from "../../contexts/gamesContext";
import type { Game } from "../../types";
import s from "./FilteredGameList.module.css";

type FilteredGameListProps = {
  selectedPlayers: { _id: string }[];
};

export const FilteredGameList = ({
  selectedPlayers,
}: FilteredGameListProps) => {
  const { games, loading } = useGamesContext();

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
    <div className={s.container}>
      <h2 className={s.title}>
        Jeux compatibles avec {playerCount} joueur{playerCount > 1 ? "s" : ""}
      </h2>
      {loading ? (
        <p className={s.loading}>Chargement des jeux...</p>
      ) : filteredGames.length > 0 ? (
        filteredGames.map((game) => (
          <div key={game._id} className={s.gameItem}>
            {game.name}
          </div>
        ))
      ) : (
        <p className={s.noResults}>Aucun jeu compatible pour ce groupe 😢</p>
      )}
    </div>
  );
};
