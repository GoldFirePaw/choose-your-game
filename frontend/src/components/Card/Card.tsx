import { ActivePlayers } from "../ActivePlayers/ActivePlayers";
import { AddGameForm } from "../AddGameForm";
import { AddPlayerForm } from "../AddPlayerForm";
import { FilteredGameList } from "../FilteredGameList";
import { GamesList } from "../GamesList";
import s from "./Card.module.css";
import cx from "classnames";
import type { Player } from "../../types";
import { PlayersList } from "../PlayersList";

type CardProps = {
  content: ContentType;
  selected?: Player[];
  onChange?: (players: Player[]) => void;
  selectedPlayers?: Player[];
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
}: CardProps) => {
  let cardContent;
  switch (content) {
    case "gamesList":
      cardContent = <GamesList />;
      break;
    case "activePlayers":
      cardContent =
        onChange && selected ? (
          <ActivePlayers selected={selected} onChange={onChange} />
        ) : null;
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
    case "playersList":
      cardContent = <PlayersList />;
      break;
    default:
      cardContent = "Default content goes here";
      break;
  }

  return (
    <div className={cx(s.cardContainer, content && s[content])}>
      <div>{cardContent}</div>
    </div>
  );
};
