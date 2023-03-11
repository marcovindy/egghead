import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function CreateUser() {
    const initialValues = {
        username: "",
        password: "",
        email: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required(),
    });

    const onSubmit = (data) => {
        try {
            if (process.env.NODE_ENV === "development"){
                axios.post(`http://localhost:5000/auth`, data).then(() => {
                    console.log(data);
                });
            } else {
                axios.post(`https://testing-egg.herokuapp.com/auth`, data).then(() => {
                    console.log(data);
                });
            }
          
        } catch (error) {
            console.log(error.response.data);
        }
    };

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <label>Username: </label>
                    <ErrorMessage name="username" component="span" />
                    <Field
                        autocomplete="off"
                        id="inputCreatePost"
                        name="username"
                        placeholder="(Ex. John123...)"
                    />

                    <label>Email: </label>
                    <ErrorMessage name="email" component="span" />
                    <Field
                        autocomplete="off"
                        id="inputCreatePost"
                        name="email"
                        placeholder="Your Email..."
                    />

                    <label>Password: </label>
                    <ErrorMessage name="password" component="span" />
                    <Field
                        autocomplete="off"
                        type="password"
                        id="inputCreatePost"
                        name="password"
                        placeholder="Your Password..."
                    />



                    <button type="submit"> Register</button>
                </Form>
            </Formik>
        </div>
    );
}

export default CreateUser;