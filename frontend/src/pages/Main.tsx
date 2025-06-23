import { useState } from "react";
import { Card } from "../components/Card/Card";
import type { Player } from "../types";
import s from "./Main.module.css";
import { Modal } from "../components/Modals/Modal";
import { usePlayerContext } from "../contexts/playersContext";
import { FloatingMenu } from "../components/FloatingMenu/FloatingMenu";

export const Main = () => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [modalContent, setModalContent] = useState("");

  const { selectedPlayerId } = usePlayerContext();

  return (
    <div className={s.wrapper}>
      <FloatingMenu />
      <div className={s.filtersContainer}>
        <Card
          content={"activePlayers"}
          selected={selectedPlayers}
          onChange={setSelectedPlayers}
          setModalContent={setModalContent}
        />
        <Card content="filteredGameList" selectedPlayers={selectedPlayers} />
      </div>
      <Card content="gamesList" />
      <div className={s.addFormsContainer}>
        <Card content="addAGame" />
        <Card content="addAPlayer" />
      </div>
      {modalContent !== "" && selectedPlayerId && (
        <Modal
          modalContent={modalContent}
          onClose={() => setModalContent("")}
          selectedPlayerId={selectedPlayerId}
        />
      )}
    </div>
  );
};
