import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Container, Row, Col, Button } from "react-bootstrap";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import { AuthContext } from "../../helpers/AuthContext";
import CheckboxGroup from "../CheckboxGroup/CheckboxGroup";

import t from "../../i18nProvider/translate";

const IS_PROD = process.env.NODE_ENV === "production";
const API_URL = IS_PROD ? "https://testing-egg.herokuapp.com" : "http://localhost:5000";

function CreateQuiz() {

    const { authState } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

    let history = useHistory();
    const initialValues = {
        title: "",
        language: "",
        description: "",
        categories: [],
    };
    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            history.push("/login");
        }
        axios
            .get(`${API_URL}/categories`)
            .then((response) => {
                setCategories(response.data.listOfCategories);
                console.log("categories response.data: ", response.data.listOfCategories);
            })
            .catch((error) => {
                setError("Error fetching categories");
                console.log("Categories error: ", error);
            });
    }, []);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("You must input a title!"),
        categories: Yup.array().min(1, "You must select at least one category!"),
    });


    const onSubmit = (data) => {
        const categoryIds = categories
            .filter((category) => data.categories.includes(category.name))
            .map((category) => category.id);
        axios
            .post(`${API_URL}/quizzes/create`, {
                title: data.title,
                language: data.language,
                description: data.description,
                categoryIds
            }, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                toast.success(t("createquiz-success"));
                history.push(`/customgame`);
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
                            <ErrorMessage className="ml-1   text-color-red" name="title" component="span" />
                            <Field
                                autoComplete="off"
                                id="inputCreateQuizTitle"
                                name="title"
                                placeholder="(Ex. Quiz Title...)"
                            />
                            <div className="d-flex flex-column">
                                <label>Language: </label>
                                <ErrorMessage className="ml-1 text-color-red" name="language" component="span" />
                                <Field as="select" name="language">
                                    <option value="English" label="English" />
                                    <option value="Czech" label="Czech" />
                                    <option value="French" label="French" />
                                </Field>
                            </div>
                            <div className="categories-group p-5">
                                <label>Categories: </label>
                                <ErrorMessage className="ml-1   text-color-red" name="categories" component="span" />
                                <div className="d-flex flex-wrap">
                                    <CheckboxGroup
                                        name="categories"
                                        options={categories.map((category) => category.name)}
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-column">


                                {error && <span className="error">{error}</span>}
                                <label>Description: </label>
                                <ErrorMessage className="ml-1   text-color-red" name="description" component="span" />
                                <Field
                                    autoComplete="off"
                                    id="inputCreateQuizDescription"
                                    name="description"
                                    placeholder="(Ex. Quiz Description...)"
                                    as="textarea"
                                    rows="5"
                                />
                                <div className="d-flex justify-content-center">
                                    <Button type="submit" > Create Quiz</Button>
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
