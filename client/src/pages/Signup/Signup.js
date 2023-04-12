import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Container, Button, Image, Row, Col } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from "yup";
import axios from "axios";

import { toast } from 'react-toastify';

import AvatarImg from '../../assets/images/egg1.png';

import imgEggL from '../../assets/images/egg1.png';

import './Signup.css';

import t from "../../i18nProvider/translate";

function Signup() {
    const initialValues = {
        username: "",
        password: "",
        email: "",
        avatar: AvatarImg,
        description: "No description provided",
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
            toast.success(t("signup-success"));
        } catch (error) {
            console.log(error.response.data);
            toast.error(error.response.data);
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
                                placeholder="(Ex. John123...)"
                            />

                            <label>Email: </label>
                            <ErrorMessage className="ml-1   text-color-red" name="email" component="span" />
                            <Field
                                autoComplete="off"
                                id="inputCreatePost"
                                name="email"
                                placeholder="Your Email..."
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
                            <Button type="submit"> {t('Sign up')}</Button>
                        </Form>
                    </Formik>
                </Col>
            </Row>
        </Container>


    );
}

export default Signup;