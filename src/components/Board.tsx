import './Board.css';
import { useContext, useState } from 'react';
import { BoardContext, BoardContextInterface } from '../App.tsx';

interface Global {
  rows: number;
  cols: number;
  mines: number;
}
const Board = ({ global }: { global: Global }) => {
  const tmpBoardContext = useContext(BoardContext);
  const { gameId, setAttributeCount, gameResult, setGameResult } =
    tmpBoardContext as BoardContextInterface;

  type Board = Array<Array<cell>>;
  const [board, setBoard] = useState<Board>([]);
  const [moves, setMoves] = useState<Array<cell>>([]);
  const [renderedGame, setRenderedGame] = useState<number>(0);

  const randInRange = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  };

  class cell {
    row: number;
    col: number;
    flagged: boolean;
    revealed: boolean;
    mine: boolean;
    neighbors: cell[];
    adjacentMines: number;

    constructor(row: number, col: number) {
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

    queryNeighbors = (board: Board) => {
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

  const buildBoard = (
    rows = global.rows,
    cols = global.cols,
    mines = global.mines,
  ) => {
    const emptyBoard = generateEmptyBoard(rows, cols);

    const minedBoard = placeMines(rows, cols, mines, emptyBoard);

    // iterate over each cell
    minedBoard.forEach((row: Array<cell>) => {
      row.forEach((cell) => {
        cell.queryNeighbors(minedBoard);
      });
    });

    setBoard(minedBoard);
  };

  const generateEmptyBoard = (
    rows = global.rows,
    cols = global.cols,
  ): Board => {
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
    rows: number,
    cols: number,
    mines: number,
    board: Board,
  ) => {
    const updatedBoard = board;

    while (mines > 0) {
      const randRow = randInRange(0, rows - 1);
      const randCol = randInRange(0, cols - 1);

      // console.log('placing mine at:', randRow, randCol);
      // mines--;
      if (!updatedBoard[randRow][randCol].mine) {
        updatedBoard[randRow][randCol].setMined();
        mines--;
      }
    }

    return updatedBoard;
  };

  const countAttributes = (board: Board) => {
    let flaggedCount = 0;
    let revealedCount = 0;

    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.flagged) {
          flaggedCount++;
        }
        if (cell.revealed) {
          revealedCount++;
        }
      });
    });

    const hiddenCount = board.length * board[0].length - revealedCount;

    if (hiddenCount === global.mines) {
      setGameResult('win');
    }

    setAttributeCount({
      flaggedCount,
      revealedCount,
      hiddenCount,
    });
  };

  const revealCells = (cell: cell) => {
    if (cell.adjacentMines !== 0) {
      cell.setRevealed();
      return;
    }

    const getConnectedZeroes = (
      cell: cell,
      connectedZeroes: Set<cell>,
      cellsToReveal: Set<cell>,
    ) => {
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

  const cellDisplay = (cell: cell) => {
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
      cellIcon = cell.adjacentMines === 0 ? '' : cell.adjacentMines.toString();
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

  const handleLeftClick = (e: React.MouseEvent, cell: cell) => {
    // console.log('left click on:', cell);
    e.preventDefault();

    // Don't do anything if game is over
    if (gameResult !== '') {
      return;
    }

    if (!cell.flagged) {
      revealCells(cell);
      countAttributes(board);
      if (cell.mine) {
        setGameResult('loss');
      }
    }

    setMoves([...moves, cell]);
  };

  const handleRightClick = (e: React.MouseEvent, cell: cell) => {
    // console.log('right click on:', cell);
    e.preventDefault();

    // Don't do anything if game is over
    if (gameResult !== '') {
      return;
    }

    cell.toggleFlagged();
    countAttributes(board);

    setMoves([...moves, cell]);
  };

  // Build new boards when necessary
  if (renderedGame !== gameId) {
    buildBoard();
    setRenderedGame(gameId);
  }

  let boardCSSClassString = 'board';
  if (gameResult !== '') {
    boardCSSClassString += ' game-over';
  }

  return (
    <div className={boardCSSClassString}>
      {board.map((row: Array<cell>, rowNum: number) => {
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