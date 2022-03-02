import { useState } from "react";
import "./Game.css";
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

const startingLetterStates = {};
Array.from(Array(26)).forEach((e, i) => {
  const letter = String.fromCharCode(i + 65);
  startingLetterStates[letter] = "open";
});

const Game = () => {
  // eslint-disable-next-line
  const [boardStates, setBoardStates] = useState(startingBoardStates);
  // eslint-disable-next-line
  const [boardLetters, setBoardLetters] = useState(startingBoardLetters);
  // eslint-disable-next-line
  const [letterStates, setLetterStates] = useState(startingLetterStates);
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState("ongoing");
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const alertOnClose = () => setAlertIsOpen(false);

  const onKeyClick = (key) => {
    if (gameState !== "ongoing") return;

    if (key === "ENTER") {
      if (curRow < N_ROWS && curCol === N_COLS) {
        const guessed = boardLetters[curRow].join("");
        // check that word is in list
        if (wordsSet.has(guessed.toLowerCase())) {
          // update states for guessed letters
          boardLetters[curRow].forEach((letter, j) => {
            const posInTheWord = theWord.indexOf(letter);
            if (posInTheWord === -1) {
              // not in the word
              boardStates[curRow][j] = "absent";
              letterStates[letter] += " absent";
            } else if (posInTheWord === j) {
              // in the correct position
              boardStates[curRow][j] = "correct";
              letterStates[letter] += " correct";
            } else if (boardLetters[curRow][posInTheWord] !== letter) {
              // letter exists but is in the incorrect position
              boardStates[curRow][j] = "present";
              letterStates[letter] += " present";
            } else {
              // letter has already been placed in the correct position
              boardStates[curRow][j] = "absent";
              letterStates[letter] += " absent";
            }
          });

          // end game if the word is correct
          if (guessed === theWord) {
            setGameState("won");
            setAlertIsOpen(true);
          } else if (curRow === N_ROWS - 1) {
            // game lost
            setGameState("lost");
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

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["", "A", "S", "D", "F", "G", "H", "J", "K", "L", ""],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"],
  ];

  return (
    <div className="Game">
      <div className="boardContainer">
        <Modal isOpen={alertIsOpen}>
          <div className="modalHeader">
            <div className="closeButton" onClick={alertOnClose}>
              X
            </div>
          </div>
          <div className="modalContent">
            {gameState === "ongoing" && "Not in the word list!"}
            {gameState === "won" && "You won!"}
            {gameState === "lost" && "You lost! Refresh to restart"}
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
                    <div className="nails nailsTop">
                      <div className="dot">•</div>
                      <div className="dotSpacer"></div>
                      <div className="dot">•</div>
                    </div>
                    {letter}
                    <div className="nails nailsBottom">
                      <div className="dot">•</div>
                      <div className="dotSpacer"></div>
                      <div className="dot">•</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="Keyboard">
        {keyboardRows.map((row, idx) => (
          <div className="keyboardRow" key={`row${idx}`}>
            {row.map((letter, idx) => {
              if (letter === "") {
                return <div className="keySpacer" key={`spacer${idx}`}></div>;
              } else {
                return (
                  <div
                    className={`Key ${letter.length > 1 && "wideKey"}`}
                    tilestate={letterStates[letter]}
                    key={letter}
                    onClick={() => onKeyClick(letter)}
                  >
                    <span>{letter}</span>
                  </div>
                );
              }
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;
