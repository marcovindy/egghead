import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";
import CheckboxGroup from "../CheckboxGroup/CheckboxGroup";

const IS_PROD = process.env.NODE_ENV === "development";
const URL = IS_PROD ? "http://localhost:5000" : "https://testing-egg.herokuapp.com";

function CreateQuiz() {

    const { authState } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

    let history = useHistory();
    const initialValues = {
        title: "",
        description: "",
    };
    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            history.push("/login");
        }
        axios
            .get(`${URL}/categories`)
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
        description: Yup.string().required("You must input a description!"),
    });

    const onSubmit = (data) => {
        const categoryIds = categories
            .filter((category) => data.categories.includes(category.name))
            .map((category) => category.id);
        axios
            .post(`${URL}/quizzes/create`, {
                title: data.title,
                description: data.description,
                categoryIds,
            }, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                history.push("/");
            });
    };

    return (
        <div className="createQuizPage">
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <label>Title: </label>
                    <ErrorMessage name="title" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreateQuizTitle"
                        name="title"
                        placeholder="(Ex. Quiz Title...)"
                    />
                    <div className="categories-group p-5">
                        <label>Categories: </label>
                        <ErrorMessage name="categories" component="span" />
                        <CheckboxGroup
                            name="categories"
                            options={categories.map((category) => category.name)}
                        />
                    </div>
                    {error && <span className="error">{error}</span>}
                    <label>Description: </label>
                    <ErrorMessage name="description" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreateQuizDescription"
                        name="description"
                        placeholder="(Ex. Quiz Description...)"
                        as="textarea"
                        rows="5"
                    />

                    <button type="submit"> Create Quiz</button>
                </Form>
            </Formik>
        </div>
    );
}

export default CreateQuiz;
