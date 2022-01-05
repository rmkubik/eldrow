import React, { useState, useEffect } from "react";
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
import useArrowNav from "../hooks/useArrowNav";
import { base64ToUnicode } from "../common/base64";

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

const processCurrentParams = () => {
  const params = new URLSearchParams(window.location.search);

  const answer = params.get("a");
  let wordleInput;

  if (params.get("p")) {
    wordleInput = base64ToUnicode(params.get("p"));
  }

  return { answer, wordleInput };
};

const App = () => {
  const [wordleInput, setWordleInput] = useState();
  const [answer, setAnswer] = useState();
  const [wordleMatrix, setWordleMatrix] = useState([["", "", "", "", ""]]);
  const [guesses, setGuesses] = useState([[]]);
  const [focusedLocation, setFocusedLocation] = useState(undefined);
  useArrowNav({ focusedLocation, wordleMatrix });
  const [isLoaded, setIsLoaded] = useState(false);

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

  useEffect(() => {
    const useParams = () => {
      const paramValues = processCurrentParams();

      let initialAnswer = "truss";
      if (paramValues.answer) {
        initialAnswer = paramValues.answer;
      }

      let initialWordleInput = `Wordle 198 3/6

      ⬛⬛⬛🟩🟨
      🟩⬛⬛🟩⬛
      🟩🟩🟩🟩🟩`;
      if (paramValues.wordleInput) {
        initialWordleInput = paramValues.wordleInput;
      }

      setAnswer(initialAnswer);
      updateWordle(initialWordleInput);
      setIsLoaded(true);
    };

    useParams();

    // document.addEventListener("popstate", useParams);
    // document.addEventListener("load", useParams);

    // return () => {
    //   document.removeEventListener("popstate", useParams);
    //   document.removeEventListener("load", useParams);
    // };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Center>
        <div>
          <h1>ELDROW</h1>
          <Grid
            tiles={wordleMatrix}
            renderTile={(value, location) => {
              if (!isLoaded) {
                return <Cell key={JSON.stringify(location)} />;
              }

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
