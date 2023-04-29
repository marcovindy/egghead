import React, { useState, useEffect, useContext } from 'react';
import queryString from 'query-string';
import { useHistory, Link } from "react-router-dom";
import { Container, ProgressBar, Row, Col, Button, Table } from 'react-bootstrap';
import io from 'socket.io-client';
import Messages from '../Messages/Messages';
import GameQuestion from '../GameQuestion/GameQuestion';
import ListOfPlayers from '../ListOfPlayers/ListOfPlayers';
import EndGame from '../EndGame/EndGame';
import './GamePlayer.css';
import { AuthContext } from "../../helpers/AuthContext";

import t from "../../i18nProvider/translate";

let socket;

const IS_PROD = process.env.NODE_ENV === 'production';
const API_URL = IS_PROD ? "https://testing-egg.herokuapp.com" : "http://localhost:5000";

const GamePlayer = ({ location }) => {
    const [joinRoomName, setJoinRoomName] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [roomPlayer, setRoomPlayer] = useState([]);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [playersInRoom, setPlayersInRoom] = useState([]);
    const [playerCount, setPlayerCount] = useState([]);
    const [gameStart, setGameStart] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [currentOptions, setCurrentOptions] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [clickActivated, setClickActivated] = useState(true);
    const [players, setPlayers] = useState([]);
    const [gameEnd, setGameEnd] = useState(false);
    const [player, setPlayer] = useState('');
    const [playersInfo, setPlayersInfo] = useState([]);
    const [playersScore, setPlayersScore] = useState([]);
    const [score, setScore] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [duration, setDuration] = useState(10);
    const progress = 100 - ((duration - timeLeft) / duration) * 100;
    const [timerStarted, setTimerStarted] = useState(false);
    const [totalQuestionsNum, setTotalQuestionsNum] = useState(0);
    const [currentQuestionNum, setCurrentQuestionNum] = useState(0);
    const [gameMode, setGameMode] = useState('');

    const [position, setPosition] = useState(0);
    const [earnings, setEarnings] = useState(0);
    const [quizId, setquizId] = useState(0);

    const history = useHistory();

    const { authState } = useContext(AuthContext);



    useEffect(() => {
        const { joinRoomName, playerName, gameMode } = queryString.parse(location.search);
        setJoinRoomName(joinRoomName);
        if (playerName !== authState.username) {
            history.push('/customgame');
        }
        setPlayerName(playerName);
        setGameMode(gameMode);
        socket = io.connect(API_URL);

        window.addEventListener('beforeunload', () => {
            socket.emit('disconnect');
            socket.disconnect();
        });

        socket.emit('joinRoom', { joinRoomName, playerName }, (error) => {
            if (error) {
                setError(true);
                setErrorMsg(error);
                console.log(error);
            }
        });

        socket.on('playerData', (allPlayersInRoom) => {
            setPlayersInRoom(allPlayersInRoom);
            setPlayerCount(allPlayersInRoom.length);
        });

        if (gameMode === 'RankedGame') {
            socket.emit('start.RankedGame', joinRoomName);
        }

        return () => {
            socket.emit('disconnect');
            socket.disconnect();
        };
    }, [location.search]);

    useEffect(() => {
        socket.on('message', (text) => setMessage(text));
        socket.on('message', (message) => setMessages([...messages, message]));
    }, [messages]);

    useEffect(() => {
        socket.on('currentRound', (gameQuestion, gameOptionsArray, gameRound, correctAnswer, totalQuestionsNum) => {
            console.log("correct answer (current round): ", correctAnswer);
            setCorrectAnswer(correctAnswer);
            setCurrentQuestion(gameQuestion);
            setCurrentOptions(gameOptionsArray);
            setCurrentRound(gameRound);
            setCurrentQuestionNum(gameRound);
            setGameStart(true);
            setGameEnd(false);
            setTotalQuestionsNum(totalQuestionsNum);
            setClickActivated(true);
        });

        socket.on('getquizId', (quizId) => {
            setquizId(quizId);
        });

        socket.on('gameEnded', (res) => {
            setPlayers(res);
            setGameEnd(true);
        });

        socket.on("getRoomPlayers", (res) => {
            setPlayersInRoom(res);
        });

        socket.on('finalPlayerInfo', (client) => {
            setPlayer(client);
        });

        socket.on('timerTick', (timeLeftTest, questionDuration) => {
            setDuration(questionDuration);
            console.log('timerTick: ', timeLeftTest);
            const elapsed = questionDuration - timeLeftTest;
            setTimeLeft(questionDuration - elapsed);
            setTimerStarted(true);
        });

        socket.on('nextQuestion', () => {
            console.log('nextQuestion has been sent ');
        });
    }, [duration]);

    useEffect(() => {
        socket.on("errorMsg", (err) => {
            setError(true);
            setErrorMsg(err);
        });

        return () => {
            socket.off("errorMsg");
        };
    }, []);

    const handleClickChange = (val) => {
        setClickActivated(val);
    };

    useEffect(() => {
        socket.on('finalRanking', ({ position, rounds, gameMode }) => {
            setPosition(position);
            setGameMode(gameMode);
            setEarnings(rounds / position);
        });

        return () => {
            socket.off('finalRanking');
        };
    }, []);

    return (
        <Container>
            {error ? (
                <div className="errorMsg">
                    <p>{errorMsg.error}</p>
                    <Link to="/customgame">{t('Go back')}</Link>
                </div>
            ) : (
                <>
                    {!gameStart && (
                        <>
                            {timerStarted ? (
                                <>
                                    {totalQuestionsNum && totalQuestionsNum !== 0 &&
                                        (<div>
                                            <h3>{t('Num of questions')}: {totalQuestionsNum}</h3>
                                        </div>)
                                    }
                                    <div>
                                        <h3>{t('Game will be started')}: {timeLeft}</h3>
                                        <ProgressBar animated now={progress} label={`${timeLeft} seconds left`} />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <h2>{t('hello')} {playerName}!</h2>
                                    <p><strong>{t('Waiting for Game Master to start the game')}...</strong></p>
                                    <div className="messages-container">
                                        <h3>{t('Activity')}</h3>
                                        <hr />
                                        <Messages messages={messages} />
                                    </div>
                                    <a href="/lobby">{t('Leave room')}</a>
                                </div>
                            )}
                        </>
                    )}
                    {gameStart && (
                        <>
                            {!gameEnd && (
                                <>
                                    <div>
                                        <h3>{t('Num of questions')}: {totalQuestionsNum}</h3>
                                        <ProgressBar className='num-of-questions-bar' max={totalQuestionsNum} now={currentQuestionNum} label={`${currentQuestionNum}/${totalQuestionsNum} questions`} />
                                    </div>

                                    <div>
                                        <h3>{t('Time left')}: {timeLeft}</h3>
                                        <ProgressBar animated now={progress} label={`${timeLeft} seconds left`} />
                                        <GameQuestion
                                            currentQuestion={currentQuestion}
                                            currentOptions={currentOptions}
                                            currentRound={currentRound}
                                            playerName={playerName}
                                            socket={socket}
                                            clickStatus={clickActivated}
                                            onClickChange={handleClickChange}
                                            correctAnswer={correctAnswer}
                                        />
                                    </div>
                                </>
                            )}
                            {gameEnd && (
                                <EndGame
                                    socket={socket}
                                    players={playersInRoom}
                                    playerName={playerName}
                                    position={position}
                                    rounds={totalQuestionsNum}
                                    earnings={earnings}
                                    gameMode={gameMode}
                                    roomName={joinRoomName}
                                />
                            )}
                        </>
                    )}
                    {!gameEnd && (
                        <ListOfPlayers playersInRoom={playersInRoom} />
                    )}
                </>
            )}
        </Container>
    );

};

export default GamePlayer;