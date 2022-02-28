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

  const onKeyClick = (key) => {
    if (gameState !== "ongoing") return;

    if (key === "ENTER") {
      if (curRow < N_ROWS) {
        const guessed = boardLetters[curRow].join("");
        // check that word is in list
        if (wordsSet.has(guessed.toLowerCase())) {
          // update states for guessed letters
          boardLetters[curRow].forEach((letter, j) => {
            const posInTheWord = theWord.indexOf(letter);
            if (posInTheWord === -1) {
              // not in the word
              boardStates[curRow][j] = "absent";
            } else if (posInTheWord === guessed.indexOf(letter)) {
              // in the correct position
              boardStates[curRow][j] = "correct";
            } else {
              // in the incorrect position
              boardStates[curRow][j] = "present";
            }
          });

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
        boardLetters[curRow][curCol - 1] = "";
        boardStates[curRow][curCol - 1] = "empty";
        setCurCol(curCol - 1);
      }
    } else {
      // only add letter if there is space
      if (curCol < N_COLS) {
        boardLetters[curRow][curCol] = key;
        boardStates[curRow][curCol] = "await";
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
