import React, { useState, useEffect } from "react";
import "./GameQuestion.css";
import t from "../../i18nProvider/translate";
import { Col, Row, Card } from "react-bootstrap";

const GameQuestion = ({
  currentQuestion,
  currentOptions,
  currentRound,
  playerName,
  socket,
  clickStatus,
  onClickChange,
  correctAnswers,
}) => {
  const [playerChoice, setPlayerChoice] = useState("");
  const [clickActivated, setClickActivated] = useState(clickStatus);
  const [optionClasses, setOptionClasses] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setClickActivated(clickStatus);
    setShowAnswer(false);
    setOptionClasses(currentOptions.map(() => "option"));
  }, [clickStatus, currentOptions]);

  useEffect(() => {
    if (showAnswer) {
      const newOptionClasses = currentOptions.map((option) => {
        const isCorrect = correctAnswers.includes(option); 
        const isSelected = playerChoice === option;
        console.log("Hrac vybral ", playerChoice, "option:", option, "Spravna je ", correctAnswers);
        console.log("sprane?", isCorrect);
        return `option${isCorrect ? " correct" : ""}${
          isSelected ? " selected" : ""
        }`;
      });
      setOptionClasses(newOptionClasses);
    }
  }, [showAnswer, playerChoice, currentOptions]);
  
  

  const clickOption = (event) => {
    const choice = event.target.innerText;
    const gameRound = currentRound;

    socket.emit(
      "playerChoice",
      { playerName, choice, gameRound },
      correctAnswers,
      () => {
        console.log("player name", playerName, "choice", playerChoice);
      }
    );
    setPlayerChoice(choice);
    setClickActivated(false);
    onClickChange(false);
    setShowAnswer(true);
  };

  return (
    <div>
      <div className="round-container">
        <h2>
          {t("Question")} {currentRound}
        </h2>
        <h3>{currentQuestion ? currentQuestion.question : "Questions wasn't found."}</h3>
        </div>
      <div className="options-container">
        {currentOptions
          .filter((option) => option !== "")
          .map((option, index) => (
            <div
            className={optionClasses[index]}
            key={index}
            onClick={clickActivated ? clickOption : null}
            >
              {decodeURIComponent(option)}
            </div>
          ))}
      </div>
    </div>
  );
};

export default GameQuestion;
