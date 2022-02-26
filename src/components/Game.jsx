import { useState } from "react";
import "./Game.css";
import Keyboard from "./Keyboard";

const N_COLS = 5;
const N_ROWS = 6;

const startingBoardStates = Array.from({ length: N_ROWS }, () =>
  Array.from({ length: N_COLS }, () => "empty")
);

const startingBoardLetters = Array.from({ length: N_ROWS }, () =>
  Array.from({ length: N_COLS }, () => "")
);

const Game = () => {
  const [boardStates, updateBoardStates] = useState(startingBoardStates);
  const [boardLetters, updateBoardLetters] = useState(startingBoardLetters);
  const [curRow, updateCurRow] = useState(0);
  const [curCol, updateCurCol] = useState(0);

  const insertInBoard = (board, updateBoard, newElement, i, j) => {
    if (i >= N_ROWS || j >= N_COLS) {
      console.log(`Cannot insert at ${i} ${j}`);
      return;
    }

    const newBoard = Array.from({ length: N_ROWS }, () =>
      Array.from({ length: N_COLS }, () => "")
    );
    for (let i2 = 0; i2 < N_ROWS; i2++) {
      for (let j2 = 0; j2 < N_COLS; j2++) {
        newBoard[i2][j2] = i === i2 && j === j2 ? newElement : board[i2][j2];
      }
    }

    updateBoard(newBoard);
  };

  const onKeyClick = (key) => {
    if (key === "ENTER") {
      if (curRow < N_ROWS) {
        updateCurRow(curRow + 1);
        updateCurCol(0);
      }
    } else if (key === "DEL") {
      if (curCol > 0) {
        insertInBoard(boardLetters, updateBoardLetters, "", curRow, curCol - 1);
        insertInBoard(
          boardStates,
          updateBoardStates,
          "empty",
          curRow,
          curCol - 1
        );
        updateCurCol(curCol - 1);
      }
    } else {
      // only add letter if there is space
      if (curCol < N_COLS) {
        insertInBoard(boardLetters, updateBoardLetters, key, curRow, curCol);
        insertInBoard(boardStates, updateBoardStates, "await", curRow, curCol);
        updateCurCol(curCol + 1);
      }
    }
  };

  return (
    <div className="Game">
      <div className="boardContainer">
        <div className="Board">
          {boardLetters.map((row, i) => (
            <div className="boardRow" key={`boardrow-${i}`}>
              {row.map((letter, j) => (
                <div className="boardTile" key={`tile-${i}-${j}`}>
                  <div
                    className="boardTileContent"
                    key={`tilecontent-${i}-${j}`}
                    tilestate={boardStates[i][j]}
                  >
                    {letter}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Keyboard clickedCallback={onKeyClick} />
    </div>
  );
};

export default Game;
