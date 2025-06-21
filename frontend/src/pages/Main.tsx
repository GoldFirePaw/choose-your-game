import { useState } from "react";
import { Card } from "../components/Card/Card";
import type { Player } from "../types";
import s from "./Main.module.css";

export const Main = () => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  return (
    <>
      <div className={s.filtersContainer}>
        <Card
          content={"activePlayers"}
          selected={selectedPlayers}
          onChange={setSelectedPlayers}
        />
        <Card content="filteredGameList" selectedPlayers={selectedPlayers} />
      </div>
      <Card content="gamesList" />
      <div className={s.addFormsContainer}>
        <Card content="addAGame" />
        <Card content="addAPlayer" />
      </div>
    </>
  );
};
