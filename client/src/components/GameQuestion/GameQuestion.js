import React, { useState } from 'react';
import './GameQuestion.css';

const GameQuestion = ({ currentQuestion, currentOptions, currentRound, playerName, socket, clickStatus, onClickChange, correctAnswer }) => {
    const [playerChoice, setPlayerChoice] = useState('');
    const [clickActivated, setClickActivated] = useState(clickStatus); // true by default

    // Funkce pro zpracování kliknutí na volbu
    const clickOption = (event) => {
        const choice = event.target.innerText; // Získání textu vybrané volby
        const gameRound = currentRound; // Uložení aktuálního kola do proměnné
        // Odeslání volby hráče serveru pomocí socketu
        socket.emit('playerChoice', { playerName, choice, gameRound }, () => {
            console.log('player name', playerName, 'choice', playerChoice);
        });
        setPlayerChoice(choice); // Uložení volby hráče do stavu

        // Zamezení dalšímu kliknutí a změna stavu kliknutí v GamePlayer
        setClickActivated(false);
        onClickChange(false);
    };


    return (
        <div>
            <div className="round-container">
                <h2>Question {currentRound}</h2>
            </div>
            {clickStatus === true ? (
                <div className="container">
                    <div className="question-container">
                        <h2>{decodeURIComponent(currentQuestion.question)}</h2>
                    </div>
                    <div className="options-container">
                        {currentOptions.map((option, index) =>
                            <div className="option" key={index} onClick={clickOption}>
                                {decodeURIComponent(option)}
                            </div>
                        )
                        }
                    </div>
                </div>
            ) : (
                // Zobrazení zvolené volby a správné odpovědi na otázku
                <div>
                    <h3 className="h3-chosen-option">You chose: {playerChoice}</h3>
                    <p className="correct-answer">Correct answer is: {decodeURIComponent(correctAnswer)}</p>
                </div>
            )
            }
        </div>
    );
};

export default GameQuestion;