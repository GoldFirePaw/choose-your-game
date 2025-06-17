import { useGamesContext } from "../contexts/gamesContext";
import type { Game } from "../types";
import { GamePlayersCheckboxes } from "./GamePlayersCheckboxes";
import s from "./GameCard.module.css";

type Props = {
  game: Game;
  isActive: boolean;
  setActiveGameId: (id: number | null) => void;
};

export const GameCard = ({ game, isActive, setActiveGameId }: Props) => {
  const { deleteGame } = useGamesContext();

  return (
    <div className={s.gameCardContainer}>
      <div
        style={{ border: "1px solid #ccc", margin: "1rem", padding: "1rem" }}
      >
        <h3>{game.name}</h3>
        <p>
          Joueurs : {game.minimumPlayers}–{game.maximumPlayers}
        </p>
        <button onClick={() => setActiveGameId(isActive ? null : game.id)}>
          {isActive ? "Hide" : "Show"} players
        </button>
        <button
          onClick={() => deleteGame(game.id)}
          style={{ backgroundColor: "red", color: "white" }}
        >
          Supprimer
        </button>
      </div>

      {isActive && (
        <GamePlayersCheckboxes
          game={game}
          setDisplayPlayers={() => setActiveGameId(null)}
        />
      )}
    </div>
  );
};
