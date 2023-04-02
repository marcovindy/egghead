import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";

import EditableTitle from "../../components/EditableTitle/EditableTitle";

function Quiz() {
    const IS_PROD = process.env.NODE_ENV === "development";
    const URL = IS_PROD ? "http://localhost:5000" : "https://testing-egg.herokuapp.com";

    let { id } = useParams();
    const [quizInfo, setQuizInfo] = useState({});

    useEffect(() => {
        axios.get(`${URL}/quizzes/byquizId/${id}`).then((response) => {
            setQuizInfo(response.data);
        });
    }, []);

    const handleTitleSave = (newTitle) => {
        // make a PUT request to update the quiz title
        console.log("Debug: New Title: ", newTitle);
        console.log("Debug: quizId: ", id);
        axios.put(`${URL}/quizzes/title/byquizId/${id}`, { title: newTitle }, {
            headers: { accessToken: localStorage.getItem("accessToken") },
        })
            .then(response => {
                console.log(response);
                // update the quizInfo state with the new title
                setQuizInfo({ ...quizInfo, title: newTitle });
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <Container>
            <Row>
                <EditableTitle title={quizInfo.title} onTitleSave={handleTitleSave} />
            </Row>
        </Container>
    );
}

export default Quiz;
