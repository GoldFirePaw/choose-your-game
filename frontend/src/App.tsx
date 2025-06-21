import "./App.css";
import { GamesProvider } from "./contexts/gamesContext";
import { PlayersProvider } from "./contexts/playersContext";
import { Main } from "./pages/Main";
function App() {
  return (
    <>
      <PlayersProvider>
        <GamesProvider>
          <Main />
        </GamesProvider>
      </PlayersProvider>
    </>
  );
}

export default App;
