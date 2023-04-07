import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { Button, Container, ProgressBar, Row, Col } from 'react-bootstrap';
import io from 'socket.io-client';
import Messages from '../Messages/Messages';
import './GameMaster.css';
import GameQuestion from '../GameQuestion/GameQuestion';
import EndGame from '../EndGame/EndGame';
import t from "../../i18nProvider/translate";
import { toast } from 'react-toastify';

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

    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);

    const questionDuration = 20;
    const [timeLeft, setTimeLeft] = useState(questionDuration); // Nastavíme 20 sekund do další otázky
    const [isGameRunning, setIsGameRunning] = useState(false);


    useEffect(() => {
        const { roomName, masterName } = queryString.parse(location.search);
        socket = io.connect(server);
        setRoomName(roomName);
        setMasterName(masterName);



        socket.emit('createRoom', { roomName, masterName }, (error) => {
            if (error) {
                setError(true);
                setErrorMsg(error);
                console.log("Create room error: ", error);
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
            setIsGameRunning(false);
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

    // Funkce pro spuštění Timeru
    const startTimer = () => {
        setTimeLeft(questionDuration); // reset the timer
    };

    // Efekt pro spuštění Timeru, když hra začíná a když skončí, tak se vypne
    useEffect(() => {
        if (gameStarted && !gameEnded) {
            setIsGameRunning(true);
            socket.emit('startTimer');
            const intervalId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [gameStarted]);

    const progress = 100 - ((questionDuration - timeLeft) / questionDuration) * 100;


    // Efekt pro získání další otázky, když časovač dosáhne nuly
    useEffect(() => {
        if (timeLeft === 0) {
            if (!gameEnded) {
                startTimer(); // reset the timer
                NextQuestion(); // get the next question
                socket.emit('startTimer');
                console.log(timeLeft);
            }
        }
    }, [timeLeft]);


    // useEffect(() => {
    //     socket.on('timer', (secs) => {
    //         const elapsed = questionDuration - secs;
    //         setTimeLeft(questionDuration - elapsed);
    //         console.log(timeLeft);
    //     });
    // }, []);


    return (
        <Container>
            {gameStarted === true && gameEnded === false ? (
                <div>
                    <h3>Time Left: {timeLeft}</h3>
                    <ProgressBar animated now={progress} label={`${timeLeft} seconds left`} />
                </div>
            ) : (
                <div>
                </div>
            )
            }

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
                                        <div></div>
                                    )
                                    }
                                </div>
                            ) : (
                                <div>
                                    {playerCount >= 2 ? (

                                        <Button variant="primary" size="md" onClick={InitGame}>Start Game</Button>
                                    ) : (
                                        <Button variant="primary" disabled size="md" onClick={() => {
                                            toast.warning('You need have at least 2 players to play this game.');
                                        }}>Start Game</Button>
                                    )
                                    }
                                    <Button variant="primary" size="md" className='m-2'
                                        onClick={() => {
                                            toast.warning(t('featureInDevelopment'));
                                        }}>

                                        Join Game as Player
                                    </Button>

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
                        <a href="/customgame">Leave room</a>
                    </div>
                )}
            </div>
        </Container >
    );
};

export default GameMaster;