import { useState } from "react";
import { Card } from "../components/Card/Card";
import type { Player } from "../types";
import s from "./Main.module.css";
import { Modal } from "../components/Modals/Modal";
import { usePlayerContext } from "../contexts/playersContext";
import { FloatingMenu } from "../components/FloatingMenu/FloatingMenu";
import { Navbar } from "../components/NavBar/Navbar";

export const Main = () => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [modalContent, setModalContent] = useState("");

  const { selectedPlayerId } = usePlayerContext();

  return (
    <>
      <Navbar />
      <div className={s.wrapper}>
        <FloatingMenu />
        <Card
          content={"activePlayers"}
          selected={selectedPlayers}
          onChange={setSelectedPlayers}
          setModalContent={setModalContent}
        />
        <Card content="filteredGameList" selectedPlayers={selectedPlayers} />
        <Card content="addAGame" />
        <Card content="gamesList" />
        {modalContent !== "" && selectedPlayerId && (
          <Modal
            modalContent={modalContent}
            onClose={() => setModalContent("")}
            selectedPlayerId={selectedPlayerId}
          />
        )}
      </div>
    </>
  );
};
