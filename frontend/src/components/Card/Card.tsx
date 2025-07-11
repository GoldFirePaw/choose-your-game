import { ActivePlayers } from "../ActivePlayers/ActivePlayers";
import { AddGameForm } from "../AddGameForm/AddGameForm";
import { AddPlayerForm } from "../AddPlayerForm/AddPlayerForm";
import { FilteredGameList } from "../FilteredGameList/FilteredGameList";
import { GamesList } from "../GamesList/GamesList";
import s from "./Card.module.css";
import cx from "classnames";
import type { Player } from "../../types";

type CardProps = {
  content: ContentType;
  selected?: Player[];
  onChange?: (players: Player[]) => void;
  selectedPlayers?: Player[];
  gameId?: string;
  isActive?: boolean;
  setActiveGameId?: (id: string | null) => void;
  setModalContent?: (content: string) => void;
};

type ContentType =
  | "gamesList"
  | "activePlayers"
  | "addAGame"
  | "addAPlayer"
  | "filteredGameList"
  | "playersList";

export const Card = ({
  content,
  selected,
  onChange,
  selectedPlayers,
  setModalContent,
}: CardProps) => {
  let cardContent;
  switch (content) {
    case "gamesList":
      cardContent = <GamesList />;
      break;
    case "activePlayers":
      cardContent = onChange && selected && setModalContent && (
        <ActivePlayers
          setModalContent={setModalContent}
          selected={selected}
          onChange={onChange}
        />
      );
      break;
    case "addAGame":
      cardContent = <AddGameForm />;
      break;
    case "addAPlayer":
      cardContent = <AddPlayerForm />;
      break;
    case "filteredGameList":
      cardContent = selectedPlayers && (
        <FilteredGameList selectedPlayers={selectedPlayers} />
      );
      break;
    default:
      cardContent = "Default content goes here";
      break;
  }

  return (
    <div className={cx(s.cardContainer, content && s[content])}>
      {cardContent}
    </div>
  );
};
