import React, { useMemo, useState } from "react";
import { usePlayerContext } from "../../contexts/playersContext";
import type { Player } from "../../types";
import s from "./ActivePlayers.module.css";
import { Dots } from "../../assets/icons/Dots";
import { Chevron } from "../../assets/icons/Chevron";
import { AddPlayerForm } from "../AddPlayerForm/AddPlayerForm";
import { Close } from "../../assets/icons/Close";
import { Button } from "../Buttons/Button";
import { Plus } from "../../assets/icons/Plus";

interface ActivePlayersProps {
  selected: Player[];
  onChange: (players: Player[]) => void;
  setModalContent: (content: string) => void;
}

export const ActivePlayers: React.FC<ActivePlayersProps> = ({
  selected,
  onChange,
  setModalContent,
}) => {
  const { players, handleSelectPlayer } = usePlayerContext();
  const [isOpen, setOpen] = useState(false);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
  }, [players]);

  const toggle = (player: Player) => {
    const isSelected = selected.some((p) => p._id === player._id);

    const newSelection = isSelected
      ? selected.filter((p) => p._id !== player._id)
      : [...selected, player];

    onChange(newSelection);
  };

  const openDetails = (playerId: string) => {
    handleSelectPlayer(playerId);
    setModalContent("playerDetails");
  };

  const uncheckAll = () => {
    onChange([]);
  };

  const numberOfSelectedPlayers = selected.length;

  return (
    <div className={s.wrapper}>
      <div
        className={s.header}
        onClick={() => {
          setOpen(!isOpen);
        }}
        id="active-players"
      >
        <Chevron />
        Joueurs présents
      </div>
      {isOpen && (
        <>
          <div className={s.instructionsContainer}>
            <div className={s.actionButtonsContainer}>
              <Button
                id="add-player"
                className={s.actionButton}
                onClick={() => {
                  setIsAddPlayerOpen(!isAddPlayerOpen);
                }}
                label={
                  <>
                    {isAddPlayerOpen ? <Close /> : <Plus />}
                    Ajouter un joueur
                  </>
                }
              />
              {numberOfSelectedPlayers > 0 && isOpen && (
                <Button
                  className={s.actionButton}
                  onClick={uncheckAll}
                  label={
                    <>
                      {" "}
                      <Close />
                      Tout décocher
                    </>
                  }
                />
              )}
            </div>
            <AddPlayerForm
              isOpen={isAddPlayerOpen}
              setIsOpen={setIsAddPlayerOpen}
            />
            <p className={s.instructions}>
              Cliquez sur un joueur pour voir ses détails ou cochez pour
              l’ajouter à la partie.
            </p>
          </div>
          <div className={s.playersContainer}>
            {sortedPlayers.map((player) => {
              const isChecked = selected.some((p) => p._id === player._id);

              return (
                <div key={player._id} className={s.playerContainer}>
                  <label
                    className={s.checkboxLabel}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(player)}
                    />
                  </label>

                  <span className={s.playerName} onClick={() => toggle(player)}>
                    {player.name}
                  </span>

                  <button
                    type="button"
                    className={s.editBtn}
                    onClick={() => openDetails(player._id)}
                  >
                    <Dots />
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
