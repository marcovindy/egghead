import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Container, Button, Image, Row, Col } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import axios from "axios";



import AvatarImg from '../../assets/images/egg1.png';

import imgEggL from '../../assets/images/egg1.png';

import './Signup.css';

import t from "../../i18nProvider/translate";

function Signup() {
    const API_URL = process.env.NODE_ENV === "production"
        ? `https://testing-egg.herokuapp.com`
        : `http://localhost:5000`;

    const history = useHistory();

    const initialValues = {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        avatar: AvatarImg,
        description: "No description provided.",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .matches(/^[A-Za-z0-9]+$/, "Username can only contain letters and numbers")
            .min(3, "Username should be at least 3 characters long")
            .max(20, "Username should not exceed 20 characters")
            .required("Username is required"),
        password: Yup.string()
            .min(8, "Password should be at least 8 characters long")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/,
                "Password should contain at least one uppercase letter, one lowercase letter, and one number"
            )
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
    });


    const onSubmit = (data) => {
        try {
            axios.post(`${API_URL}/auth/signup`, data)
                .then(() => {
                    toast.success(t("signup-success"));
                    history.push('/login');
                })
                .catch((error) => {
                    if (error.response && error.response.data) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error('An error occurred');
                    }
                });
        } catch (error) {
            console.log(error.response);
            toast.error('An error occurred');
        }
    };


    return (


        <Container className="container-sign p-0" id="container-sign">
            <Row className="">
                <Col md={6} xs={12} className="background p-5 col-left">
                    <h1>{t('sign-in-text-1')}</h1>
                    <p>{t('sign-in-text-2')}</p>
                    <Image
                        src=
                        {imgEggL}
                        rounded
                    />
                    <Link
                        to='/login'
                        className="a-button"
                        id="signIn"
                    >{t('Log in')}</Link>
                </Col>
                <Col md={6} xs={12} className="p-5 col-right">
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={validationSchema}
                    >
                        {(formik) => (
                            <Form className="formContainer">
                                <h1>Create Account</h1>

                                <div className="social-container">
                                </div>
                                <label>Username: </label>
                                <ErrorMessage className="ml-1   text-color-red" name="username" component="span" />
                                <Field
                                    autoComplete="off"
                                    id="inputCreatePost"
                                    name="username"
                                    placeholder="(Ex. Eggman007...)"
                                />

                                <label>Email: </label>
                                <ErrorMessage className="ml-1   text-color-red" name="email" component="span" />
                                <Field
                                    autoComplete="off"
                                    id="inputCreatePost"
                                    name="email"
                                    placeholder="(Ex. Eggman007@egghead.com...)"
                                />

                                <label>Password: </label>
                                <ErrorMessage className="ml-1   text-color-red" name="password" component="span" />
                                <Field
                                    autoComplete="off"
                                    type="password"
                                    id="inputCreatePost"
                                    name="password"
                                    placeholder="Your Password..."
                                />

                                <label>Confirm Password: </label>
                                <ErrorMessage className="ml-1 text-color-red" name="confirmPassword" component="span" />
                                <Field
                                    autoComplete="off"
                                    type="password"
                                    id="inputCreatePost"
                                    name="confirmPassword"
                                    placeholder="Confirm Your Password..."
                                />

                                <Button type="submit" disabled={!formik.isValid}> {t('Sign up')}</Button>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
}

export default Signup;