import "./App.css";
import { GamesProvider } from "./contexts/gamesContext";
import { PlayersProvider } from "./contexts/playersContext";
import { Main } from "./pages/Main";
function App() {
  return (
    <>
      {" "}
      <GamesProvider>
        <PlayersProvider>
          <Main />
        </PlayersProvider>
      </GamesProvider>
    </>
  );
}

export default App;
