import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Trash } from "react-bootstrap-icons";
import * as Yup from "yup";
import "./Question.css";
import AnimatedRadioCircle from "../AnimatedRadioCircle/AnimatedRadioCircle";
import EditableTitle from "../EditableTitle/EditableTitle";
import t from "../../i18nProvider/translate";
import Select from "react-select";

function Question({
  index,
  question,
  categories,
  onQuestionDelete,
  onAnswerEdit,
  onQuestionEdit,
  onCategoryChange,
}) {
  const [selectedCategory, setSelectedCategory] = useState(question.category);

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption.value);
    console.log(selectedOption.value);
    onCategoryChange(index, selectedOption.value);
  };

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

  const categoryOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  useEffect(() => {
    setSelectedCategory({ value: question.category, label: question.category });
  }, [question.category]);

  return (
    <>
      {console.log(selectedCategory)}
      <Row>
        <Col>
          <h4>Q{index + 1}:</h4>
        </Col>
        <Col className="mb-4">
          <Col className="mb-4">
            <div>
              <strong>Category:</strong>{" "}
              <Select
                value={selectedCategory}
                options={categoryOptions}
                onChange={handleCategoryChange}
              />{" "}
              | <strong>Limit:</strong> {question.limit}
            </div>
          </Col>
        </Col>
        <Col>
          <button
            className="btn btn-sm btn-danger m-1"
            onClick={handleDeleteClick}
          >
            <Trash />
          </button>
        </Col>
      </Row>
      <Row className="mb-3">
        <h4>
          <EditableTitle
            title={question.question}
            onTitleSave={handleQuestionEdit}
          />
        </h4>
      </Row>
      <Row>
        {question.answers.map(
          (answer, index) =>
            answer.text !== "" && (
              <Col key={index} lg={6} className="mb-3">
                <div
                  className="p-3 text-light w-100"
                  style={{
                    backgroundColor: answer.isCorrect ? "green" : "#007bff",
                  }}
                >
                  <EditableTitle
                    title={answer.text}
                    onTitleSave={(newTitle) =>
                      handleAnswerEdit(index, newTitle)
                    }
                  />
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
