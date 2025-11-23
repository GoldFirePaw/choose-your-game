import React from "react";
import cx from "classnames";
import s from "./Card.module.css";

import { ActivePlayers } from "../ActivePlayers/ActivePlayers";
import { AddGameForm } from "../AddGameForm/AddGameForm";
import { AddPlayerForm } from "../AddPlayerForm/AddPlayerForm";
import { FilteredGameList } from "../FilteredGameList/FilteredGameList";
import { GamesList } from "../GamesList/GamesList";

import type { Player } from "../../types";

type ContentType =
  | "gamesList"
  | "activePlayers"
  | "addAGame"
  | "addAPlayer"
  | "filteredGameList";

interface CardProps {
  content: ContentType;
  selected?: Player[];
  onChange?: (players: Player[]) => void;
  selectedPlayers?: Player[];
  setModalContent?: (content: string) => void;
}

export const Card: React.FC<CardProps> = ({
  content,
  selected,
  onChange,
  selectedPlayers,
  setModalContent,
}) => {
  const renderContent = () => {
    switch (content) {
      case "gamesList":
        return <GamesList />;

      case "activePlayers":
        if (!onChange || !selected || !setModalContent) return null;
        return (
          <ActivePlayers
            selected={selected}
            onChange={onChange}
            setModalContent={setModalContent}
          />
        );

      case "addAGame":
        return <AddGameForm />;

      case "addAPlayer":
        return <AddPlayerForm isOpen={true} setIsOpen={() => {}} />;
        
      case "filteredGameList":
        return selectedPlayers ? (
          <FilteredGameList selectedPlayers={selectedPlayers} />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className={cx(s.cardContainer, s[content])}>
      {renderContent()}
    </div>
  );
};
