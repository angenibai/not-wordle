import { useState } from "react";
import "./Game.css";
import Keyboard from "./Keyboard";
import { theWord, wordsSet } from "../Variables";
import Modal from "./Modal";

const N_COLS = 5;
const N_ROWS = 6;

const startingBoardStates = Array.from({ length: N_ROWS }, () =>
  Array.from({ length: N_COLS }, () => "empty")
);

const startingBoardLetters = Array.from({ length: N_ROWS }, () =>
  Array.from({ length: N_COLS }, () => "")
);

const Game = () => {
  const [boardStates, setBoardStates] = useState(startingBoardStates);
  const [boardLetters, setBoardLetters] = useState(startingBoardLetters);
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState("ongoing");
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const alertOnClose = () => setAlertIsOpen(false);

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

  const insertRowInBoard = (board, updateBoard, newRow, i) => {
    if (i >= N_ROWS) {
      console.log(`Cannot insert at row ${i}`);
      return;
    }
    const newBoard = Array.from({ length: N_ROWS }, () =>
      Array.from({ length: N_COLS }, () => "")
    );
    for (let i2 = 0; i2 < N_ROWS; i2++) {
      for (let j2 = 0; j2 < N_COLS; j2++) {
        newBoard[i2][j2] = i === i2 ? newRow[j2] : board[i2][j2];
      }
    }

    updateBoard(newBoard);
  };

  const onKeyClick = (key) => {
    if (gameState !== "ongoing") return;

    if (key === "ENTER") {
      if (curRow < N_ROWS) {
        const guessed = boardLetters[curRow].join("");
        // check that word is in list
        if (wordsSet.has(guessed.toLowerCase())) {
          // update states for guessed letters
          const updatedRowStates = boardLetters[curRow].map((letter) => {
            const posInTheWord = theWord.indexOf(letter);
            if (posInTheWord === -1) {
              // not in the word
              return "absent";
            } else if (posInTheWord === guessed.indexOf(letter)) {
              // in the correct position
              return "correct";
            } else {
              // in the incorrect position
              return "present";
            }
          });
          insertRowInBoard(
            boardStates,
            setBoardStates,
            updatedRowStates,
            curRow
          );

          // end game if the word is correct
          if (guessed === theWord) {
            setGameState("won");
            setAlertIsOpen(true);
          }

          // go to next row
          setCurRow(curRow + 1);
          setCurCol(0);
        } else {
          setAlertIsOpen(true);
        }
      }
    } else if (key === "DEL") {
      // only delete if there are letters left on the board
      if (curCol > 0) {
        insertInBoard(boardLetters, setBoardLetters, "", curRow, curCol - 1);
        insertInBoard(boardStates, setBoardStates, "empty", curRow, curCol - 1);
        setCurCol(curCol - 1);
      }
    } else {
      // only add letter if there is space
      if (curCol < N_COLS) {
        insertInBoard(boardLetters, setBoardLetters, key, curRow, curCol);
        insertInBoard(boardStates, setBoardStates, "await", curRow, curCol);
        setCurCol(curCol + 1);
      }
    }
  };

  return (
    <div className="Game">
      <div className="boardContainer">
        <Modal isOpen={alertIsOpen}>
          <div className="modalHeader">
            <div className="closeButton" onClick={alertOnClose}>
              ✖
            </div>
          </div>
          <div className="modalContent">
            {gameState === "ongoing" && "Not in the word list!"}
            {gameState === "won" && "You won!"}
          </div>
        </Modal>
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
