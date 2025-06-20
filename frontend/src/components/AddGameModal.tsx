import { useState } from "react";
import { useGamesContext } from "../contexts/gamesContext";
import s from "./AddGameModal.module.css";
import { usePlayerContext } from "../contexts/playersContext";

export const AddGameModal = ({ onClose }: { onClose: () => void }) => {
  const { addGame } = useGamesContext();
  const [name, setName] = useState("");
  const [minPlayers, setMinPlayers] = useState(1);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const { players } = usePlayerContext();

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const handleTogglePlayer = (id: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newGamePayload = {
      name,
      minimumPlayers: minPlayers,
      maximumPlayers: maxPlayers,
      players: selectedPlayers,
    };

    await addGame(newGamePayload);
    onClose();
  };

  return (
    <div className={s.modalBackdrop} onClick={onClose}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Ajouter un jeu</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nom :
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Nombre min. de joueurs :
            <input
              type="number"
              value={minPlayers}
              min={1}
              onChange={(e) => setMinPlayers(Number(e.target.value))}
            />
          </label>
          <label>
            Nombre max. de joueurs :
            <input
              type="number"
              value={maxPlayers}
              min={1}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
            />
          </label>
          <label>
            Joueurs possédant le jeu :
            <div className={s.playersList}>
              {players.map((player) => (
                <label key={player._id} className={s.checkboxItem}>
                  <input
                    type="checkbox"
                    value={player._id}
                    checked={selectedPlayers.includes(player._id)}
                    onChange={() => handleTogglePlayer(player._id)}
                  />
                  {player.name}
                </label>
              ))}
            </div>
          </label>
          <div className={s.actions}>
            <button type="submit">Ajouter</button>
            <button type="button" onClick={onClose} className={s.cancelButton}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
