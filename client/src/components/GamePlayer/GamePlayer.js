import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { useHistory, Link } from "react-router-dom";
import { Container, ProgressBar, Row, Col, Button, Table } from 'react-bootstrap';
import io from 'socket.io-client';
import Messages from '../Messages/Messages';
import GameQuestion from '../GameQuestion/GameQuestion';
import ListOfPlayers from '../ListOfPlayers/ListOfPlayers';
import EndGame from '../EndGame/EndGame';
import Scoreboard from '../Scoreboard/Scoreboard';


let socket;

const GamePlayer = ({ location }) => {

    const IS_PROD = process.env.NODE_ENV === "development";
    const URL = IS_PROD ? "http://localhost:5000/" : "https://testing-egg.herokuapp.com/";
    const server = URL;
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

    // game end
    const [players, setPlayers] = useState([]); // to get final score
    const [gameEnd, setGameEnd] = useState(false);
    const [player, setPlayer] = useState(''); // to get each client final score

    const [playersInfo, setPlayersInfo] = useState([]);
    const [playersScore, setPlayersScore] = useState([]);
    const [score, setScore] = useState([]);

    const [timeLeft, setTimeLeft] = useState(0);
    const questionDuration = 20;
    const progress = 100 - ((questionDuration - timeLeft) / questionDuration) * 100;
    const [timerStarted, setTimerStarted] = useState(false);

    useEffect(() => {
        const { joinRoomName, playerName } = queryString.parse(location.search);
        socket = io.connect(server);
        setJoinRoomName(joinRoomName);
        setPlayerName(playerName);

        socket.emit('joinRoom', { joinRoomName, playerName }, (error) => {
            if (error) {
                setError(true);
                setErrorMsg(error);
                console.log(error);
            };
        });

        socket.on('playerData', (allPlayersInRoom) => {
            setPlayersInRoom(allPlayersInRoom); // is empty the first time, but it is set the next time
            setPlayerCount(allPlayersInRoom.length);
        });

        return () => {
            socket.emit('disconnect');
            socket.disconnect();
        };
    }, [server]);

    useEffect(() => {
        socket.on('message', (text) => {
            setMessage(text);
        });
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });
    }, [messages]);

    useEffect(() => {
        socket.on('currentRound', (gameQuestion, gameOptionsArray, gameRound) => {
            setCurrentQuestion(gameQuestion);
            setCurrentOptions(gameOptionsArray);
            setCurrentRound(gameRound);
            setCorrectAnswer('');
            setGameStart(true);
            setGameEnd(false);
            setClickActivated(true);
        });
    }, []);

    // set value to false from click function in GameQuestion (onClickChange)
    const handleClickChange = (val) => {
        setClickActivated(val);
    };

    useEffect(() => {
        socket.on('correctAnswer', (correctAnswer) => {
            setCorrectAnswer(correctAnswer);
            console.log('Action 2 correctAnswer');
        });
    }, []);

    useEffect(() => {
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
    }, []);


    useEffect(() => {
        socket.on('timer', (secs) => {
            const elapsed = questionDuration - secs;
            setTimeLeft(questionDuration - elapsed);
            setTimerStarted(true);
        });
    }, []);


    return (
        <Container>
            <div>

            </div>
            <div className="wrapper">
                {error === true ? (
                    <div className="errorMsg">
                        <p>{errorMsg.error}</p>
                        <Link to="/customgames">Go back</Link>
                    </div>
                ) : (
                    <div>
                        {gameStart === false ? (
                            <>
                                {timerStarted === true ? (
                                    <div>
                                        <h3>Game will be started: {timeLeft}</h3>
                                        <ProgressBar animated now={progress} label={`${timeLeft} seconds left`} />
                                    </div>
                                ) : (
                                    ""
                                )}
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
                            </>
                        ) : (
                            <div>



                                {gameEnd === false ? (
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
                                        {/* <Scoreboard playersInRoom={playersInRoom} /> */}
                                    </div>
                                ) : (
                                    <EndGame players={players} player={player} />
                                )
                                }
                            </div>
                        )
                        }
                    </div>
                )
                }
                {gameEnd === false ? (
                    <div className="players-container">
                        {playersInRoom.length > 0 ? (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Player name</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {playersInRoom.map((playerInfo, index) =>
                                        <tr key={index}>
                                            <td>{playerInfo.username}</td>
                                            <td>{playerInfo.score}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        ) : (
                            <p>No players in the room yet...</p>
                        )}
                    </div>
                ) : (
                    ""
                )
                }

            </div>

        </Container>
    );
};

export default GamePlayer;