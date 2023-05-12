import './Board.css';
import { useContext, useState, useEffect } from 'react';
import { BoardContext } from '../App.tsx';

const Board = ({ global }) => {
  const { gameId, setAttributeCount, gameResult, setGameResult } =
    useContext(BoardContext);
  const [board, setBoard] = useState([]);
  const [moves, setMoves] = useState([]);

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
      // console.log('querying neighbors on board:', board);
      const potentialRows = [this.row - 1, this.row, this.row + 1];
      const potentialCols = [this.col - 1, this.col, this.col + 1];

      const neighborRows = potentialRows.filter((row) => {
        return row >= 0 && row < board.length;
      });

      const neighborCols = potentialCols.filter((col) => {
        return col >= 0 && col < board[0].length;
      });

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

  const buildBoard = (rows = global.rows, cols = global.cols) => {
    console.log('buildBoard - rows, cols:', rows, cols);
    const emptyBoard = generateEmptyBoard(rows, cols);

    const minedBoard = placeMines(rows, cols, global.mines, emptyBoard);

    // iterate over each cell
    minedBoard.forEach((row) => {
      row.forEach((cell) => {
        cell.queryNeighbors(minedBoard);
      });
    });

    setBoard(minedBoard);
  };

  const generateEmptyBoard = (rows = global.rows, cols = global.cols) => {
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
    rows = global.rows,
    cols = global.cols,
    mines = global.mines,
    board
  ) => {
    const updatedBoard = board;

    console.log('placing mines');
    console.log(
      'board:',
      updatedBoard.length,
      'rows,',
      updatedBoard[0].length,
      'cols'
    );

    while (mines > 0) {
      const randRow = randInRange(0, rows - 1);
      const randCol = randInRange(0, cols - 1);

      console.log('placing mine at:', randRow, randCol);
      // mines--;
      if (!updatedBoard[randRow][randCol].mine) {
        updatedBoard[randRow][randCol].setMined();
        mines--;
      }
    }

    return updatedBoard;
  };

  const countAttributes = (board) => {
    let flagged = 0;
    let revealed = 0;

    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.flagged) {
          flagged++;
        }
        if (cell.revealed) {
          revealed++;
        }
      });
    });

    const hidden = board.length * board[0].length - revealed;

    if (hidden === global.mines) {
      setGameResult(1);
    }

    setAttributeCount({
      flagged,
      revealed,
      hidden,
    });
  };

  const revealCells = (cell) => {
    if (cell.adjacentMines !== 0) {
      cell.setRevealed();
      return;
    }

    const getConnectedZeroes = (cell, connectedZeroes, cellsToReveal) => {
      cell.neighbors.forEach((neighbor) => {
        cellsToReveal.add(neighbor);
        if (
          !connectedZeroes.has(neighbor) &&
          !neighbor.revealed &&
          neighbor.adjacentMines === 0
        ) {
          connectedZeroes.add(neighbor);
          getConnectedZeroes(neighbor, connectedZeroes, cellsToReveal);
        }
      });
    };

    const connectedZeroes = new Set([cell]);
    const cellsToReveal = new Set([cell]);
    getConnectedZeroes(cell, connectedZeroes, cellsToReveal);
    cellsToReveal.forEach((cell) => {
      cell.setRevealed();
    });
  };

  // Initial Setup
  useEffect(() => {
    buildBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  const cellDisplay = (cell) => {
    let cssClassString = 'cell';
    let cellIcon = '';

    if (!cell.revealed) {
      cssClassString += ' hidden';
      if (cell.flagged) {
        cssClassString += ' flagged';
        cellIcon = '🚩';
      }
    } else if (cell.mine) {
      cssClassString += ' mine';
      cellIcon = '💣';
    } else {
      cssClassString += ' number';
      cellIcon = cell.adjacentMines;
    }

    return (
      <div
        className={cssClassString}
        onClick={(e) => handleLeftClick(e, cell)}
        onContextMenu={(e) => handleRightClick(e, cell)}
        key={cell.col}
      >
        {cellIcon ? cellIcon : null}
      </div>
    );
  };

  const handleLeftClick = (e, cell) => {
    console.log('left click on:', cell);
    e.preventDefault();

    if (gameResult !== 0) {
      return;
    }

    if (!cell.flagged) {
      revealCells(cell);
      countAttributes(board);
      if (cell.mine) {
        setGameResult(-1);
      }
    }

    setMoves([...moves, cell]);
  };

  const handleRightClick = (e, cell) => {
    console.log('right click on:', cell);
    e.preventDefault();

    if (gameResult !== 0) {
      return;
    }

    cell.toggleFlagged();
    countAttributes(board);

    setMoves([...moves, cell]);
  };

  let boardCSSClassString = 'board';
  if (gameResult !== 0) {
    boardCSSClassString += ' game-over';
  }

  return (
    <div className={boardCSSClassString}>
      {board.map((row, rowNum) => {
        return (
          <div className="row" key={rowNum}>
            {row.map((cell) => {
              return cellDisplay(cell);
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
