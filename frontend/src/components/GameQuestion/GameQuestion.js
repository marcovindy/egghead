import React, { useState } from 'react';
import './GameQuestion.css';

const GameQuestion = ({ currentQuestion, currentOptions, currentRound, playerName, socket, clickStatus, onClickChange, correctAnswer }) => {
    const [playerChoice, setPlayerChoice] = useState('');
    const [clickActivated, setClickActivated] = useState(clickStatus); // true by default
    
    const clickOption = (event) => {
        const choice = event.target.innerText;
        const gameRound = currentRound;
        socket.emit('playerChoice', { playerName, choice, gameRound }, () => {
            console.log('player name', playerName, 'choice', playerChoice);
        });
        setPlayerChoice(choice);

        setClickActivated(false);
        onClickChange(false); // handleClickChange in GamePlayer
    };

    return (
        <div>
            <div className="round-container">
                <h2>Question {currentRound}</h2>
            </div>
            { clickStatus === true ? (
                <div className="container">
                    <div className="question-container">
                        <h2>{decodeURIComponent(currentQuestion.question)}</h2>
                    </div>
                    <div className="options-container">
                        { currentOptions.map((option, index) =>
                            <div className="option" key={index} onClick={clickOption}>
                                {decodeURIComponent(option)}
                            </div>
                            )
                        }
                    </div>
                </div>
            ) : (
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