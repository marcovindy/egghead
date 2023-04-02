import React, { useEffect, useState, useContext, useRef } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";

import Card from 'react-bootstrap/Card';
import { PlayCircleFill, HeartFill, PencilFill } from 'react-bootstrap-icons';

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

    const [showEditTitle, setShowEditTitle] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const inputRef = useRef();

    useEffect(() => {
        axios.get(`${URL}/quizzes/byquizId/${id}`).then((response) => {
            setQuizInfo(response.data);
        });

        // přidání posluchače události pro skrytí pole pro úpravu názvu kvízu při kliknutí mimo něj
        document.addEventListener("mousedown", handleHideInput);
        return () => {
            document.removeEventListener("mousedown", handleHideInput);
        };
    }, []);

    const handleEditTitle = () => {
        setShowEditTitle(true);
    }

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value);
    }

    const handleTitleSave = () => {
        axios.put(`${URL}/quizzes/updateTitle`, { title: newTitle, id: quizInfo.id })
            .then(() => {
                setQuizInfo({ ...quizInfo, title: newTitle });
                setShowEditTitle(false);
            });
    }

    const handleHideInput = (event) => {
        // zkontroluje, zda bylo kliknuto mimo pole pro úpravu názvu kvízu
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setShowEditTitle(false);
        }
    }

    return (
        <Container>
            <Row>
                <h1 >Název kvízu:
                    {showEditTitle ? (
                        <div ref={inputRef}>
                            <input type="text" value={newTitle} onChange={handleTitleChange} />
                            <Button onClick={handleTitleSave}>Uložit</Button>
                        </div>
                    ) : (
                        <span onClick={handleEditTitle}>{quizInfo.title}<PencilFill className="m-2" size={22} /></span>
                    )}
                </h1>
            </Row>
        </Container >
    );
}

export default Quiz;
