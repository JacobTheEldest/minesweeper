import './Gameboard.css';
import { useCallback, useContext, useEffect, useState } from 'react';
import { GameboardContext, GameboardContextInterface } from '../App';

type Board = Array<Array<cell>>;

class cell {
  row: number;
  col: number;
  flagged: boolean;
  revealed: boolean;
  mined: boolean;
  neighbors: cell[];
  adjacentMines: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
    this.flagged = false;
    this.revealed = false;
    this.mined = false;
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
    this.mined = true;
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
          if (board[row][col].mined) {
            this.adjacentMines++;
          }
          this.neighbors.push(board[row][col]);
        }
      });
    });
  };
}

const Gameboard = () => {
  const {
    gameId,
    setAttributeCount,
    gameResult,
    setGameResult,
    rows,
    cols,
    mines,
  } = useContext(GameboardContext) as GameboardContextInterface;

  const [board, setBoard] = useState<Board>([]);
  const [moves, setMoves] = useState<Array<cell>>([]);

  const randInRange = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const generateEmptyBoard = useCallback(
    (rows: number, cols: number): Board => {
      const grid = [];
      for (let row = 0; row < rows; row++) {
        const rowArray = [];
        for (let col = 0; col < cols; col++) {
          rowArray.push(new cell(row, col));
        }
        grid.push(rowArray);
      }
      return grid;
    },
    [],
  );

  const placeMines = useCallback((mineCount: number, board: Board) => {
    const unminedCells = board.flat();

    while (mineCount > 0) {
      const unminedIndex = randInRange(0, unminedCells.length - 1);

      unminedCells[unminedIndex].setMined();
      unminedCells.splice(unminedIndex, 1);
      mineCount--;
    }

    return board;
  }, []);

  const buildBoard = useCallback(() => {
    const emptyBoard = generateEmptyBoard(rows, cols);

    const minedBoard = placeMines(mines, emptyBoard);

    minedBoard.forEach((row: Array<cell>) => {
      row.forEach((cell) => {
        cell.queryNeighbors(minedBoard);
      });
    });

    setBoard(minedBoard);
  }, [generateEmptyBoard, placeMines, rows, cols, mines]);

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

    if (hiddenCount === mines) {
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
    } else if (cell.mined) {
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
    e.preventDefault();

    // Don't do anything if game is over
    if (gameResult !== '') {
      return;
    }

    if (!cell.flagged) {
      revealCells(cell);
      countAttributes(board);
      if (cell.mined) {
        setGameResult('loss');
        board.flat().forEach((cell) => cell.setRevealed());
      }
    }

    setMoves([...moves, cell]);
  };

  const handleRightClick = (e: React.MouseEvent, cell: cell) => {
    e.preventDefault();

    // Don't do anything if game is over
    if (gameResult !== '') {
      return;
    }

    // Don't allow flagging an already-revealed cell
    if (cell.revealed) {
      return;
    }

    cell.toggleFlagged();
    countAttributes(board);

    setMoves([...moves, cell]);
  };

  // Build a new board when the gameId changes
  useEffect(() => {
    buildBoard();
  }, [gameId, buildBoard]);

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

export default Gameboard;
