import React from "react";
import styled from "styled-components";

const InputsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
  padding-top: 2rem;

  * {
    display: block;

    color: white;
    font-family: Helvetica;
    font-size: 1.5rem;

    margin: 0.5rem;
    padding: 0.5rem;

    border: 1px solid white;
    background: none;
  }

  textarea {
    height: 200px;
  }
`;

const WordleInput = ({
  wordleInput,
  answer,
  onAnswerChange,
  onWordleInputChange,
}) => {
  return (
    <InputsContainer>
      <textarea onChange={onWordleInputChange}>{wordleInput}</textarea>
      <input value={answer} onChange={onAnswerChange} />
      {/* <button>GENERATE ELDROW</button> */}
    </InputsContainer>
  );
};

export default WordleInput;
