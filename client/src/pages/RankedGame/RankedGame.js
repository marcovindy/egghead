import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useHistory, Link } from "react-router-dom";
import { Row, Button, Container, Modal, Col, Spinner } from "react-bootstrap";

import { PlayCircleFill, HeartFill, EyeFill, PlayFill } from "react-bootstrap-icons";
import { CSSTransition } from "react-transition-group";
import Card from "react-bootstrap/Card";
import axios from "axios";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { AuthContext } from "../../helpers/AuthContext";
import t from "../../i18nProvider/translate";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { uuid } from "short-uuid";
import "../../assets/styles/Cards/Cards.css";
import CheckboxGroup from "../../components/CheckboxGroup/CheckboxGroup";
// import socket from './socket';

let socket;

const RankedGame = () => {
  const { authState } = useContext(AuthContext);
  let history = useHistory();
  const initialValues = {
    categories: [],
  };
  const [time, setTime] = useState();
  const [error, setError] = useState("");
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
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
    axios
      .get(`${API_URL}/categories/all`)
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        setError("Error fetching categories");
        console.log("Categories error: ", error);
      });
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories/all`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [API_URL]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      history.push("/login");
      return;
    }

    socket = io(API_URL);

    socket.on("message", (text) => {
      setServerResMsg(text.text);
    });

    socket.on("gameReady.RankedGame", (roomName, playerName) => {
      const url = `/gameplayer?joinRoomName=${roomName}&playerName=${playerName}&gameMode=RankedGame`;
      setServerResMsg("Hra", roomName, " vytvořena, hráči", playerName);
      setNameOfRoom(roomName);
      let countdown = 5;
      timerRef.current = setInterval(() => {
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

  const joinQueue = (data) => {
    if (!isInQueue) {
      let selectedCategories = data;
      if (selectedCategories.length === 0) {
        selectedCategories = categories.map((category) => category.name);
      }
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

  const selectAllCategories = (setFieldValue) => {
    setFieldValue(
      "categories",
      categories.map((category) => category.name)
    );
  };

  const handleReset = (resetForm) => {
    resetForm();
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
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => joinQueue(values.categories)}
      >
        {({ resetForm, setFieldValue }) => (
          <Form>
            <div className="pb-2 d-flex">
              <div className="categories-group p-5">
                <label>{t("Categories")}: </label>
                <ErrorMessage
                  className="ml-1   text-color-red"
                  name="categories"
                  component="span"
                />
                <div className="d-flex flex-wrap">
                  {categories && categories.length > 0 && (
                    <CheckboxGroup
                      name="categories"
                      options={categories.map((category) => category.name)}
                    />
                  )}
                </div>
              </div>
            </div>
            <Row className="pt-2">
              <Col lg={6} sm={12} className="p-2">
                <Button
                  className="ml-2 m-2"
                  variant="secondary"
                  onClick={() => selectAllCategories(setFieldValue)}
                  disabled={isInQueue}
                >
                  {t("Select All")}
                </Button>
                <Button
                  className="ml-2 m-2"
                  variant="secondary"
                  onClick={() => handleReset(resetForm)}
                  disabled={isInQueue}
                >
                  {t("Reset Categories")}
                </Button>
              </Col>
              <Col lg={6} sm={12} className="p-4">
                <Button className="button-perspective radius-05" type="submit" disabled={isInQueue}>
                  {t("Join Queue")} <PlayFill size={22} color="white" />
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('Looking for opponents')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {serverResMsg ? serverResMsg.toString() : ""} {t('Players in queues')}:{" "}
          {Object.entries(numOfPlayersInQueue)
            .map(([category, count]) => `${category}: ${count}`)
            .join(", ")}
          {time ? <h2>{t('You will be redirect to the game')}: {time}</h2> : ""}

        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          {!time && (
            <>
              <Spinner animation="border" role="status" />
            </>
          )}
          <Button variant="secondary" onClick={handleCloseModal}>
            {t('closeButton')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RankedGame;
