import "./App.css";
import Game from "./components/Game";

function App() {
  const theWord = "SUPER";
  return (
    <div className="App">
      <div className="header">
        <h1>Mario-dle?</h1>
      </div>
      <Game />
    </div>
  );
}

export default App;
