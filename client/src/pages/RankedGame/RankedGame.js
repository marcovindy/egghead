import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useHistory, Link } from "react-router-dom";
import {
  Image,
  Row,
  Col,
  Button,
  Container,
  Modal,
  Form,
} from "react-bootstrap";
import { PlayCircleFill, HeartFill, EyeFill } from "react-bootstrap-icons";
import { CSSTransition } from "react-transition-group";
import Card from "react-bootstrap/Card";
import axios from "axios";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { AuthContext } from "../../helpers/AuthContext";
import t from "../../i18nProvider/translate";
import { uuid } from "short-uuid";
import "../../assets/styles/Cards/Cards.css";
// import socket from './socket';

let socket; // Proměnná pro ukládání instance soketu pro komunikaci s ostatními hráči

const RankedGame = () => {
  const { authState } = useContext(AuthContext);
  let history = useHistory();

  const [time, setTime] = useState();
  const [serverResMsg, setServerResMsg] = useState("");
  const [isInQueue, setIsInQueue] = useState(false);
  const [nameOfRoom, setNameOfRoom] = useState("");
  const [numOfPlayersInQueue, setNumOfPlayersInQueue] = useState({});
  const [showModal, setShowModal] = useState(false);
  const IS_PROD = process.env.NODE_ENV === "production";
  const API_URL = IS_PROD
    ? "https://testing-egg.herokuapp.com"
    : "http://localhost:5000";
  const timerRef = useRef(null);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const handleCategoryChange = (event) => {
    const { options } = event.target;
    const selectedOptions = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedOptions.push(options[i].value);
      }
    }
    setSelectedCategories(selectedOptions);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      history.push("/login");
      return;
    }

    socket = io(API_URL);

    socket.on("message", (text) => {
      setServerResMsg(text.text);
      console.log("message", text.text);
    });

    socket.on("gameReady.RankedGame", (roomName, playerName) => {
      console.log("gameReady.RankedGame", roomName, playerName);
      const url = `/gameplayer?joinRoomName=${roomName}&playerName=${playerName}&gameMode=RankedGame`;
      setServerResMsg("Hra", roomName, " vytvořena, hráči", playerName);
      setNameOfRoom(roomName);
      let countdown = 5;
      timerRef.current = setInterval(() => {
        console.log(`Přesměrování za ${countdown} sekund.`);
        setTime(countdown);
        countdown--;
        if (countdown === 0) {
          clearInterval(timerRef.current);
          history.push(url);
        }
      }, 1000);
    });

    socket.on("userLeft.RankedGame", () => {
      setServerResMsg(
        "Hráč se bohužel odpojil ze hry. Připojte se prosím znovu do fronty."
      );
      clearInterval(timerRef.current);
      setTime(null);
    });

    window.addEventListener("beforeunload", () => {
      socket.emit("userLeftForServer.RankedGame", nameOfRoom);
    });

    socket.on("queueUpdate.RankedGame", (queueLength) => {
      console.log("Players in queue: ", queueLength);
      setNumOfPlayersInQueue(queueLength);
    });

    // Odpojení socketu, pokud uživatel opustil stránku RankedGame
    return () => {
      socket.emit("disconnect");
      socket.disconnect();
    };
  }, [API_URL]);

  const joinQueue = () => {
    if (!isInQueue) {
      socket.emit(
        "joinQueue.RankedGame",
        authState.username,
        selectedCategories,
        (res) => {
          setServerResMsg(res.res);
          setIsInQueue(true);
          setShowModal(true);
          console.log(res);
        }
      );
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsInQueue(false);
    setServerResMsg("");
    // Zrušení časovače
    clearInterval(timerRef.current);
    setTime(null);
    // Odpojíme se z queue
    socket.emit("leaveQueue.RankedGame", authState.username);
    socket.emit("userLeftForServer.RankedGame", nameOfRoom);
  };

  return (
    <Container>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Vyhledávání hry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {serverResMsg ? serverResMsg.toString() : ""} Hráčů ve frontě:{" "}
          {Object.entries(numOfPlayersInQueue)
            .map(([category, count]) => `${category}: ${count}`)
            .join(", ")}
          {time ? <h2>Přesměrování do hry proběhne za {time}</h2> : ""}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Zavřít
          </Button>
        </Modal.Footer>
      </Modal>

      <Form>
        <Form.Group controlId="categorySelect">
          <Form.Label>Vyberte kategorie:</Form.Label>
          <Form.Control as="select" multiple onChange={handleCategoryChange}>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
          </Form.Control>
        </Form.Group>
      </Form>

      <Button onClick={joinQueue} disabled={isInQueue}>
        Join Queue
      </Button>
    </Container>
  );
};

export default RankedGame;
