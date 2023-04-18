import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { useHistory, Link } from "react-router-dom";
import { Container, ProgressBar, Row, Col, Button, Table } from 'react-bootstrap';
import io from 'socket.io-client';
import Messages from '../Messages/Messages';
import GameQuestion from '../GameQuestion/GameQuestion';
import ListOfPlayers from '../ListOfPlayers/ListOfPlayers';
import EndGame from '../EndGame/EndGame';
import './GamePlayer.css';

let socket;

const IS_PROD = process.env.NODE_ENV === 'development';
const URL = IS_PROD ? 'http://localhost:5000/' : 'https://testing-egg.herokuapp.com/';

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
    const questionDuration = 20;
    const progress = 100 - ((questionDuration - timeLeft) / questionDuration) * 100;
    const [timerStarted, setTimerStarted] = useState(false);
    const [totalQuestionsNum, setTotalQuestionsNum] = useState(0);
    const [currentQuestionNum, setCurrentQuestionNum] = useState(0);

    const history = useHistory();

    useEffect(() => {
        const { joinRoomName, playerName } = queryString.parse(location.search);
        setJoinRoomName(joinRoomName);
        setPlayerName(playerName);
        socket = io.connect(URL);

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
        socket.on('currentRound', (gameQuestion, gameOptionsArray, gameRound) => {
            setCurrentQuestion(gameQuestion);
            setCurrentOptions(gameOptionsArray);
            setCurrentRound(gameRound);
            setCurrentQuestionNum(gameRound);
            setCorrectAnswer('');
            setGameStart(true);
            setGameEnd(false);
            setClickActivated(true);
        });

        socket.on('correctAnswer', (correctAnswer) => {
            setCorrectAnswer(correctAnswer);
            console.log('Action 2 correctAnswer');
        });

        socket.on('scores', (players) => {
            setPlayers(players);
            setGameEnd(true);
            console.log('score na konci')
        });

        socket.on("getRoomPlayers", (ps) => {
            setPlayersInRoom(ps);
        });

        socket.on('finalPlayerInfo', (client) => {
            setPlayer(client);
        });

        socket.on('timer', (secs) => {
            const elapsed = questionDuration - secs;
            setTimeLeft(questionDuration - elapsed);
            setTimerStarted(true);
        });
    }, [questionDuration]);

    const handleLeaveRoom = () => {
        socket.emit("leaveRoom", playerName);
    };

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

    return (
        <Container>
            {error ? (
                <div className="errorMsg">
                    <p>{errorMsg.error}</p>
                    <Link to="/customgame">Go back</Link>
                </div>
            ) : (
                <>


                    {!gameStart && (
                        <>
                            <div>
                                <h3>Num of questions: {totalQuestionsNum}</h3>
                            </div>
                            {timerStarted ? (
                                <div>
                                    <h3>Game will be started: {timeLeft}</h3>
                                    <ProgressBar animated now={progress} label={`${timeLeft} seconds left`} />
                                </div>
                            ) : (
                                <div>
                                    <h2>Hello, Game player {playerName}!</h2>
                                    <p><strong>Waiting for Game Master to start the game...</strong></p>
                                    <div className="messages-container">
                                        <h3>Activity</h3>
                                        <hr />
                                        <Messages messages={messages} />
                                    </div>
                                    <a href="/lobby">Leave room</a>
                                </div>
                            )}
                        </>
                    )}
                    {gameStart && (
                        <>
                            <div>
                                <h3>Num of questions: {totalQuestionsNum}</h3>
                                <ProgressBar className='num-of-questions-bar' max={totalQuestionsNum} now={currentQuestionNum} label={`${currentQuestionNum}/${totalQuestionsNum} questions`} />
                            </div>
                            {!gameEnd && (
                                <div>
                                    <h3>Time left: {timeLeft}</h3>
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
                            )}
                            {gameEnd && (
                                <EndGame players={players} player={player} />
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