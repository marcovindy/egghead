import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { Button, Container } from 'react-bootstrap';
import io from 'socket.io-client';
import Messages from '../Messages/Messages';
import './GameMaster.css';
import GameQuestion from '../GameQuestion/GameQuestion';
import EndGame from '../EndGame/EndGame';

let socket;     // Proměnná pro ukládání instance soketu pro komunikaci s ostatními hráči



const GameMaster = ({ location }) => {

    const IS_PROD = process.env.NODE_ENV === "development";
    const URL = IS_PROD ? "http://localhost:5000/" : "https://testing-egg.herokuapp.com/";
    const server = URL;
    const [roomName, setRoomName] = useState('');
    const [masterName, setMasterName] = useState('');

    const [serverResMsg, setServerResMsg] = useState({ res: 'When at least 2 players are in the room, click Start Game' });
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const [questions, setQuestions] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [round, setRound] = useState(0);

    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [playersInRoom, setPlayersInRoom] = useState([]);
    const [playerCount, setPlayerCount] = useState([]);

    const [gameStarted, setGameStarted] = useState([]);
    const [gameEnded, setGameEnded] = useState([]);

    useEffect(() => {
        const { roomName, masterName } = queryString.parse(location.search);
        socket = io.connect(server);
        setRoomName(roomName);
        setMasterName(masterName);

        socket.emit('createRoom', { roomName, masterName }, (error) => {
            if (error) {
                setError(true);
                setErrorMsg(error);
                console.log(error);
            };
        });

        socket.on('playerData', (allPlayersInRoom) => {
            setPlayersInRoom(allPlayersInRoom);
            setPlayerCount(allPlayersInRoom.length);
        });

        return () => {
            socket.emit('disconnect');
            socket.disconnect();
        };
    }, [server, location.search]);

    useEffect(() => {
        socket.on('message', (text) => {
            setMessage(text);
        });

        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });
    }, [messages]);

    // Funkce pro spuštění hry a odeslání signálu všem hráčům

    const InitGame = () => {
        socket.emit('ready', (res) => {
            setServerResMsg(res);
            setGameStarted(true);
            setGameEnded(false);

        });
    };

    useEffect(() => {
        socket.on('initGame', () => {
            setRound(0);
            const response = fetch(`https://opentdb.com/api.php?amount=4&type=multiple&encode=url3986`)
                .then(response => response.json())
                .then(res => {
                    setQuestions(res.results);
                    sendQuestion(res.results);
                    console.log("Created");

                });
        });
    }, []);

    // Funkce pro odeslání otázky všem hráčům a uložení správné odpovědi

    const sendQuestion = (questionObj) => {
        const gameQuestion = questionObj[round].question;
        const incorrectOptions = questionObj[round].incorrect_answers;
        const correctOption = questionObj[round].correct_answer;

        const gameOptionsArray = [...incorrectOptions];
        const randomNumber = Math.random() * 3;
        const position = Math.floor(randomNumber) + 1;
        gameOptionsArray.splice(position - 1, 0, correctOption); // startpos: 0, delete 0, add
        setCorrectAnswer(correctOption);

        setRound(prevRound => { return prevRound + 1 }); // setRound for next render, prevRound: holds the round number

        const gameRound = round + 1;
        socket.emit('showQuestion', { gameQuestion, gameOptionsArray, gameRound });
    };

    // Funkce pro přechod na další otázku a odeslání informace o všech hráčích na server

    const NextQuestion = () => {
        if (round !== questions.length) {
            sendQuestion(questions);
            socket.emit('playerBoard');
        } else {
            socket.emit('endGame');
            socket.emit('playerBoard');
            setServerResMsg({ res: 'The game has ended! You can play again if there are enough players.' });
            setGameEnded(true);
        };
    };

    useEffect(() => {
        socket.on('playerChoice', (playerName, playerChoice, gameRound) => {
            if (gameRound === round) {
                if (playerChoice === decodeURIComponent(correctAnswer)) {
                    console.log(playerName, 'has answered CORRECTLY:', playerChoice);
                    socket.emit('updateScore', playerName);
                };
                socket.emit('correctAnswer', correctAnswer, playerName);
            };
            setServerResMsg({ res: 'When all players have answered, click Next question' });
        });
    }, [round]);

    return (
        <Container>
            <div className="wrapper">
                {error === true ? (
                    <div className="errorMsg">
                        <p>{errorMsg.error}</p>
                        <a href="/">Go back</a>
                    </div>
                ) : (
                    <div>
                        <h2>Hello, Game Master {masterName}!</h2>
                        <div className="serverRes">
                            <strong>{serverResMsg.res}</strong>
                        </div>
                        <div className="button-container">

                            {gameStarted === true ? (
                                <div>
                                    {gameEnded === true ? (
                                        <div>
                                            {playerCount >= 2 ? (
                                                <Button variant="primary" size="md" onClick={InitGame}>Play Again</Button>
                                            ) : (
                                                <Button variant="primary" disabled size="md" onClick={InitGame}>Play Again</Button>
                                            )
                                            }
                                        </div>
                                    ) : (
                                        <div>
                                            <Button variant="primary" size="md" onClick={NextQuestion}>Next question</Button>

                                        </div>
                                    )
                                    }
                                </div>
                            ) : (
                                <div>
                                    {playerCount >= 2 ? (

                                        <Button variant="primary" size="md" onClick={InitGame}>Start Game</Button>
                                    ) : (
                                        <Button variant="primary" disabled size="md" onClick={InitGame}>Start Game</Button>
                                    )
                                    }
                                </div>
                            )
                            }

                        </div>
                        <div className="players-container">
                            <h3>Players in room: {playerCount}</h3>
                            <hr />
                            {playersInRoom.map((playerInfo, index) =>
                                <p className="p-players" key={index}>
                                    Playername: {playerInfo.username}
                                </p>
                            )}
                        </div>
                        <div className="messages-container">
                            <h3>Activity</h3>
                            <hr />
                            <Messages messages={messages} />
                        </div>
                        <a href="/">Leave room</a>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default GameMaster;