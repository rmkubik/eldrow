import React, { useState } from "react";
import {
  constructMatrixFromTemplate,
  fillMatrix,
  getLocation,
  isLocationInBounds,
  getDimensions,
  updateMatrix,
  fillArray,
} from "functional-game-utils";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import Grid from "./Grid";
import Cell from "./Cell";
import Center from "./Center";
import WordleInput from "./WordleInput";
import useKeyPress from "../hooks/useKeyPress";

const WORDLE_HEADER_LENGTH = 2;
const WORDLE_WORD_LENGTH = 5;

const theme = {
  tileSize: 64,
};

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    color: white;
    font-family: "Helvetica";
    font-size: 2.5rem;
    background-color: black;
  }

  h1 {
    font-size: 2.5rem;
    text-align: center;
    letter-spacing: 4px;
    font-weight: bold;
  }
`;

const padEnd = (array, paddedLength, value) => {
  if (array.length >= paddedLength) {
    // Array is already long enough
    return array;
  }

  const missingValueCount = paddedLength - array.length;
  const paddedValues = fillArray(missingValueCount, value);

  return [...array, ...paddedValues];
};

const convertWordleInputMatrix = (wordleInput) => {
  const lines = wordleInput.split("\n").slice(WORDLE_HEADER_LENGTH);
  const matrix = lines.map((line) =>
    padEnd([...line.trim()], WORDLE_WORD_LENGTH, "X")
  );

  return matrix;
};

const isLastRow = (matrix, row) => matrix.length - 1 === row;

const App = () => {
  const [wordleInput, setWordleInput] = useState(`Wordle 198 3/6

  ⬛⬛⬛🟩🟨
  🟩⬛⬛🟩⬛
  🟩🟩🟩🟩🟩`);
  const [answer, setAnswer] = useState("truss");
  const [wordleMatrix, setWordleMatrix] = useState(
    convertWordleInputMatrix(wordleInput)
  );
  const [guesses, setGuesses] = useState(
    fillMatrix(getDimensions(wordleMatrix), " ")
  );
  useKeyPress({
    ArrowUp: (e) => {
      e.preventDefault();

      if (focusedLocation) {
        document
          .getElementById(
            JSON.stringify({
              row: Math.max(focusedLocation.row - 1, 0),
              col: focusedLocation.col,
            })
          )
          .focus();
      }
    },
    ArrowDown: (e) => {
      e.preventDefault();

      if (focusedLocation) {
        document
          .getElementById(
            JSON.stringify({
              row: Math.min(focusedLocation.row + 1, wordleMatrix.length - 1),
              col: focusedLocation.col,
            })
          )
          .focus();
      }
    },
    ArrowLeft: (e) => {
      e.preventDefault();

      if (focusedLocation) {
        document
          .getElementById(
            JSON.stringify({
              row: focusedLocation.row,
              col: Math.max(focusedLocation.col - 1, 0),
            })
          )
          .focus();
      }
    },
    ArrowRight: (e) => {
      e.preventDefault();

      if (focusedLocation) {
        document
          .getElementById(
            JSON.stringify({
              row: focusedLocation.row,
              col: Math.min(
                focusedLocation.col + 1,
                wordleMatrix[0].length - 1
              ),
            })
          )
          .focus();
      }
    },
  });
  const [focusedLocation, setFocusedLocation] = useState(undefined);

  const setGuess = (location, value) => {
    const newGuesses = updateMatrix(location, value, guesses);

    setGuesses(newGuesses);
  };

  const updateWordle = (newWordleInput) => {
    setWordleInput(newWordleInput);

    const newWordleMatrix = convertWordleInputMatrix(newWordleInput);
    setWordleMatrix(newWordleMatrix);

    const newGuesses = fillMatrix(getDimensions(newWordleMatrix), " ");
    setGuesses(newGuesses);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Center>
        <div>
          <h1>ELDROW</h1>
          <Grid
            tiles={wordleMatrix}
            renderTile={(value, location) => {
              let letter = "";

              if (isLocationInBounds(guesses, location)) {
                letter = getLocation(guesses, location);
              }

              if (isLastRow(wordleMatrix, location.row)) {
                letter = answer[location.col];
              }

              return (
                <Cell
                  key={JSON.stringify(location)}
                  answer={answer}
                  value={value}
                  letter={letter}
                  location={location}
                  onKeyDown={(event) => {
                    if (
                      event.key.toLowerCase() === "backspace" ||
                      event.key.toLowerCase() === "delete"
                    ) {
                      // Clear out player's guess on a backspace
                      // or delete key press.
                      setGuess(location, "");
                      return;
                    }

                    if (event.key.length > 1) {
                      // We should ignore all key events that aren't
                      // single characters. Things like "space" and "enter"
                      return;
                    }

                    setGuess(location, event.key);
                  }}
                  onFocus={() => setFocusedLocation(location)}
                  onBlur={() => setFocusedLocation(undefined)}
                />
              );
            }}
          />
          <WordleInput
            wordleInput={wordleInput}
            onWordleInputChange={(event) => {
              updateWordle(event.target.value);
            }}
            answer={answer}
            onAnswerChange={(event) =>
              // Slice to enforce max wordle length
              setAnswer(
                event.target.value
                  .slice(0, WORDLE_WORD_LENGTH + 1)
                  .toUpperCase()
              )
            }
          />
        </div>
      </Center>
    </ThemeProvider>
  );
};

export default App;
