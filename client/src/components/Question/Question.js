import React, { useEffect, useState, useContext } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Trash } from "react-bootstrap-icons";
import * as Yup from "yup";
import "./Question.css";
import AnimatedRadioCircle from "../AnimatedRadioCircle/AnimatedRadioCircle";
import EditableTitle from "../EditableTitle/EditableTitle";
import t from "../../i18nProvider/translate";
import Select from "react-select";
import { AuthContext } from "../../helpers/AuthContext";

function Question({
  index,
  question,
  categories,
  quizInfo,
  onQuestionDelete,
  onAnswerEdit,
  onQuestionEdit,
  onCategoryChange,
  onTimeLimitChange,
  onAnswerDelete,
  type,
}) {
  const [selectedCategory, setSelectedCategory] = useState(question.category);

  const { authState } = useContext(AuthContext);

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    if (
      categoryOptions.some((option) => option.value === selectedOption.value)
    ) {
      onCategoryChange(index, selectedOption.value);
    } else {
      console.log("Invalid category selected");
    }
  };

  const handleAnswerEdit = (answerIndex, newTitle) => {
    if (typeof answerIndex === "number" && typeof newTitle === "string") {
      onAnswerEdit(index, { index: answerIndex, text: newTitle });
    }
  };

  const handleQuestionEdit = (newTitle) => {
    onQuestionEdit(index, newTitle);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    onQuestionDelete(index);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleTimeLimitChange = (event) => {
    const newLimit = event.target.value;
    if (newLimit >= 10 && newLimit <= 60) {
      onTimeLimitChange(index, newLimit);
    } else {
      console.log("Invalid limit value");
    }
  };

  const categoryOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  useEffect(() => {
    setSelectedCategory({ value: question.category, label: question.category });
  }, [question.category]);

  return (
    <>
      <Row>
        <Col md={2}>
          <h4>Q{index + 1}:</h4>
        </Col>

        <Col md={4} className="mb-4">
          <div>
            {t("Category")}:
            {authState && authState.id === quizInfo.userId ? (
              <Select
                value={selectedCategory}
                options={categoryOptions}
                onChange={handleCategoryChange}
              />
            ) : (
              <h3>{selectedCategory.value}</h3>
            )}
          </div>
        </Col>
        <Col md={4} className="mb-4">
          <div>
            Limit:
            {authState && authState.id === quizInfo.userId ? (
              <input
                type="number"
                min="10"
                max="60"
                value={question.limit}
                onChange={handleTimeLimitChange}
              />
            ) : (
              <h3>{question.limit}</h3>
            )}
          </div>
        </Col>

        <Col md={2}>
          {authState && authState.id === quizInfo.userId ? (
            <button
              className="btn m-1"
              onClick={handleDeleteClick}
            >
              <Trash color="black"/>
            </button>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Row className="mb-3">
        <h4>
          {authState && authState.id === quizInfo.userId ? (
            <EditableTitle
              title={question.question}
              onTitleSave={handleQuestionEdit}
              type={type}
            />
          ) : (
            question.question
          )}
        </h4>
      </Row>
      <Row>
        {question.answers.map(
          (answer, answerIndex) =>
            answer.text !== "" && (
              <Col key={answerIndex} xs={12} lg={6} className="mb-3">
                <div
                  className="p-3 text-light w-100"
                  style={{
                    backgroundColor: answer.isCorrect ? "green" : "#007bff",
                  }}
                >
                  {authState && authState.id === quizInfo.userId ? (
                    <div className="d-flex">
                      <Col xs={10} sm={11} >
                      <EditableTitle
                        title={answer.text}
                        onTitleSave={(newTitle) =>
                          handleAnswerEdit(answerIndex, newTitle)
                        }
                      
                      />
                      </Col>
                    <Col>
                    <button
                        className="btn btn-sm m-1"
                        onClick={() => onAnswerDelete(index, answerIndex)}
                      >
                        <Trash />
                      </button>
                      </Col>
                      </div>
                  ) : (
                    <span>{answer.text}</span>
                  )}
                </div>
              </Col>
            )
        )}
      </Row>
      <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Delete Question")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to delete this question?")}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            {t("closeButton")}
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            {t("deleteButton")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Question;
