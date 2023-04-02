import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditableTitle from "../../components/EditableTitle/EditableTitle";
import "./Quiz.css";
import * as Yup from "yup";
import { toast } from 'react-toastify';

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

    const validationSchema = Yup.object().shape({
        question: Yup.string().required("Question is required"),
        answer1: Yup.string().required("Answer1 is required"),
        answer2: Yup.string().required("Answer2 is required")
    });


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
        if (values.correctAnswer) {
            // A radio button has been selected
            setQuestions([
                ...questions,
                {
                    question: values.question,
                    answers: [
                        { text: values.answer1, isCorrect: values.correctAnswer === "answer1" },
                        { text: values.answer2, isCorrect: values.correctAnswer === "answer2" },
                        { text: values.answer3, isCorrect: values.correctAnswer === "answer3" },
                        { text: values.answer4, isCorrect: values.correctAnswer === "answer4" },
                    ],
                },
            ]);
            actions.resetForm();
        } else {
            // No radio button has been selected
            toast.error("Please select a correct answer");
        }
    };


    useEffect(() => {
        console.log(questions);
    }, [questions]);

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
                            validationSchema={validationSchema}
                        >
                            {({ isSubmitting, values, setFieldValue }) => (
                                <Form>
                                    <Row className="mb-3">
                                        <Col>
                                            <label htmlFor="question">Question:</label>
                                            <Field type="text" name="question" className="form-control" />
                                            <div className="text-danger">
                                                <ErrorMessage name="question" />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col xs={12} lg={6}>
                                            <label htmlFor="answer1">Answer1:</label>
                                            <Field type="text" name="answer1" className="form-control" />
                                            <div className="text-danger">
                                                <ErrorMessage name="answer1" />
                                            </div>
                                            <Field
                                                type="radio"
                                                name="correctAnswer"
                                                value="answer1"
                                                onChange={() => setFieldValue("correctAnswer", "answer1")}
                                                checked={values.correctAnswer === "answer1"}
                                            />
                                            <label htmlFor="correctAnswer">Correct Answer</label>
                                        </Col>
                                        <Col xs={12} lg={6}>
                                            <label htmlFor="answer2">Answer2:</label>
                                            <Field type="text" name="answer2" className="form-control" />
                                            <div className="text-danger">
                                                <ErrorMessage name="answer2" />
                                            </div>
                                            <Field
                                                type="radio"
                                                name="correctAnswer"
                                                value="answer2"
                                                onChange={() => setFieldValue("correctAnswer", "answer2")}
                                                checked={values.correctAnswer === "answer2"}
                                            />
                                            <label htmlFor="correctAnswer">Correct Answer</label>
                                        </Col>
                                        <Col xs={12} lg={6}>
                                            <label htmlFor="answer3">Answer3:</label>
                                            <Field type="text" name="answer3" className="form-control" />
                                            <Field
                                                type="radio"
                                                name="correctAnswer"
                                                value="answer3"
                                                onChange={() => setFieldValue("correctAnswer", "answer3")}
                                                checked={values.correctAnswer === "answer3"}
                                                disabled={!values.answer3}
                                            />
                                            <label htmlFor="correctAnswer">Correct Answer</label>
                                        </Col>
                                        <Col xs={12} lg={6}>
                                            <label htmlFor="answer4">Answer4:</label>
                                            <Field type="text" name="answer4" className="form-control" />
                                            <Field
                                                type="radio"
                                                name="correctAnswer"
                                                value="answer4"
                                                onChange={() => setFieldValue("correctAnswer", "answer4")}
                                                checked={values.correctAnswer === "answer4"}
                                                disabled={!values.answer4}
                                            />
                                            <label htmlFor="correctAnswer">Correct Answer</label>
                                        </Col>
                                    </Row>
                                    <Button type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default Quiz;
