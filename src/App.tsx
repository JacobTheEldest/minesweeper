import { createContext, useState } from 'react';
import './App.css';
import Board from './components/Board.tsx';

export const BoardContext = createContext(null); // TODO: https://kentcdodds.com/blog/how-to-use-react-context-effectively#typescript

// TODO: Make game size and mine count adjustable
// TODO: On loss, tint board red; on win, tint board green
// TODO: General styling, center board, etc.

function App() {
  const [gameId, setGameId] = useState(1);
  const [attributeCount, setAttributeCount] = useState({
    revealed: 0,
    flagged: 0,
    hidden: 0,
  });
  const [gameResult, setGameResult] = useState(0);

  const global = {
    rows: 10,
    cols: 10,
    mines: 10,
  };

  const handleGameRestartClick = () => {
    setGameResult(0);
    setGameId(gameId + 1);
    setAttributeCount({
      revealed: 0,
      flagged: 0,
      hidden: 0,
    });
  };

  let endMessage = '';
  if (gameResult === -1) {
    endMessage = 'You Lost!';
  } else if (gameResult === 1) {
    endMessage = 'You Won!';
  }

  return (
    <BoardContext.Provider
      value={{
        gameId,
        attributeCount,
        setAttributeCount,
        gameResult,
        setGameResult,
      }}
    >
      <div className="">
        <h1>Minesweeper</h1>
        Game ID: {gameId}
        <br />
        Remaining Unflagged Mines:{' '}
        {global.mines - attributeCount.flagged >= 0
          ? global.mines - attributeCount.flagged
          : 0}
        <br />
        <span className="game-result">{endMessage}</span>
        {gameResult !== 0 ? (
          <button onClick={handleGameRestartClick}>Restart</button>
        ) : null}
        <br />
        <Board global={global} />
        <br />
      </div>
    </BoardContext.Provider>
  );
}

export default App;
