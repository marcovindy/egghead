import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditableTitle from "../../components/EditableTitle/EditableTitle";
import "./Quiz.css";

function Quiz() {
    const API_URL =
        process.env.NODE_ENV === "production"
            ? "https://testing-egg.herokuapp.com"
            : "http://localhost:5000";

    const { id } = useParams();
    const [quizInfo, setQuizInfo] = useState({});
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        axios
            .get(`${API_URL}/quizzes/byquizId/${id}`)
            .then((response) => setQuizInfo(response.data))
            .catch((error) => console.log(error));
    }, [id, API_URL]);

    const handleTitleSave = (newTitle) => {
        axios
            .put(
                `${API_URL}/quizzes/title/byquizId/${id}`,
                { title: newTitle },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            )
            .then((response) =>
                setQuizInfo({ ...quizInfo, title: newTitle })
            )
            .catch((error) => console.log(error));
    };

    const [showForm, setShowForm] = useState(false);

    const handleButtonClick = () => {
        setShowForm(true);
    };

    const handleFormSubmit = (values, actions) => {
        setQuestions([
            ...questions,
            {
                question: values.question,
                answers: [
                    { text: values.answer1, isCorrect: false },
                    { text: values.answer2, isCorrect: false },
                    { text: values.answer3, isCorrect: false },
                    { text: values.answer4, isCorrect: false },
                ],
            },
        ]);
        actions.resetForm();
        console.log(questions);
    };

    return (
        
        <Container className="quiz-container mb-4">
            <Row>
                <Col>
                    <EditableTitle title={quizInfo.title} onTitleSave={handleTitleSave} />
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <h4>Category: Category Name</h4>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <Button onClick={handleButtonClick}>Add Question</Button>
                </Col>
            </Row>
            {showForm && (
                <Row>
                    <Col>
                        <Formik
                            initialValues={{
                                question: "",
                                answer1: "",
                                answer2: "",
                                answer3: "",
                                answer4: "",
                                correctAnswer: "",
                            }}
                            onSubmit={handleFormSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <Row className="mb-3">
                                        <Col>
                                            <label htmlFor="question">Question:</label>
                                            <Field type="text" name="question" className="form-control" />
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col xs={12} lg={6}>
                                            <label htmlFor="answer1">Answer1:</label>
                                            <Field type="text" name="answer1" className="form-control" />
                                        </Col>
                                        <Col xs={12} lg={6}>
                                            <label htmlFor="answer2">Answer2:</label>
                                            <Field type="text" name="answer2" className="form-control" />
                                        </Col>
                                        <Col xs={12} lg={6}>
                                            <label htmlFor="answer3">Answer3:</label>
                                            <Field type="text" name="answer3" className="form-control" />
                                        </Col>
                                        <Col xs={12} lg={6}>
                                            <label htmlFor="answer4">Answer4:</label>
                                            <Field type="text" name="answer4" className="form-control" />
                                        </Col>
                                    </Row>
                                    <Button type="submit" disabled={isSubmitting}>
                                        Submit
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Col>
                </Row>
            )}
            {questions.map((q, index) => (
                <Row key={index}>
                    <Col>
                        <p>{q.question}</p>
                        <p>{q.answer}</p>
                    </Col>
                </Row>
            ))}
        </Container>
    );
}


export default Quiz;
