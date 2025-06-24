import { useGamesContext } from "../../contexts/gamesContext";
import { GamePlayersCheckboxes } from "../GamePlayersCheckboxes/GamePlayersCheckboxes";
import s from "./GameCard.module.css";
import { Button, SecondaryButton } from "../Buttons/Button";

type Props = {
  gameId: string;
  isActive: boolean;
  setActiveGameId: (id: string | null) => void;
};

export const GameCard = ({ isActive, setActiveGameId, gameId }: Props) => {
  const { deleteGame, games } = useGamesContext();

  const game = games.find((g) => g._id === gameId);

  if (!game) {
    return <p>Jeu non trouvé.</p>;
  }
  return (
    <>
      <div className={s.gameCard}>
        <span className={s.title}>{game.name}</span>
        <p className={s.playersInfo}>
          Joueurs : {game.minimumPlayers}–{game.maximumPlayers}
        </p>
        <div className={s.buttonsRow}>
          <Button
            label={"Editer"}
            onClick={() => setActiveGameId(isActive ? null : game._id)}
          />
          <SecondaryButton
            label="✖️"
            onClick={() => {
              deleteGame(game._id);
            }}
          />
        </div>
      </div>

      {isActive && (
        <GamePlayersCheckboxes
          key={game._id + "-modal"}
          gameId={game._id}
          setDisplayPlayers={() => setActiveGameId(null)}
        />
      )}
    </>
  );
};
