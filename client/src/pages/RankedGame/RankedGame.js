import React, { useEffect, useState, useContext, useMemo, useRef, useCallback } from "react";
import { useHistory, Link } from "react-router-dom";
import { Image, Row, Col, Button, Container, Modal } from 'react-bootstrap';
import { PlayCircleFill, HeartFill, EyeFill } from 'react-bootstrap-icons';
import { CSSTransition } from 'react-transition-group';
import Card from 'react-bootstrap/Card';
import axios from "axios";
import io from "socket.io-client";
import { toast } from 'react-toastify';
import { AuthContext } from "../../helpers/AuthContext";
import t from "../../i18nProvider/translate";
import { uuid } from 'short-uuid';
import '../../assets/styles/Cards/Cards.css';
// import socket from './socket';

let socket;     // Proměnná pro ukládání instance soketu pro komunikaci s ostatními hráči

const RankedGame = () => {

    const { authState } = useContext(AuthContext);
    let history = useHistory();

    const [serverResMsg, setServerResMsg] = useState('');
    const [isInQueue, setIsInQueue] = useState(false);
    const [numOfPlayersInQueue, setNumOfPlayersInQueue] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const IS_PROD = process.env.NODE_ENV === "development";
    const API_URL = IS_PROD ? "http://localhost:5000" : "https://testing-egg.herokuapp.com";




    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            history.push("/login");
            return;
        }

        socket = io(API_URL);

        console.log("UseEffect 1x");
        console.log("socket: ", socket);

        
        socket.on('message', (text) => {
            setServerResMsg(text.text);
            console.log("message", text.text);
        });

        socket.on('gameReady.RankedGame', (roomName, playerName) => {
            console.log("gameReady.RankedGame", roomName, playerName);
            if (playerName === authState.username) {
                playerName = authState.username;
                const url = `/gameplayer?joinRoomName=${roomName}&playerName=${playerName}`;
                // history.push(url);
                setServerResMsg("Hra",roomName," vytvořena, hráči", playerName, url);
                console.log("Hra",roomName," vytvořena, hráči", playerName, url);
            } else {
                setServerResMsg("Někde se stala chyba.");
                console.log("Někde se stala chyba.");
            }
        });

        socket.on('queueUpdate.RankedGame', (queueLength) => {
            console.log("Players in queue: ", queueLength);
            setNumOfPlayersInQueue(queueLength);
        });

        // Odpojení socketu, pokud uživatel opustil stránku RankedGame
        return () => {
            socket.emit('disconnect');
            socket.disconnect();
        };
    }, [API_URL]);

    
    const joinQueue = () => {
        console.log("Klik na joinQueue 1x");
        socket.emit('joinQueue.RankedGame', authState.username, (res) => {
            console.log("Pripojeni 1x");
            setServerResMsg(res.res);
            setIsInQueue(true);
            setShowModal(true);
            console.log(res);
        });
    };
   
    const handleCloseModal = () => {
        setShowModal(false);
        setIsInQueue(false);
        setServerResMsg('');
        // Odpojíme se z queue
        socket.emit('leaveQueue.RankedGame', authState.username);
    };

    return (
        <Container>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Vyhledávání hry</Modal.Title>
                </Modal.Header>
                <Modal.Body>{serverResMsg ? serverResMsg.toString() : ''} Hráčů ve frontě {numOfPlayersInQueue}.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Zavřít
                    </Button>
                </Modal.Footer>
            </Modal>
            <Button onClick={joinQueue}>Join Queue</Button>
        </Container>
    )
};

export default RankedGame;