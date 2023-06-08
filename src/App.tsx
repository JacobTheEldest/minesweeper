import React, { Dispatch, createContext, useState } from 'react';
import './App.css';
import Gameboard from './components/Gameboard.tsx';

interface AttributeCount {
  flaggedCount: number;
  revealedCount: number;
  hiddenCount: number;
}
type numericalInput = number | '';
type GameResult = 'loss' | 'win' | '';
export interface GameboardContextInterface {
  gameId: number;
  attributeCount: AttributeCount;
  setAttributeCount: Dispatch<React.SetStateAction<AttributeCount>>;
  gameResult: GameResult;
  setGameResult: Dispatch<React.SetStateAction<GameResult>>;
  rows: number;
  cols: number;
  mines: number;
}
export const GameboardContext = createContext<
  GameboardContextInterface | undefined
>(undefined);

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
  const [nextRows, setNextRows] = useState<numericalInput>(10);
  const [nextCols, setNextCols] = useState<numericalInput>(10);
  const [nextMines, setNextMines] = useState<numericalInput>(10);

  const handleColumnsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const colsInputValue = parseInt(e.target.value);
    if (isNaN(colsInputValue)) {
      setNextCols('');
      setNextMines(Math.round((cols * rows) / 10));
    } else {
      setNextCols(colsInputValue);
      setNextMines(Math.round((colsInputValue * rows) / 10));
    }
  };

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rowsInputValue = parseInt(e.target.value);
    if (isNaN(rowsInputValue)) {
      setNextRows('');
      setNextMines(Math.round((cols * rows) / 10));
    } else {
      setNextRows(rowsInputValue);
      setNextMines(Math.round((rowsInputValue * cols) / 10));
    }
  };

  const handleMinesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minesInputValue = parseInt(e.target.value);
    if (isNaN(minesInputValue)) {
      setNextMines('');
    } else {
      setNextMines(minesInputValue);
    }
  };

  const handleNewGameClick = (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof nextRows === 'number' && nextRows > 0) {
      setRows(nextRows);
    } else {
      setNextRows(rows);
    }
    if (typeof nextCols === 'number' && nextCols > 0) {
      setCols(nextCols);
    } else {
      setNextCols(cols);
    }
    if (
      typeof nextMines === 'number' &&
      nextMines > 0 &&
      nextMines < rows * cols
    ) {
      setMines(nextMines);
    } else {
      setNextMines(mines);
    }

    setGameResult('');
    setGameId(gameId + 1);

    setAttributeCount({
      flaggedCount: 0,
      revealedCount: 0,
      hiddenCount: 0,
    });
  };

  let endMessage = '';
  let gameResultCSSString = 'game-result';
  if (gameResult === 'loss') {
    endMessage = 'You Lost!';
    gameResultCSSString += ' game-lost';
  } else if (gameResult === 'win') {
    endMessage = 'You Won!';
    gameResultCSSString += ' game-won';
  }

  return (
    <GameboardContext.Provider
      value={{
        gameId,
        attributeCount,
        setAttributeCount,
        gameResult,
        setGameResult,
        rows,
        cols,
        mines,
      }}
    >
      <div className="">
        <div className="game-info">
          <h1>Minesweeper</h1>
          Game ID: {gameId}
          <br />
          Remaining Unflagged Mines:{' '}
          {mines - attributeCount.flaggedCount >= 0
            ? mines - attributeCount.flaggedCount
            : 0}
          <br />
          <form className="game-difficulty" onSubmit={handleNewGameClick}>
            <span className="columns">Columns:</span>
            <input
              type="number"
              name="columns"
              className="columns"
              onChange={handleColumnsChange}
              value={nextCols}
            />

            <span className="rows">Rows:</span>
            <input
              type="number"
              name="rows"
              className="rows"
              onChange={handleRowsChange}
              value={nextRows}
            />

            <span className="mines">Mines:</span>
            <input
              type="number"
              name="mines"
              className="mines-input"
              onChange={handleMinesChange}
              value={nextMines}
            />

            <button type="submit">New Game</button>
          </form>
          <span className={gameResultCSSString}>{endMessage}</span>
        </div>
        <Gameboard />
        <br />
      </div>
    </GameboardContext.Provider>
  );
};

export default App;
