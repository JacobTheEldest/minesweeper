import React, { Dispatch, createContext, useState } from 'react';
import './App.css';
import Board from './components/Board.tsx';

interface AttributeCount {
  flaggedCount: number;
  revealedCount: number;
  hiddenCount: number;
}
type GameResult = 'loss' | 'win' | '';
export interface BoardContextInterface {
  gameId: number;
  attributeCount: AttributeCount;
  setAttributeCount: Dispatch<React.SetStateAction<AttributeCount>>;
  gameResult: GameResult;
  setGameResult: Dispatch<React.SetStateAction<GameResult>>;
}
export const BoardContext = createContext<BoardContextInterface | undefined>(
  undefined,
);

// TODO: Make game size and mine count adjustable
// TODO: On loss, tint board red; on win, tint board green
// TODO: General styling, center board, etc.

const App: React.FC = () => {
  const [gameId, setGameId] = useState(1);

  const [attributeCount, setAttributeCount] = useState({
    flaggedCount: 0,
    revealedCount: 0,
    hiddenCount: 0,
  });

  const [gameResult, setGameResult] = useState<GameResult>('');

  const global = {
    rows: 10,
    cols: 10,
    mines: 10,
  };

  const handleGameRestartClick = () => {
    setGameResult('');
    setGameId(gameId + 1);
    setAttributeCount({
      flaggedCount: 0,
      revealedCount: 0,
      hiddenCount: 0,
    });
  };

  let endMessage = '';
  if (gameResult === 'loss') {
    endMessage = 'You Lost!';
  } else if (gameResult === 'win') {
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
        {global.mines - attributeCount.flaggedCount >= 0
          ? global.mines - attributeCount.flaggedCount
          : 0}
        <br />
        <span className="game-result">{endMessage}</span>
        {gameResult !== '' ? (
          <button onClick={handleGameRestartClick}>Restart</button>
        ) : null}
        <br />
        <Board global={global} />
        <br />
      </div>
    </BoardContext.Provider>
  );
};

export default App;
