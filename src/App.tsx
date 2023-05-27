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
  rows: number;
  cols: number;
  mines: number;
  setCurrentMines: Dispatch<React.SetStateAction<number>>;
}
export const BoardContext = createContext<BoardContextInterface | undefined>(
  undefined,
);

const App: React.FC = () => {
  const [gameId, setGameId] = useState(1);

  const [attributeCount, setAttributeCount] = useState({
    flaggedCount: 0,
    revealedCount: 0,
    hiddenCount: 0,
  });

  const [gameResult, setGameResult] = useState<GameResult>('');

  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [mines, setMines] = useState(10);
  const [currentMines, setCurrentMines] = useState(10);

  const handleColumnsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCols = parseInt(e.target.value);
    setCols(newCols);
    setMines(Math.round((newCols * rows) / 10));
  };

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRows = parseInt(e.target.value);
    setRows(newRows);
    setMines(Math.round((newRows * cols) / 10));
  };

  const handleMinesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMines = parseInt(e.target.value);
    setMines(newMines);
  };

  const handleNewGameClick = (e: React.FormEvent) => {
    e.preventDefault();
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
        rows,
        cols,
        mines,
        setCurrentMines,
      }}
    >
      <div className="">
        <div className="game-info">
          <h1>Minesweeper</h1>
          Game ID: {gameId}
          <br />
          Remaining Unflagged Mines:{' '}
          {/* TODO: store initial mine count for this */}
          {currentMines - attributeCount.flaggedCount >= 0
            ? currentMines - attributeCount.flaggedCount
            : 0}
          <br />
          <form className="game-difficulty" onSubmit={handleNewGameClick}>
            <span className="columns">Columns:</span>
            <input
              type="number"
              name="columns"
              className="columns"
              onChange={handleColumnsChange}
              value={cols}
            />

            <span className="rows">Rows:</span>
            <input
              type="number"
              name="rows"
              className="rows"
              onChange={handleRowsChange}
              value={rows}
            />

            <span className="mines">Mines:</span>
            <input
              type="number"
              name="mines"
              className="mines-input"
              onChange={handleMinesChange}
              value={mines}
            />

            <button type="submit">New Game</button>
          </form>
          <span className="game-result">{endMessage}</span>
        </div>
        <Board />
        <br />
      </div>
    </BoardContext.Provider>
  );
};

export default App;
