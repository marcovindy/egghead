import React, { useEffect, useState, useContext, useMemo, useRef, useCallback } from "react";
import { useHistory, Link } from "react-router-dom";
import { Image, Row, Col, Button, Container } from 'react-bootstrap';
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



const RankedGame = () => {

    const IS_PROD = process.env.NODE_ENV === "development";
    const API_URL = IS_PROD ? "http://localhost:5000" : "https://testing-egg.herokuapp.com";
    const { authState } = useContext(AuthContext);
    let history = useHistory();

    useEffect(() => {

        const socket = io(API_URL);

    }, []);

    return (
        <Container>
            <Row>

            </Row>
        </Container>
    )
};

export default RankedGame;