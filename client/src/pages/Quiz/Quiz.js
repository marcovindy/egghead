import React, { useEffect, useState, useContext, useMemo } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Select from "react-select";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import EditableTitle from "../../components/EditableTitle/EditableTitle";
import EditableDescription from "../../components/EditableDescription/EditableDescription";
import Question from "../../components/Question/Question";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import "./Quiz.css";
import * as Yup from "yup";
import { toast } from "react-toastify";
import t from "../../i18nProvider/translate";
import { Trash } from "react-bootstrap-icons";
import { AuthContext } from "../../helpers/AuthContext";
import { updateQuizDescription } from "../../services/api";
import AnswerField from "../../components/QuizComponents/AnswerField/AnswerField";
import LanguageSelector from "../../components/QuizComponents/LanguageSelector/LanguageSelector";

function Quiz() {
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://testing-egg.herokuapp.com"
      : "http://localhost:5000";

  const { id } = useParams();
  const [quizInfo, setQuizInfo] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();
  const [numAnswerFields, setNumAnswerFields] = useState(2);
  const [categories, setCategories] = useState([]);
  const { authState } = useContext(AuthContext);
  const [validationSchema, setValidationSchema] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTimeLimit, setSelectedTimeLimit] = useState();
  const [userRole, setUserRole] = useState();
  const [isVerified, setIsVerified] = useState(false);
  const [description, setDescription] = useState("");
  const [showLanguageSelector, setShowLanguageSelector] = useState(
    quizInfo.language || ""
  );
  const [languageOptions, setLanguageOptions] = useState([
    { value: "English", label: "English" },
    { value: "Czech", label: "Czech" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Spanish", label: "Spanish" },
    { value: "Russian", label: "Russian" },
    { value: "Ukrainian", label: "Ukrainian" },
  ]);

  const handleDescriptionSave = async (newDescription) => {
    try {
      await updateQuizDescription(quizInfo.id, newDescription);
      setDescription(newDescription);
    } catch (error) {
      console.error("Error updating quiz description:", error);
    }
  };

  useEffect(() => {
    if (quizInfo) {
      setDescription(quizInfo.description);
      setIsVerified(quizInfo.verificated === 1);
    }
  }, [quizInfo]);

  useEffect(() => {
    if (categories.length > 0) {
      setValidationSchema(
        Yup.object().shape({
          question: Yup.string()
            .max(200, "Characters limit is 200")
            .required("Question is required"),
          category: Yup.string()
            .oneOf(
              categories.map((category) => category.name),
              "Category must be one of the available options"
            )
            .required("Category is required"),
          limit: Yup.number()
            .required("Time limit is required")
            .min(10, "Time limit must be at least 10 seconds")
            .max(60, "Time limit must be no more than 60 seconds"),
          answer1: Yup.string()
            .max(100, "Characters limit is 100")
            .required("Answer1 is required"),
          answer2: Yup.string()
            .max(100, "Characters limit is 100")
            .required("Answer2 is required"),
        })
      );
    }
  }, [categories]);

  const handleQuizDelete = () => {
    axios
      .delete(`${API_URL}/quizzes/delete/byquizId/${id}`)
      .then((response) => {
        toast.success("Quiz has been deleted successfully.");
        history.push("/customgame");
      })
      .catch((error) => console.log(error));
  };

  const fetchUserRole = async (username) => {
    try {
      const response = await axios.get(
        `${API_URL}/auth/user/byusername/${username}`
      );
      return response.data.role;
    } catch (error) {}
    return null;
  };

  useEffect(() => {
    const getUserRole = async () => {
      if (authState) {
        console.log(authState.username);
        const role = await fetchUserRole(authState.username);
        setUserRole(role);
        console.log(role);
      }
    };
    getUserRole();
  }, [authState]);

  const handleAnswerDelete = (questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.splice(answerIndex, 1);
    setQuestions(newQuestions);
    setIsSaved(false);
  };

  const handleBeforeUnload = (event) => {
    if (!isSaved) {
      event.preventDefault();
      event.returnValue = "";
    }
  };

  const categoryOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  useEffect(() => {
    axios
      .get(`${API_URL}/categories/all`)
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      if (!isSaved) {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      }
    };
  }, [isSaved]);

  useEffect(() => {
    axios
      .get(`${API_URL}/quizzes/byquizId/${id}`)
      .then((response) => setQuizInfo(response.data))
      .catch((error) => console.log(error));
  }, [id, API_URL]);

  useEffect(() => {
    setIsSaved(true);
    axios
      .get(`${API_URL}/questions/byquizId/${id}`)
      .then((response) => {
        const formattedQuestions = response.data.questions.map((question) => {
          const formattedAnswers = question.Answers.map((answer) => ({
            text: answer.answer,
            isCorrect: answer.isCorrect,
          }));
          return {
            question: question.question,
            category: question.category,
            limit: question.limit,
            answers: formattedAnswers,
          };
        });
        setQuestions(formattedQuestions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [id, API_URL]);

  const handleTitleSave = (newTitle) => {
    axios
      .put(
        `${API_URL}/quizzes/title/byquizId/${id}`,
        { title: newTitle },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => setQuizInfo({ ...quizInfo, title: newTitle }))
      .catch((error) => console.log(error));
  };

  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    showForm === false ? setShowForm(true) : setShowForm(false);
  };

  const handleFormSubmit = (values, actions) => {
    const correctAnswers = [];
    for (let i = 1; i <= numAnswerFields; i++) {
      if (values[`isCorrect_answer${i}`]) {
        correctAnswers.push(`answer${i}`);
      }
    }

    if (correctAnswers.length > 0) {
      setQuestions([
        ...questions,
        {
          question: values.question,
          category: values.category,
          limit: values.limit,
          answers: [
            {
              text: values.answer1,
              isCorrect: values["isCorrect_answer1"] || false,
            },
            {
              text: values.answer2,
              isCorrect: values["isCorrect_answer2"] || false,
            },
            {
              text: values.answer3,
              isCorrect: values["isCorrect_answer3"] || false,
            },
            {
              text: values.answer4,
              isCorrect: values["isCorrect_answer4"] || false,
            },
            {
              text: values.answer5,
              isCorrect: values["isCorrect_answer5"] || false,
            },
            {
              text: values.answer6,
              isCorrect: values["isCorrect_answer6"] || false,
            },
            {
              text: values.answer7,
              isCorrect: values["isCorrect_answer7"] || false,
            },
            {
              text: values.answer8,
              isCorrect: values["isCorrect_answer8"] || false,
            },
          ].filter((answer) => answer.text),
        },
      ]);
      setSelectedCategory(values.category);
      setSelectedTimeLimit(values.limit);
      actions.resetForm({
        values: {
          ...actions.initialValues,
          question: "",
          answer1: "",
          answer2: "",
          answer3: "",
          answer4: "",
          answer5: "",
          answer6: "",
          answer7: "",
          answer8: "",
          isCorrect_answer1: false,
          isCorrect_answer2: false,
          isCorrect_answer3: false,
          isCorrect_answer4: false,
          isCorrect_answer5: false,
          isCorrect_answer6: false,
          isCorrect_answer7: false,
          isCorrect_answer8: false,
        },
      });
      toast.success("Question has been created successfully.");
      setIsSaved(false);
    } else {
      toast.error("Correct answer is required.");
    }
  };

  const DynamicAnswerFields = ({ values, setNumAnswerFields }) => {
    useEffect(() => {
      if (values.answer1 && values.answer2) {
        setNumAnswerFields(4);
      } else {
        setNumAnswerFields(2);
      }
      if (values.answer3 && values.answer4) {
        setNumAnswerFields(6);
      } else if (values.answer1 && values.answer2) {
        setNumAnswerFields(4);
      }
      if (values.answer5 && values.answer6) {
        setNumAnswerFields(8);
      } else if (values.answer3 && values.answer4) {
        setNumAnswerFields(6);
      }
    }, [values, setNumAnswerFields]);

    return null;
  };

  const handleQuestionDelete = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleAnswerEdit = (index, newAnswer) => {
    if (!newAnswer || (authState.id !== quizInfo.userId && userRole !== 1)) {
      return;
    }
    const newQuestions = [...questions];
    newQuestions[index].answers = newQuestions[index].answers.map(
      (answer, i) => {
        if (i === newAnswer.index) {
          return { text: newAnswer.text, isCorrect: answer.isCorrect };
        } else {
          return answer;
        }
      }
    );
    setQuestions(newQuestions);
    setIsSaved(false);
  };

  const handleQuestionEdit = (index, newQuestion) => {
    if (!newQuestion) {
      return;
    }
    const newQuestions = [...questions];
    newQuestions[index].question = newQuestion;
    setQuestions(newQuestions);
    setIsSaved(false);
  };

  const handleCategoryChange = (questionIndex, newCategory) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].category = newCategory;
    setQuestions(newQuestions);
    setIsSaved(false);
  };

  const handleTimeLimitChange = (questionIndex, newTimeLimit) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].limit = newTimeLimit;
    setQuestions(newQuestions);
    setIsSaved(false);
  };
  const handleQuizSave = () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    setIsLoading(true);
    const categories = questions.map((q) => q.category);
    const uniqueCategories = Array.from(new Set(categories));

    axios
      .delete(`${API_URL}/questions/byquizId/${id}`)
      .then((response) => {
        axios
          .post(`${API_URL}/questions/save`, {
            quizId: quizInfo.id,
            questions: questions.map((q) => ({
              question: q.question,
              category: q.category,
              limit: q.limit,
              answers: q.answers.map((a) => ({
                answer: a.text,
                isCorrect: a.isCorrect,
              })),
            })),
          })
          .then((response) => {
            toast.success("Quiz questions have been saved successfully.");
            axios
              .put(
                `${API_URL}/quizzes/categories/byquizId/${id}`,
                { categories: uniqueCategories },
                {
                  headers: {
                    accessToken: localStorage.getItem("accessToken"),
                  },
                }
              )
              .then((response) => {
                toast.success(response.data.message);
                setIsSaved(true);
                setIsLoading(false);
              })
              .catch((error) => console.log(error));
            setIsSaved(true);
            setIsLoading(false);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  const handleQuizVerification = () => {
    axios
      .put(
        `${API_URL}/quizzes/verify/byquizId/${id}`,
        { verificated: isVerified ? 0 : 1 },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setIsVerified(!isVerified);
        toast.success(
          `Quiz has been ${
            isVerified ? "unverified" : "verified"
          } successfully.`
        );
      })
      .catch((error) => console.log(error));
  };
  

  return (
    <Container className="quiz-container mb-4">
      <Row>
        <Col>
          <h2>
            {authState && authState.id === quizInfo.userId ? (
              <>
                {t("Quiz Title")}:
                <EditableTitle
                  title={quizInfo.title}
                  onTitleSave={handleTitleSave}
                />
              </>
            ) : (
              quizInfo.title
            )}
          </h2>
          <div>
            {authState && authState.id === quizInfo.userId ? (
              <>
                {t("Quiz Description")}:{" "}
                <EditableDescription
                  description={description}
                  onDescriptionSave={handleDescriptionSave}
                />
              </>
            ) : (
              description
            )}
          </div>
        </Col>
      </Row>
      <Row className="mb-4 justify-content-center">
        {authState && authState.id === quizInfo.userId ? (
          <>
            <h3 onClick={() => setShowLanguageSelector(true)}>
              {quizInfo.language}
            </h3>
            {showLanguageSelector && (
               <LanguageSelector
               quizInfo={quizInfo}
               setQuizInfo={setQuizInfo}
               languageOptions={languageOptions}
             />
            )}
          </>
        ) : (
          quizInfo.language
        )}
      </Row>
      <Row className="mb-4">
        <Col>
          {authState && authState.id === quizInfo.userId && (
            <Button onClick={handleButtonClick}>
              {" "}
              {showForm ? "Close Form" : t("addQuestion")}
            </Button>
          )}
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
                category: "",
                limit: 0,
                isCorrect_answer1: false,
                isCorrect_answer2: false,
                isCorrect_answer3: false,
                isCorrect_answer4: false,
                isCorrect_answer5: false,
                isCorrect_answer6: false,
                isCorrect_answer7: false,
                isCorrect_answer8: false,
              }}
              onSubmit={handleFormSubmit}
              validationSchema={validationSchema}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <>
                  <DynamicAnswerFields
                    values={values}
                    setNumAnswerFields={setNumAnswerFields}
                  />

                  <Form className="custom-form">
                    <Row className="mb-3">
                      <Col>
                        <label htmlFor="category">{t("categoryLabel")}</label>
                        <Select
                          name="category"
                          options={categoryOptions}
                          onChange={(selectedOption) =>
                            setFieldValue("category", selectedOption.value)
                          }
                          placeholder="-- Select a category --"
                        />
                        <ErrorMessage
                          className="ml-1   text-color-red"
                          component="div"
                          name="category"
                        />
                      </Col>
                      <Col>
                        <label htmlFor="limit">{t("timeLimitLabel")}</label>
                        <Field type="number" name="limit" min="10" />

                        <ErrorMessage
                          className="ml-1   text-color-red"
                          component="div"
                          name="limit"
                        />
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col>
                        <label htmlFor="question">{t("questionLabel")}</label>
                        <Field
                          type="text"
                          name="question"
                          placeholder="What's your question?"
                          as="textarea"
                          rows="3"
                          max="200"
                          autoComplete="off"
                        />
                        <div className="text-danger">
                          <ErrorMessage
                            className="ml-1   text-color-red"
                            name="question"
                          />
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      {Array.from(
                        { length: numAnswerFields },
                        (_, index) => `answer${index + 1}`
                      ).map((answer, index) => (
                        <Col xs={12} lg={6} key={index}>
                          <AnswerField
                            index={index}
                            answerIndex={index + 1}
                            name={answer}
                            label={t(`${answer}Label`)}
                            disabled={index > 1 && !values[`answer${index}`]}
                            values={values}
                            setFieldValue={setFieldValue}
                          />
                        </Col>
                      ))}
                    </Row>

                    <Button
                      type="submit"
                      disabled={
                        !values.answer1 || !values.answer2 || !values.question
                      }
                    >
                      {t("submitButton")}
                    </Button>
                  </Form>
                </>
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
              categories={categories}
              quizInfo={quizInfo}
              onQuestionDelete={handleQuestionDelete}
              onAnswerEdit={handleAnswerEdit}
              onQuestionEdit={handleQuestionEdit}
              onCategoryChange={handleCategoryChange}
              onTimeLimitChange={handleTimeLimitChange}
              onAnswerDelete={handleAnswerDelete}
              type="question"
            />
          </Row>
          <hr />
        </div>
      ))}
      {userRole === 1 && (
        <Button
          style={{ position: "fixed", bottom: 80, right: 20 }}
          onClick={() => {
            handleQuizVerification();
          }}
        >
          {isVerified ? t("unverificationButton") : t("verificationButton")}
        </Button>
      )}

      {authState && (authState.id === quizInfo.userId || userRole === 1) && (
        <Button
          variant="danger"
          style={{ position: "fixed", bottom: 20, left: 20 }}
          onClick={() => setShowModal(true)}
        >
          <Trash />
        </Button>
      )}

      {authState && (authState.id === quizInfo.userId || userRole === 1) && (
        <Button
          className={isSaved ? "disabled" : "pulse"}
          style={{ position: "fixed", bottom: 20, right: 20 }}
          onClick={() => {
            handleQuizSave();
          }}
        >
          {t("saveButton")}
        </Button>
      )}

      <LoadingOverlay isLoading={isLoading} />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Delete Quiz")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("Do you really want to delete this quiz?")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t("closeButton")}
          </Button>
          <Button variant="danger" onClick={handleQuizDelete}>
            {t("deleteButton")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Quiz;
