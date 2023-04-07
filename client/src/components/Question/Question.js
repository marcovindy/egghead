import React, { useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AnimatedRadioCircle from "../AnimatedRadioCircle/AnimatedRadioCircle";
import './Question.css';
import EditableTitle from "../EditableTitle/EditableTitle";
import t from "../../i18nProvider/translate";

function Question({ question, index, onQuestionDelete, onAnswerEdit }) {

    const validationSchema = Yup.object().shape({
        text: Yup.string().required("Answer text is required"),
    });

    const handleAnswerEdit = (answerIndex, newTitle) => {
        if (typeof answerIndex === "number" && typeof newTitle === "string") {
            onAnswerEdit(index, { index: answerIndex, text: newTitle });
            console.log(newTitle, answerIndex);
        } else {
            console.log(newTitle, answerIndex);
        }
    };
    
      

    return (
        <>
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
                       
                            <EditableTitle title={answer.text} onTitleSave={(newTitle) => handleAnswerEdit(index, newTitle)} />

                        </div>
                    </Col>
                )
            ))}
        </Row>
        <Button variant="danger" onClick={() => onQuestionDelete(index)}>{t("deleteButton")}</Button>
  
        </>
        // <div className="mb-4">
        //     <Row>
        //         <Col xs={10}>
        //             <h3>{index}. Question: </h3>
        //             <h4>{question.question}</h4>
        //         </Col>
        //         <Col xs={2}>
        //             {console.log(">", question)}
        //             <Button variant="danger" onClick={() => onQuestionDelete(index)}>
        //                 Delete
        //             </Button>
        //         </Col>
        //     </Row>
        //     <Row>
        //         {question.answers.map((answer, answerIndex) => (
        //             <Col xs={12} lg={6} key={answerIndex} className="my-3">
        //                 <Formik
        //                     initialValues={{
        //                         text: answer.text,
        //                     }}
        //                     onSubmit={(values) => handleAnswerEdit(answerIndex, values)}
        //                     validationSchema={validationSchema}
        //                 >
        //                     {({ isSubmitting, values }) => (
        //                         <Form>
        //                             <div className="align-items-center text-light">
        //                                     <Field
        //                                         type="text"
        //                                         name="text"
        //                                         className="form-control"
        //                                         placeholder={`Answer ${answerIndex + 1}`}
        //                                     />
        //                                     <div className="text-danger">
        //                                         <ErrorMessage name="text" />
        //                                     </div>
        //                                     <label>
        //                                         <Field
        //                                             type="radio"
        //                                             name={`correctAnswer`}
        //                                             value={answerIndex}
        //                                             checked={question.correctAnswerIndex === answerIndex}
        //                                         />
        //                                         <AnimatedRadioCircle />
        //                                     </label>
        //                                     <Button type="submit" variant="primary">
        //                                         Save
        //                                     </Button>

        //                             </div>

        //                         </Form>
        //                     )}
        //                 </Formik>
        //             </Col>
        //         ))}
        //     </Row>
        // </div>

    );
}

export default Question;
