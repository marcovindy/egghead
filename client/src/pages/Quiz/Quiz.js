import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditableTitle from "../../components/EditableTitle/EditableTitle";
import AnimatedRadioCircle from "../../components/AnimatedRadioCircle/AnimatedRadioCircle";
import Question from "../../components/Question/Question";
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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        axios
            .get(`${API_URL}/quizzes/byquizId/${id}`)
            .then((response) => setQuizInfo(response.data))
            .catch((error) => console.log(error));
    }, [id, API_URL]);
 
    
    useEffect(() => {
        setIsLoading(true);
        axios
            .get(`${API_URL}/questions/byquizId/${id}`)
            .then((response) => {
                const formattedQuestions = response.data.questions.map(question => {
                    const formattedAnswers = question.Answers.map(answer => ({
                        text: answer.answer,
                        isCorrect: answer.isCorrect,
                    }));
                    return {
                        question: question.question,
                        answers: formattedAnswers,
                    };
                });
                setQuestions(formattedQuestions);
                console.log(formattedQuestions);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
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
        showForm === false ? setShowForm(true) : setShowForm(false);
    };

    const handleFormSubmit = (values, actions) => {
        if (values.correctAnswer) {
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
            toast.error("Please select a correct answer");
        }
    };


    useEffect(() => {
        console.log("quizInfo: ", quizInfo);
        console.log("questions: ", questions);
    }, [questions]);

    const handleQuestionDelete = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleAnswerEdit = (index, newAnswer) => {
        if (!newAnswer) {
            return;
        }
        console.log(newAnswer);
        console.log(index);
        const newQuestions = [...questions];
        newQuestions[index].answers = newQuestions[index].answers.map((answer, i) => {
            console.log("newAnswer.index", newAnswer.index);
            if (i === newAnswer.index) {
                return { text: newAnswer.text, isCorrect: answer.isCorrect };
            } else {
                return answer;
            }
        });
        console.log(newQuestions);
        setQuestions(newQuestions);
    };

    const handleQuizSave = () => {
        axios
            .post(`${API_URL}/questions/save`, {
                quizId: quizInfo.id,
                questions: questions.map((q) => ({
                    question: q.question,
                    answers: q.answers.map((a) => ({
                        answer: a.text,
                        isCorrect: a.isCorrect,
                    })),
                })),
            })
            .then((response) => {
                console.log(response.data);
                toast.success("Quiz questions have been saved successfully.");
            })
            .catch((error) => console.log(error));
    };




    return (
        <Container className="quiz-container mb-4">

            <Row>
                <Col>
                    <h2>{t('Quiz Title')}: </h2><EditableTitle title={quizInfo.title} onTitleSave={handleTitleSave} />
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
                <div className="d-flex">
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
                </div>
            )}
            <hr />


            {questions.map((question, index) => (
                <div key={index}>
                    <Row>
                        <Question
                            key={index}
                            index={index}
                            question={question}
                            onQuestionDelete={handleQuestionDelete}
                            onAnswerEdit={handleAnswerEdit}
                        />
                    </Row>
                    <hr />
                </div>
            ))}


            <Button
                style={{ position: "fixed", bottom: 20, right: 20 }}
                onClick={() => {
                    handleQuizSave();
                }}
            >
                {t("saveButton")}
            </Button>
            {/* {isLoading ? (
                    <span className="visually-hidden">Loading...</span>
            ) : (
                questions.map((question, index) => (
                    <Question
                        key={index}
                        question={question.question}
                        answers={question.answers}
                        onQuestionDelete={() => handleQuestionDelete(index)}
                        onAnswerEdit={(newAnswer) => handleAnswerEdit(index, newAnswer)}
                    />
                ))
            )} */}
        </Container>

    );
}

export default Quiz;
