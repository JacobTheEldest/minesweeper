import './Board.css';
import { useContext, useState } from 'react';
import { BoardContext } from '../App.js';

const Board = () => {

  const { board, setBoard } = useContext(BoardContext);
  const [moves, setMoves] = useState([]);

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
    
    if (!cell.flagged) {
      cell.setRevealed();
    }
    
    setMoves([...moves, cell]);
  }
  
  const handleRightClick = (e, cell) => {
    console.log('right click on:', cell);
    e.preventDefault();
    
    cell.toggleFlagged(); 
    
    setMoves([...moves, cell]);
  }

  return (
    <div className="board">
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
