import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditableTitle from "../../components/EditableTitle/EditableTitle";
import AnimatedRadioCircle from "../../components/AnimatedRadioCircle/AnimatedRadioCircle";
import "./Quiz.css";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import t from "../../i18nProvider/translate";

function Quiz() {
    const API_URL =
        process.env.NODE_ENV === "development"
            ? "http://localhost:5000"
            : "https://testing-egg.herokuapp.com";

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
            toast.success("Question has been created successfully.");
        } else {
            // No radio button has been selected
            toast.error("Please select a correct answer");
        }
    };


    useEffect(() => {
        console.log(questions);
    }, [questions]);

    const handleQuestionDelete = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
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
                    <h4>{t("category")}</h4>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <Button onClick={handleButtonClick}>{t("addQuestion")}</Button>
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
                                <Form className="custom-form">
                                    <Row className="mb-3">
                                        <Col>
                                            <label htmlFor="question">{t("questionLabel")}</label>
                                            <Field type="text" name="question" className="form-control" />
                                            <div className="text-danger">
                                                <ErrorMessage name="question" />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col xs={12} lg={6}>
                                            <div>
                                                <label htmlFor="answer1">{t("answer1Label")}</label>
                                                <Field type="text" name="answer1" className="form-control" />
                                                <div className="text-danger">
                                                    <ErrorMessage name="answer1" />
                                                </div>
                                            </div>
                                            <label>
                                                <span>{t("correctAnswerLabel")}</span>
                                                <Field
                                                    type="radio"
                                                    name="correctAnswer"
                                                    value="answer1"
                                                    onChange={() => setFieldValue("correctAnswer", "answer1")}
                                                    checked={values.correctAnswer === "answer1"}
                                                />
                                                <AnimatedRadioCircle />
                                            </label>
                                        </Col>
                                        <Col xs={12} lg={6}>
                                            <div>
                                                <label htmlFor="answer2">{t("answer2Label")}</label>
                                                <Field type="text" name="answer2" className="form-control" />
                                                <div className="text-danger">
                                                    <ErrorMessage name="answer2" />
                                                </div>
                                            </div>
                                            <label>
                                                <span>{t("correctAnswerLabel")}</span>
                                                <Field
                                                    type="radio"
                                                    name="correctAnswer"
                                                    value="answer2"
                                                    onChange={() => setFieldValue("correctAnswer", "answer2")}
                                                    checked={values.correctAnswer === "answer2"}
                                                />
                                                <AnimatedRadioCircle />
                                            </label>
                                        </Col>
                                        <Col xs={12} lg={6}>
                                            <div>
                                                <label htmlFor="answer3">{t("answer3Label")}</label>
                                                <Field
                                                    type="text"
                                                    name="answer3"
                                                    className="form-control"
                                                    disabled={!values.answer1 || !values.answer2}
                                                />
                                            </div>
                                            <label className={values.answer3 ? "radio" : "radio disabled"}>
                                                <span>{t("correctAnswerLabel")}</span>
                                                <Field
                                                    type="radio"
                                                    name="correctAnswer"
                                                    value="answer3"
                                                    onChange={() => setFieldValue("correctAnswer", "answer3")}

                                                    checked={values.correctAnswer === "answer3"}
                                                    disabled={!values.answer3}
                                                />
                                                <AnimatedRadioCircle />
                                            </label>
                                        </Col>
                                        <Col xs={12} lg={6}>
                                            <div>
                                                <label htmlFor="answer4">{t("answer4Label")}</label>
                                                <Field type="text" name="answer4" className="form-control"
                                                    disabled={!values.answer1 || !values.answer2}
                                                />
                                            </div>
                                            <label className={values.answer4 ? "radio" : "radio disabled"}>
                                                <span>{t("correctAnswerLabel")}</span>
                                                <Field
                                                    type="radio"
                                                    name="correctAnswer"
                                                    value="answer4"
                                                    onChange={() => setFieldValue("correctAnswer", "answer4")}
                                                    checked={values.correctAnswer === "answer4"}
                                                    disabled={!values.answer4}
                                                />
                                                <AnimatedRadioCircle />
                                            </label>
                                        </Col>
                                    </Row>
                                    <Button type="submit"
                                        disabled={!values.correctAnswer || !values.answer1 || !values.answer2 || !values.question}
                                    >
                                        {t("submitButton")}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Col>
                </Row>
            )}
            <hr />
            {questions.map((question, index) => (
                <div key={index}>
                    <Row>
                        <Col>
                            <h4>Question {index + 1}: {question.question}</h4>
                        </Col>
                    </Row>
                    <Row>
                        {question.answers.map((answer, index) => (
                            answer.text !== "" && (
                                <Col key={index} lg={6} className="mb-3">
                                    <div className="p-3 text-light w-100" style={{ backgroundColor: answer.isCorrect ? "green" : "#007bff" }}>
                                        {answer.text}
                                    </div>
                                </Col>
                            )
                        ))}
                    </Row>
                    <Button variant="danger" onClick={() => handleQuestionDelete(index)}>{t("deleteButton")}</Button>
                    {index !== questions.length - 1 && <hr />}
                </div>
            ))}



            <Button
                style={{ position: "fixed", bottom: 20, right: 20 }}
                onClick={() => {
                    toast.warning('This feature is still in development and not yet ready for use. Please check back later.')
                }}
            >
                {t("saveButton")}
            </Button>
        </Container>

    );
}

export default Quiz;
