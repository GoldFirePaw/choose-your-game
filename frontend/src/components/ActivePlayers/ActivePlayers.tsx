import { usePlayerContext } from "../../contexts/playersContext";
import type { Player } from "../../types";
import s from "./ActivePlayers.module.css";
import { SecondaryButton } from "../Buttons/Button";

type Props = {
  selected: Player[];
  onChange: (players: Player[]) => void;
};

export const ActivePlayers = ({ selected, onChange }: Props) => {
  const { players, deletePlayer } = usePlayerContext();

  const toggle = (player: Player) => {
    const isSelected = selected.some((p) => p._id === player._id);
    const newSelection = isSelected
      ? selected.filter((p) => p._id !== player._id)
      : [...selected, player];

    onChange(newSelection);
  };

  return (
    <div>
      <h3>Joueurs présents</h3>
      <div className={s.playersContainer}>
        {players.map((player) => (
          <div className={s.playerContainer} key={player._id}>
            <label>
              <input
                type="checkbox"
                checked={selected.some((p) => p._id === player._id)}
                onChange={() => toggle(player)}
              />
            </label>
            <div onClick={() => console.log("show details")}>{player.name}</div>
            <SecondaryButton
              onClick={() => deletePlayer(player._id)}
              label={"✖️"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
