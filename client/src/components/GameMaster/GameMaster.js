import React, { useEffect, useState } from 'react';
import { Button, Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { useLocation } from "react-router-dom";
import io from 'socket.io-client';
import queryString from 'query-string';
import { toast } from 'react-toastify';
import './GameMaster.css';
import EndGame from '../EndGame/EndGame';
import GameQuestion from '../GameQuestion/GameQuestion';
import Messages from '../Messages/Messages';
import t from "../../i18nProvider/translate";
import axios from 'axios';


let socket;     // Proměnná pro ukládání instance soketu pro komunikaci s ostatními hráči



const GameMaster = () => {

    const IS_PROD = process.env.NODE_ENV === "development";
    const API_URL = IS_PROD ? "http://localhost:5000/" : "https://testing-egg.herokuapp.com/";
    const server = API_URL;
    const [roomName, setRoomName] = useState('');
    const [id, setId] = useState(114); // Quiz ID
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
    const [gameReady, setGameReady] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);

    const questionDuration = 20;
    const [timeLeft, setTimeLeft] = useState(questionDuration); // Nastavíme 20 sekund do další otázky
    const [isGameRunning, setIsGameRunning] = useState(false);

    const [questionsAreLoading, setQuestionsAreLoading] = useState(true);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [quizInfo, setQuizInfo] = useState({});



    const location = useLocation();


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const roomName = searchParams.get("roomName");
        setId(roomName.split("-")[1]);
        const masterName = searchParams.get("masterName");
        // console.log("id:", id, "roomName:", roomName, "masterName:", masterName);

        // console.log("location: ", location);
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
    }, [server, location]);

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
            setGameEnded(false);
            setGameStarted(true);
        });
    };

    useEffect(() => {
        const fetchQuizInfo = async () => {
            try {
                const response = await axios.get(`${API_URL}quizzes/byquizId/${id}`);
                setQuizInfo(response.data);
                socket.emit('sendQuizInfo', response.data);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${API_URL}questions/byquizId/${id}`);
                const quiz = response.data.quiz;
                const formattedQuestions = response.data.questions.map((question) => {
                    const formattedAnswers = question.Answers.map((answer) => ({
                        text: answer.answer,
                        isCorrect: answer.isCorrect,
                    }));
                    return {
                        question: question.question,
                        answers: formattedAnswers,
                    };
                });
                setQuestions(formattedQuestions);
                setTotalQuestions(formattedQuestions.length);
                setQuestionsAreLoading(false);
                socket.emit('sendQuestionsToServerTest', formattedQuestions);
            } catch (error) {
                console.log(error);
            }
        };
        fetchQuizInfo();
        fetchQuestions();
    }, [API_URL, id]);

    useEffect(() => {
        const startGame = async () => {
            setGameReady(true);
            await new Promise((resolve) => {
                socket.on('initGame', resolve);
            });
            socket.emit('startTimerTest');
            socket.on('timerTick', (timeLeftTest) => {
                console.log('timerTick: ', timeLeftTest);
                setTimeLeft(timeLeftTest);
            });
            socket.on('nextQuestion', () => {
                console.log('nextQuestion has been sent ');
            });
        };
        if (!gameReady) {
            startGame();
        }
    }, [socket]);



    // Funkce pro odeslání otázky všem hráčům a uložení správné odpovědi

    // const sendQuestion = (questionObj) => {
    //     if (round <= questionObj.length) {
    //         const gameQuestion = questionObj[round].question;
    //         const answers = questionObj[round].answers;
    //         const correctAnswer = answers.find(answer => answer.isCorrect).text;
    //         const incorrectAnswers = answers.filter(answer => !answer.isCorrect);
    //         const gameOptionsArray = [
    //             ...incorrectAnswers.map(answer => answer.text)
    //         ];
    //         const randomNumber = Math.random() * 3;
    //         const position = Math.floor(randomNumber) + 1;
    //         gameOptionsArray.splice(position - 1, 0, correctAnswer); // startpos: 0, delete 0, add
    //         setCorrectAnswer(correctAnswer);
    //         setRound(prevRound => { return prevRound + 1 });
    //         const gameRound = round + 1;
    //         setCurrentQuestion(round + 1);
    //         socket.emit('showQuestion', { gameQuestion, gameOptionsArray, gameRound });
    //     }
    // };

    // Funkce pro přechod na další otázku a odeslání informace o všech hráčích na server

    // const NextQuestion = () => {
    //     if (round !== questions.length) {
    //         sendQuestion(questions);
    //         socket.emit('playerBoard');
    //     } else {
    //         setIsGameRunning(false);
    //         socket.emit('endGame');
    //         socket.emit('playerBoard');
    //         setServerResMsg({ res: 'The game has ended! You can play again if there are enough players.' });
    //         setGameEnded(true);
    //     };
    // };

    // useEffect(() => {
    //     socket.on('playerChoice', (playerName, playerChoice, gameRound,  correctAnswer) => {
    //         if (gameRound === round) {
    //             if (playerChoice === decodeURIComponent(correctAnswer)) {
    //                 console.log(playerName, 'has answered CORRECTLY:', playerChoice);
    //                 socket.emit('updateScore', playerName);
    //             };
    //             socket.emit('correctAnswer', correctAnswer, playerName);
    //         };
    //         setServerResMsg({ res: 'When all players have answered, click Next question' });
    //     });
    // }, [round]);


    const progress = 100 - ((questionDuration - timeLeft) / questionDuration) * 100;


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

                        </div> <div>
                            <h3>Number of questions: {totalQuestions}</h3>
                            <ProgressBar className='num-of-questions-bar' max={totalQuestions} now={currentQuestion} label={`${currentQuestion}/${totalQuestions} Questions`} />
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