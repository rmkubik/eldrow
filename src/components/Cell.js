import React from "react";
import styled from "styled-components";

const CellContainer = styled.div`
  background-color: ${(props) => props.bgColor};

  input {
    color: white;
    font-family: "Helvetica";
    font-size: 2.5rem;
    background: none;
    border: none;
    width: ${(props) => `${props.theme.tileSize}px`};
    height: ${(props) => `${props.theme.tileSize}px`};
    text-align: center;
  }
`;

const getBgColorFromValue = (value) => {
  switch (value) {
    case "⬛":
      return "#474745";
    case "🟨":
      return "#deba09";
    case "🟩":
      return "#21a645";
    default:
      return "#1f1f1d";
  }
};

const Cell = ({
  value,
  letter = " ",
  location,
  onKeyDown = () => {},
  onFocus,
  onBlur,
}) => {
  const bgColor = getBgColorFromValue(value);

  return (
    <CellContainer bgColor={bgColor}>
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
