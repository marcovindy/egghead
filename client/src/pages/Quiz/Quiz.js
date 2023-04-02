import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";

import Card from 'react-bootstrap/Card';
import { PlayCircleFill, HeartFill } from 'react-bootstrap-icons';

import imgUrl from "../../assets/images/egg2.png";
import { common } from "@material-ui/core/colors";

const img = "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__340.jpg";

function Quiz() {
    const IS_PROD = process.env.NODE_ENV === "development";
    const URL = IS_PROD ? "http://localhost:5000" : "https://testing-egg.herokuapp.com";

    let { id } = useParams();
    let history = useHistory();
    const { authState } = useContext(AuthContext);
    const [quizInfo, setQuizInfo] = useState({});

    useEffect(() => {


        axios.get(`${URL}/quizzes/byquizId/${id}`).then((response) => {
            setQuizInfo(response.data);
        });
    }, []);

    return (
        <Container>
            <Row>
                <h1>Název kvízu: {quizInfo.title}</h1>

            </Row>
        </Container >
    );
}

export default Quiz;
