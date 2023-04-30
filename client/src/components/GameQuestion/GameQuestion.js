import React, { useState } from "react";
import "./GameQuestion.css";
import t from "../../i18nProvider/translate";

const GameQuestion = ({
  currentQuestion,
  currentOptions,
  currentRound,
  playerName,
  socket,
  clickStatus,
  onClickChange,
  correctAnswer,
}) => {
  const [playerChoice, setPlayerChoice] = useState("");
  const [clickActivated, setClickActivated] = useState(clickStatus);

  // Funkce pro zpracování kliknutí na volbu
  const clickOption = (event) => {
    const choice = event.target.innerText; // Získání textu vybrané volby
    const gameRound = currentRound; // Uložení aktuálního kola do proměnné
    // Odeslání volby hráče serveru pomocí socketu
    socket.emit(
      "playerChoice",
      { playerName, choice, gameRound },
      correctAnswer,
      () => {
        console.log("player name", playerName, "choice", playerChoice);
      }
    );
    setPlayerChoice(choice); // Uložení volby hráče do stavu

    // Zamezení dalšímu kliknutí a změna stavu kliknutí v GamePlayer
    setClickActivated(false);
    onClickChange(false);
  };

  return (
    <div>
      <div className="round-container">
        <h2>
          {t("Question")} {currentRound}
        </h2>
      </div>
      {clickStatus === true ? (
        <div className="container">
          <div className="question-container">
            <h2>{decodeURIComponent(currentQuestion.question)}</h2>
          </div>
          <div className="options-container">
            {currentOptions
              .filter((option) => option !== "")
              .map((option, index) => (
                <div className="option" key={index} onClick={clickOption}>
                  {console.log(option)}
                  {decodeURIComponent(option)}
                </div>
              ))}
          </div>
        </div>
      ) : (
        // Zobrazení zvolené volby a správné odpovědi na otázku
        <div>
          <h3 className="h3-chosen-option">
            {t("You chose")}: {playerChoice}
          </h3>
          <h3 className="correct-answer">
            {t("Correct answer is")}: {decodeURIComponent(correctAnswer)}
          </h3>
        </div>
      )}
    </div>
  );
};

export default GameQuestion;
