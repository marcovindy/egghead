import React from "react";
import { Col, Row, Button } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AnimatedRadioCircle from "../AnimatedRadioCircle/AnimatedRadioCircle";
import './Question.css';

function Question({ question, index, onQuestionDelete, onAnswerEdit }) {
    const validationSchema = Yup.object().shape({
        text: Yup.string().required("Answer text is required"),
    });

    const handleAnswerEdit = (answerIndex, values) => {
        onAnswerEdit(index, { index: answerIndex, text: values.text });
    };



    return (
        <div className="mb-4">
            <Row>
                <Col xs={10}>
                    <h3>{index}. Question: </h3>
                    <h4>{question.question}</h4>
                </Col>
                <Col xs={2}>
                    {console.log(">", question)}
                    <Button variant="danger" onClick={() => onQuestionDelete(index)}>
                        Delete
                    </Button>
                </Col>
            </Row>
            <Row>
                {question.answers.map((answer, answerIndex) => (
                    <Col xs={12} lg={6} key={answerIndex} className="my-3">
                        <Formik
                            initialValues={{
                                text: answer.text,
                            }}
                            onSubmit={(values) => handleAnswerEdit(answerIndex, values)}
                            validationSchema={validationSchema}
                        >
                            {({ isSubmitting, values }) => (
                                <Form>
                                    <div className="align-items-center text-light">
                                            <Field
                                                type="text"
                                                name="text"
                                                className="form-control"
                                                placeholder={`Answer ${answerIndex + 1}`}
                                            />
                                            <div className="text-danger">
                                                <ErrorMessage name="text" />
                                            </div>
                                            <label>
                                                <Field
                                                    type="radio"
                                                    name={`correctAnswer`}
                                                    value={answerIndex}
                                                    checked={question.correctAnswerIndex === answerIndex}
                                                />
                                                <AnimatedRadioCircle />
                                            </label>
                                            <Button type="submit" variant="primary">
                                                Save
                                            </Button>

                                    </div>

                                </Form>
                            )}
                        </Formik>
                    </Col>
                ))}
            </Row>
        </div>

    );
}

export default Question;
