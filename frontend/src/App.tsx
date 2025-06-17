import "./App.css";
import { AddPlayerForm } from "./components/AddPlayerForm";
import { GamesList } from "./components/GamesList";
import { GamesProvider } from "./contexts/gamesContext";
import { PlayersList } from "./components/PlayersList";
import { PlayersProvider } from "./contexts/playersContext";
import { FilteredGameList } from "./components/FilteredGameList";
import { useState } from "react";
import { AddGameModal } from "./components/AddGameModal";

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <PlayersProvider>
        <GamesProvider>
          <FilteredGameList />
          <GamesList />
          <button onClick={() => setShowModal(true)}>➕ Ajouter un jeu</button>
          {showModal && <AddGameModal onClose={() => setShowModal(false)} />}
          <PlayersList />
          <AddPlayerForm />
        </GamesProvider>
      </PlayersProvider>
    </>
  );
}

export default App;
