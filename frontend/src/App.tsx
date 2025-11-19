import "./App.css";
import "./styles/themes.css";
import { GamesProvider } from "./contexts/gamesContext";
import { PlayersProvider } from "./contexts/playersContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Main } from "./pages/Main";

function App() {
  return (
    <>
      {" "}
      <ThemeProvider>
      <GamesProvider>
        <PlayersProvider>
            <Main />
        </PlayersProvider>
      </GamesProvider>
                </ThemeProvider>


    </>
  );
}

export default App;
