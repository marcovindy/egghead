import React, { useEffect, useState } from "react";
import { Button, Col, Container, ProgressBar, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import queryString from "query-string";
import { toast } from "react-toastify";
import "./GameMaster.css";
import EndGame from "../EndGame/EndGame";
import GameQuestion from "../GameQuestion/GameQuestion";
import Messages from "../Messages/Messages";
import t from "../../i18nProvider/translate";
import axios from "axios";
import ListOfPlayers from "../ListOfPlayers/ListOfPlayers";
import { Clipboard } from "react-bootstrap-icons";
import Chat from "../Chat/Chat";

let socket; // Proměnná pro ukládání instance soketu pro komunikaci s ostatními hráči

const GameMaster = () => {
  const IS_PROD = process.env.NODE_ENV === "production";
  const API_URL = IS_PROD
    ? "https://testing-egg.herokuapp.com"
    : "http://localhost:5000";
  const [roomName, setRoomName] = useState("");
  const [id, setId] = useState(null); // Quiz ID
  const [masterName, setMasterName] = useState("");

  const [serverResMsg, setServerResMsg] = useState({
    res: "When at least 2 players are in the room, click Start Game",
  });
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [round, setRound] = useState(0);

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [playersInRoom, setPlayersInRoom] = useState([]);
  const [playerCount, setPlayerCount] = useState([]);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0); // Nastavíme 20 sekund do další otázky
  const [isGameRunning, setIsGameRunning] = useState(false);

  const [questionsAreLoading, setQuestionsAreLoading] = useState(true);

  const [totalQuestions, setTotalQuestions] = useState(0);
  const [quizInfo, setQuizInfo] = useState({});

  const [isRoomCreated, setIsRoomCreated] = useState(false);

  const location = useLocation();
  const [position, setPosition] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [gameMode, setGameMode] = useState("");

  const [currentRound, setCurrentRound] = useState(0);
  const [duration, setDuration] = useState(10);
  const [timerStarted, setTimerStarted] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentOptions, setCurrentOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [clickActivated, setClickActivated] = useState(true);
  const [totalQuestionsNum, setTotalQuestionsNum] = useState(0);
  const [currentQuestionNum, setCurrentQuestionNum] = useState(0);
  const [players, setPlayers] = useState([]);
  const [gameEnd, setGameEnd] = useState(false);
  const [player, setPlayer] = useState("");
  const progress = 100 - ((duration - timeLeft) / duration) * 100;

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const roomName = searchParams.get("roomName");
    setId(roomName.split("-")[1]);
    const quizId = roomName.split("-")[1];
    const masterName = searchParams.get("masterName");
    const gameMode = searchParams.get("gameMode");
    socket = io.connect(API_URL);
    setRoomName(roomName);
    setMasterName(masterName);
    socket.emit(
      "createRoom",
      { roomName, masterName, quizId, gameMode },
      (error) => {
        if (error) {
          setError(true);
          setErrorMsg(error);
          console.log("Create room error: ", error);
        }
      }
    );
    setIsRoomCreated(true);

    socket.on("playerData", (allPlayersInRoom) => {
      setPlayersInRoom(allPlayersInRoom);
      setPlayerCount(allPlayersInRoom.length);
      console.log(socket);
    });

    socket.on("createRoomError", (error) => {
      console.log(error);
      setError(true);
      setErrorMsg(error);
    });

    return () => {
      socket.emit("disconnect");
      socket.disconnect();
    };
  }, [API_URL, location]);

  // Funkce pro spuštění hry a odeslání signálu všem hráčům

  const InitGame = () => {
    socket.emit("ready", (res) => {
      setServerResMsg(res);
      setGameEnded(false);
      setGameStarted(true);
    });
  };

  useEffect(() => {
    const fetchQuizInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/quizzes/byquizId/${id}`);
        setQuizInfo(response.data);
        socket.emit("sendQuizInfo", response.data, (error) => {
          if (error) {
            setError(true);
            setErrorMsg(error);
            console.log("Create room error: ", error);
          }
        });
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchQuestions = async () => {
      try {
        console.log(id);
        console.log(API_URL);
        const response = await axios.get(`${API_URL}/questions/byquizId/${id}`);
        const quiz = response.data.quiz;
        const questionsLength = response.data.questions.length;
        console.log(response.data);
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
        console.log(questionsLength, " roundsss ");
        socket.emit(
          "sendQuestionsToServerTest",
          formattedQuestions,
          questionsLength,
          (error) => {
            if (error) {
              setError(true);
              setErrorMsg(error);
              console.log("Create room error: ", error);
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
    if (id && isRoomCreated) {
      fetchQuizInfo();
      fetchQuestions();
    }
    console.log(id, isRoomCreated);
  }, [API_URL, id, isRoomCreated]);

  useEffect(() => {
    const startGame = async () => {
      setGameReady(true);
      await new Promise((resolve) => {
        socket.on("initGame", resolve);
      });
      socket.emit("startTimerTest");

      socket.on("nextQuestion", () => {
        console.log("nextQuestion has been sent ");
      });
    };
    if (!gameReady) {
      startGame();
    }
  }, [socket]);

  useEffect(() => {
    socket.on(
      "currentRound",
      (
        gameQuestion,
        gameOptionsArray,
        gameRound,
        correctAnswers,
        totalQuestionsNum
      ) => {
        console.log("correct answer (current round): ", correctAnswers);
        setCorrectAnswers(correctAnswers);
        setCurrentQuestion(gameQuestion);
        setCurrentOptions(gameOptionsArray);
        setCurrentRound(gameRound);
        setCurrentQuestionNum(gameRound);
        setGameStart(true);
        setGameEnd(false);
        setTotalQuestionsNum(totalQuestionsNum);
        setClickActivated(true);
      }
    );
    socket.on("gameEnded", (res) => {
      setPlayers(res);
      setGameEnd(true);
      setGameEnded(true);
    });

    socket.on("getRoomPlayers", (res) => {
      setPlayersInRoom(res);
    });

    socket.on("finalPlayerInfo", (client) => {
      setPlayer(client);
    });

    socket.on("timerTick", (timeLeftTest, duration) => {
      setDuration(duration);
      const elapsed = duration - timeLeftTest;
      setTimeLeft(duration - elapsed);
      console.log(duration - elapsed);
      setTimerStarted(true);
    });

    socket.on("nextQuestion", () => {
      console.log("nextQuestion has been sent ");
    });
  }, [duration]);

  const handleClickChange = (val) => {
    setClickActivated(val);
  };

  const createGameLink = () => {
    const gameUrl = `${window.location.origin}/game?roomName=${roomName}`;
    return gameUrl;
  };

  const copyGameLink = () => {
    const el = document.createElement("textarea");
    el.value = createGameLink();
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    toast.success("Game link copied to clipboard");
  };

  useEffect(() => {
    socket.on("finalRanking", ({ position, rounds, gameMode }) => {
      setPosition(position);
      setGameMode(gameMode);
      setEarnings(rounds / position);
    });

    return () => {
      socket.off("finalRanking");
    };
  }, []);

  return (
    <Container className="w-100">
      <div className="wrapper w-100">
        {error === true ? (
          <div className="errorMsg">
            <p>{errorMsg.error}</p>
            <a href="/customgame">{t("Go back")}</a>
          </div>
        ) : (
          <div>
            <div className="game-link-container mb-5">
              <h3>{t('Invite players by Game Link')}:</h3>
              <div className="d-flex justify-content-center">
                <div className="border p-3">
                  {createGameLink()}{" "}
                  <Button variant="primary" size="sm" onClick={copyGameLink}>
                    Copy
                  </Button>
                </div>
              </div>
            </div>
            <h2>
              {t("hello")} {masterName}!
            </h2>
            <div className="serverRes">
              <strong>{serverResMsg.res}</strong>
            </div>

            <div className="button-container">
              {gameStarted === true ? (
                <div>
                  {gameEnded ? (
                    <EndGame
                      socket={socket}
                      players={playersInRoom}
                      playerName={masterName}
                      position={position}
                      rounds={totalQuestionsNum}
                      earnings={earnings}
                      gameMode={gameMode}
                      roomName={roomName}
                    />
                  ) : (
                    <div>
                      <h3>
                        {t("Time left")}: {timeLeft}
                      </h3>
                      <ProgressBar
                        animated
                        now={progress}
                        label={`${timeLeft} seconds left`}
                      />
                      {currentQuestion && (
                        <GameQuestion
                          currentQuestion={currentQuestion}
                          currentOptions={currentOptions}
                          currentRound={currentRound}
                          playerName={masterName}
                          socket={socket}
                          clickStatus={clickActivated}
                          onClickChange={handleClickChange}
                          correctAnswers={correctAnswers}
                        />
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-5">
                  {playerCount >= 1 ? (
                    <Button variant="primary" size="md" onClick={InitGame}>
                      {t('Start Game')}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      disabled
                      size="md"
                      onClick={() => {
                        toast.warning(
                          "You need have at least 2 players to play this game."
                        );
                      }}
                    >
                      {t("Start Game")}
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div>
              <h3>
                {t("Num of questions")}: {totalQuestions}
              </h3>
              <ProgressBar
                className="num-of-questions-bar"
                max={totalQuestions}
                now={currentQuestion}
                label={`${currentQuestion}/${totalQuestions} Questions`}
              />
            </div>
            <Row>
              {!gameEnded && (
                <Col lg={6} sm={12}>
                  <ListOfPlayers playersInRoom={playersInRoom} />
                </Col>
              )}
              { isRoomCreated && socket && (
                <Col lg={6} sm={12}>
                  <Chat socket={socket} />
                </Col>
              )}
            </Row>

            <a href="/customgame">Leave room</a>
          </div>
        )}
      </div>
    </Container>
  );
};

export default GameMaster;
