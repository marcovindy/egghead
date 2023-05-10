import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Container, Row, Col, Button } from "react-bootstrap";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../helpers/AuthContext";
import CheckboxGroup from "../CheckboxGroup/CheckboxGroup";
import Select from "react-select";

import t from "../../i18nProvider/translate";

const IS_PROD = process.env.NODE_ENV === "production";
const API_URL = IS_PROD
  ? "https://testing-egg.herokuapp.com"
  : "http://localhost:5000";

function CreateQuiz() {
  const { authState } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  let history = useHistory();

  const [languageOptions, setLanguageOptions] = useState([
    { value: "English", label: "English" },
    { value: "Czech", label: "Czech" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Spanish", label: "Spanish" },
    { value: "Russian", label: "Russian" },
    { value: "Ukrainian", label: "Ukrainian" },
  ]);

  const initialValues = {
    title: "",
    description: "",
    categories: [],
    language: languageOptions[0],
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
    axios
      .get(`${API_URL}/categories/all`)
      .then((response) => {
        setCategories(response.data.categories);
        console.log(
          "categories response.data: ",
          response.data.listOfCategories
        );
      })
      .catch((error) => {
        setError("Error fetching categories");
        console.log("Categories error: ", error);
      });
  }, []);


  const yupTranslate = (data) => {
    return t(data);
  }


  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .max(30, yupTranslate("title-validation-max-length"))
      .required(yupTranslate("title-validation-required")),
    description: Yup.string().max(
      200,
      yupTranslate("description-validation-max-length")
    ),
    categories: Yup.array().min(1, yupTranslate("categories-validation-min")),
  });

  const onSubmit = (data) => {
    const categoryIds = categories
      .filter((category) => data.categories.includes(category.name))
      .map((category) => category.id);
    axios
      .post(
        `${API_URL}/quizzes/create`,
        {
          title: data.title,
          language: data.language.value,
          description: data.description,
          categoryIds,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        toast.success(t("createquiz-success"));
        history.push(`/quiz/${response.data.quizId}`);
      })
      .catch((error) => {
        console.error(error);
        toast.error(t("createquiz-error"));
      });
  };

  return (
    <div className="createQuizPage">
      <Container>
        <Row>
          <h1>Create Quiz</h1>

          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form className="formContainer">
              <label>Title: </label>
              <ErrorMessage
                className="ml-1   text-color-red"
                name="title"
                component="span"
              />
              <Field
                autoComplete="off"
                id="inputCreateQuizTitle"
                name="title"
                placeholder="(Ex. Quiz Title...)"
              />
              <div className="d-flex flex-column">
                <label>Language: </label>
                <ErrorMessage
                  className="ml-1 text-color-red"
                  name="language"
                  component="span"
                />
                <Field name="language">
                  {({ form }) => (
                    <Select
                      value={form.values.language}
                      onChange={(option) =>
                        form.setFieldValue("language", option)
                      }
                      options={languageOptions}
                    />
                  )}
                </Field>
              </div>
              <div className="categories-group p-5">
                <label>{t("Categories")}: </label>
                <ErrorMessage
                  className="ml-1   text-color-red"
                  name="categories"
                  component="span"
                />
                <div className="d-flex flex-wrap">
                  {categories && categories.length > 0 && (
                    <CheckboxGroup
                      name="categories"
                      options={categories.map((category) => category.name)}
                    />
                  )}
                </div>
              </div>
              <div className="d-flex flex-column">
                {error && <span className="error">{error}</span>}
                <label>{t("Description")}: </label>
                <ErrorMessage
                  className="ml-1   text-color-red"
                  name="description"
                  component="span"
                />
                <Field
                  autoComplete="off"
                  id="inputCreateQuizDescription"
                  name="description"
                  placeholder="(Ex. Quiz Description...)"
                  as="textarea"
                  rows="5"
                />
                <div className="d-flex justify-content-center">
                  <Button type="submit">{t("Create Quiz")}</Button>
                </div>
              </div>
            </Form>
          </Formik>
        </Row>
      </Container>
    </div>
  );
}

export default CreateQuiz;
