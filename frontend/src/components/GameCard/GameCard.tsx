import { useGamesContext } from "../../contexts/gamesContext";
import { GamePlayersCheckboxes } from "../GamePlayersCheckboxes/GamePlayersCheckboxes";
import type { Game } from "../../types";
import s from "./GameCard.module.css";
import { Button, SecondaryButton } from "../Buttons/Button";

type Props = {
  game: Game;
  isActive: boolean;
  setActiveGameId: (id: string | null) => void;
};

export const GameCard = ({ game, isActive, setActiveGameId }: Props) => {
  const { deleteGame } = useGamesContext();
  console.log("🧾 Affichage carte jeu :", game);

  return (
    <>
      <div>
        <h3 className={s.title}>{game.name}</h3>
        <p>
          Joueurs : {game.minimumPlayers}–{game.maximumPlayers}
        </p>
        <Button
          label={`${isActive ? "Hide" : "Show"} players`}
          onClick={() => setActiveGameId(isActive ? null : game._id)}
        />
        <SecondaryButton
          label="✖️"
          onClick={() => {
            game._id && deleteGame(game._id);
          }}
        />
      </div>

      {isActive && (
        <GamePlayersCheckboxes
          gameId={game._id}
          setDisplayPlayers={() => setActiveGameId(null)}
        />
      )}
    </>
  );
};
