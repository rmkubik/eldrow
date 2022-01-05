import React, { useState } from "react";
import styled from "styled-components";
import { unicodeToBase64 } from "../common/base64";

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

  span {
    border: none;
    font-size: 1.2rem;
    text-align: center;
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
  const [shouldShowCopyText, setShouldShowCopyText] = useState(false);

  return (
    <InputsContainer>
      <textarea onChange={onWordleInputChange}>{wordleInput}</textarea>
      <input value={answer} onChange={onAnswerChange} />
      <button
        onClick={async () => {
          const params = new URLSearchParams();
          params.set("a", answer);
          params.set("p", unicodeToBase64(wordleInput));

          const shareUrl = window.location.origin + "?" + params.toString();

          await navigator.clipboard.writeText(shareUrl);

          setShouldShowCopyText(true);
        }}
      >
        SHARE
      </button>
      {shouldShowCopyText && <span>Copied Share URL to clipboard</span>}
      {/* <button>GENERATE ELDROW</button> */}
    </InputsContainer>
  );
};

export default WordleInput;
