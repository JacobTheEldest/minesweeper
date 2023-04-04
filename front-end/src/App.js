import logo from './logo.svg';
import './App.css';
import Board from './components/Board';
import { createContext, useEffect, useState } from 'react';

export const BoardContext = createContext();

// TODO: Check lose condition (mine revealed)
// TODO: Check win condition (num not revealed == num mines)
// TODO: Show count of mines not flagged
// TODO: When a 0 is revealed, reveal neighbors
// TODO: Move all board logic to board component (context unnecessary?)


function App() {
  const [board, setBoard] = useState([]);

  const globalRows = 10;
  const globalCols = 10;
  const globalMines = 10;

  const randInRange = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  };

  class cell {
    constructor(row, col) {
      this.row = row;
      this.col = col;
      this.flagged = false;
      this.revealed = false;
      this.mine = false;
      this.neighbors = [];
      this.adjacentMines = 0;
    }

    toggleFlagged = () => {
      this.flagged = !this.flagged;
    };

    setRevealed = () => {
      this.revealed = true;
    };

    setMined = () => {
      this.mine = true;
    };

    queryNeighbors = (board) => {
      console.log('querying neighbors on board:', board);
      const potentialRows = [this.row - 1, this.row, this.row + 1];
      const potentialCols = [this.col - 1, this.col, this.col + 1];

      const neighborRows = potentialRows.filter((row) => {
        return row >= 0 && row < board.length;
      });

      const neighborCols = potentialCols.filter((col) => {
        return col >= 0 && col < board[0].length;
      });

      console.log({ neighborRows, neighborCols });

      neighborRows.forEach((row) => {
        neighborCols.forEach((col) => {
          if (!(col === this.col && row === this.row)) {
            if (board[row][col].mine) {
              this.adjacentMines++;
            }
            this.neighbors.push(board[row][col]);
          }
        });
      });
    };
  }

  const buildBoard = (rows = globalRows, cols = globalCols) => {
    const emptyBoard = generateEmptyBoard(rows, cols);

    const minedBoard = placeMines(rows, cols, globalMines, emptyBoard);

    minedBoard.forEach((row) => {
      row.forEach((cell) => {
        cell.queryNeighbors(minedBoard);
      });
    });

    setBoard(minedBoard);
  };

  const generateEmptyBoard = (rows = globalRows, cols = globalCols) => {
    const grid = [];
    for (let row = 0; row < rows; row++) {
      const rowArray = [];
      for (let col = 0; col < cols; col++) {
        rowArray.push(new cell(row, col));
      }
      grid.push(rowArray);
    }
    return grid;
  };

  const placeMines = (
    rows = globalRows,
    cols = globalCols,
    mines = globalMines,
    board
  ) => {
    let updatedBoard = board;

    console.log('placing mines');
    console.log(
      'board:',
      updatedBoard.length,
      'rows,',
      updatedBoard[0].length,
      'cols'
    );

    while (mines > 0) {
      let randRow = randInRange(0, rows - 1);
      let randCol = randInRange(0, cols - 1);

      console.log('placing mine at:', randRow, randCol);
      // mines--;
      if (!updatedBoard[randRow][randCol].mine) {
        updatedBoard[randRow][randCol].setMined();
        mines--;
      }
    }

    return updatedBoard;
  };

  // Initial Setup
  useEffect(() => {
    buildBoard();
  }, []);

  return (
    <BoardContext.Provider value={{ board, setBoard }}>
      <div className="">
        <h1>Minesweeper</h1>
        Board:
        <br />
        <Board />
        <br />
        After Board:
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
      </div>
    </BoardContext.Provider>
  );
}

export default App;
