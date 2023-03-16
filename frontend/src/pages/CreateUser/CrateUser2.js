import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import * as Yup from "yup";
import axios from "axios";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import imgEggL from '../../assets/images/egg1.png';
import imgEggR from '../../assets/images/egg2.png';

import './CreateUser.css';

import t from "../../i18nProvider/translate";

function CreateUser2() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let history = useHistory();

    const [isActive, setActive] = useState("false");

    const handleToggle = () => {
        setActive(!isActive);
    };

    const initialValues = {
        username: "",
        password: "",
        email: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required(),
        email: Yup.string().email().required(),
    });

    const onSubmit = (data) => {
        try {
            if (process.env.NODE_ENV === "development") {
                axios.post(`http://localhost:5000/auth`, data).then(() => {
                    console.log(data);
                });
            } else {
                axios.post(`https://testing-egg.herokuapp.com/auth`, data).then(() => {
                    console.log(data);
                });
            }
            toast.success("User created successfully!");
        } catch (error) {
            console.log(error.response.data);
            toast.error(error.response.data);
        }
    };

    // LOGIN

    const login = (data) => {
        try {
            console.log(data);
            if (process.env.NODE_ENV === "development") {
                axios.post("http://localhost:5000/auth/login", data).then((response) => {
                    console.log(data);
                    if (response.data.error) {
                        alert(response.data.error);
                    } else {
                        sessionStorage.setItem("accessToken", response.data);
                        history.push("/");
                    }
                });
            } else {
                axios.post("https://testing-egg.herokuapp.com/auth/login", data).then((response) => {
                    console.log(data);
                    if (response.data.error) {
                        alert(response.data.error);
                    } else {
                        sessionStorage.setItem("accessToken", response.data);
                        history.push("/");
                    }
                });
            }
        } catch (error) {
            console.log(error.response.data);
            toast.error(error.response.data);
        }
    };

    // END LOGIN

    return (


        <Container className={isActive ? "container-sign right-panel-active" : "container-sign"} id="container-sign">
            <div className="form-container sign-up-container">
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >

                    <Form className="formContainer">
                        <h1>{t("Create Account")}</h1>

                        <div className="social-container">
                            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
                            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                        <span>or use your email for registration</span>
                        <label>Username: </label>
                        <ErrorMessage name="username" component="span" />
                        <Field
                            autoComplete="off"
                            id="inputCreatePost"
                            name="username"
                            placeholder="(Ex. John123...)"
                        />

                        <label>Email: </label>
                        <ErrorMessage name="email" component="span" />
                        <Field
                            autoComplete="off"
                            id="inputCreatePost"
                            name="email"
                            placeholder="Your Email..."
                        />

                        <label>Password: </label>
                        <ErrorMessage name="password" component="span" />
                        <Field
                            autoComplete="off"
                            type="password"
                            id="inputCreatePost"
                            name="password"
                            placeholder="Your Password..."
                        />
                        <button type="submit"> Register</button>
                    </Form>
                </Formik>
            </div>

            <div className="form-container sign-in-container">
                <Formik
                    initialValues={initialValues}
                    onSubmit={login}
                    validationSchema={validationSchema}
                >
                    <Form className="formContainer">
                        <h1>Sign in</h1>

                        <div className="social-container">
                            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
                            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                        <span>or use your email for registration</span>
                        <label>Username: </label>
                        <ErrorMessage name="username" component="span" />
                        <Field
                            autoComplete="off"
                            id="inputCreatePost"
                            name="username"
                            placeholder="(Ex. John123...)"
                            type="text"
                        />

                        <label>Password: </label>
                        <ErrorMessage name="password" component="span" />
                        <Field
                            autoComplete="off"
                            type="password"
                            id="inputCreatePost"
                            name="password"
                            placeholder="Your Password..."
                        />


                        <a href="#">Forgot your password?</a>
                        <button type="submit"> Sign In</button>
                    </Form>
                </Formik>

            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Welcome Back!</h1>
                        <p>To keep connected with us please login with your personal info</p>
                        <Image
                            src=
                            {imgEggL}
                            rounded
                        />
                        <Button
                            onClick={handleToggle}
                            className="ghost"
                            id="signIn"
                        >Sign In</Button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <h1>Hello, Friend!</h1>
                        <p>Enter your personal details and start journey with us</p>
                        <Image
                            src=
                            {imgEggR}
                            rounded
                        />
                        <Button
                            onClick={handleToggle}
                            className="ghost"
                            id="signUp"
                        >Sign Up</Button>
                    </div>
                </div>
            </div>
        </Container>


    );
}

export default CreateUser2;