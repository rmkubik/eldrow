import React from "react";
import styled from "styled-components";

const BORDER_SIZE = 5;

const normalizeTileValue = (value) => {
  switch (value) {
    case "⬛":
      return "wrong";
    case "🟨":
      return "close";
    case "🟩":
      return "correct";
    default:
      return "empty";
  }
};

const getTileSize = (props) => {
  if (props.outlineColor) {
    return props.theme.tileSize - BORDER_SIZE * 2;
  }

  return props.theme.tileSize;
};

const CellContainer = styled.div`
  background-color: ${(props) => props.bgColor};
  border: ${(props) =>
    props.outlineColor
      ? `${BORDER_SIZE}px solid ${props.outlineColor}`
      : "none"};

  input {
    color: white;
    font-family: "Helvetica";
    font-size: 2.5rem;
    background: none;
    border: none;
    width: ${(props) => `${getTileSize(props)}px`};
    height: ${(props) => `${getTileSize(props)}px`};
    text-align: center;
  }
`;

const getBgColorFromValue = (value) => {
  switch (value) {
    case "wrong":
      return "#474745";
    case "close":
      return "#deba09";
    case "correct":
      return "#21a645";
    case "empty":
    default:
      return "#1f1f1d";
  }
};

const Cell = ({
  value,
  letter = " ",
  answer,
  location,
  onKeyDown = () => {},
  onFocus,
  onBlur,
}) => {
  const tileValue = normalizeTileValue(value);
  const bgColor = getBgColorFromValue(tileValue);

  const hasLetter = letter.trim().length > 0;
  let hasError = false;

  if (hasLetter) {
    if (tileValue === "wrong") {
      hasError = answer.includes(letter);
    }

    if (tileValue === "close") {
      hasError = !answer.includes(letter) || answer[location.col] === letter;
    }

    if (tileValue === "correct") {
      hasError = answer[location.col] !== letter;
    }
  }

  return (
    <CellContainer bgColor={bgColor} outlineColor={hasError && "red"}>
      <input
        value={letter.toUpperCase()}
        id={JSON.stringify(location)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </CellContainer>
  );
};

export default Cell;
