import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Container, Button, Image, Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import axios from "axios";

import imgEggL from "../../assets/images/egg1.webp";

import "./Signup.css";

import t from "../../i18nProvider/translate";

function Signup() {
  const API_URL =
    process.env.NODE_ENV === "production"
      ? `https://testing-egg.herokuapp.com`
      : `http://localhost:5000`;

  const history = useHistory();

  const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    avatar: "default-avatar.webp",
    description: "No description provided.",
  };



  const yupTranslate = (data) => {
    return t(data);
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(
        /^[A-Za-z0-9]+$/,
        yupTranslate("username-validation-letters-numbers")
      )
      .min(3, yupTranslate("username-validation-min-length"))
      .max(20, yupTranslate("username-validation-max-length"))
      .required(yupTranslate("username-validation-required")),
    password: Yup.string()
      .min(8, yupTranslate("password-validation-min-length"))
      .required(yupTranslate("password-validation-required"))
      .test('password-complexity', yupTranslate("password-validation-complexity"), (value) => {
        if (!/[a-z]/.test(value)) return false; 
        if (!/[A-Z]/.test(value)) return false; 
        if (!/\d+/.test(value)) return false;
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return false;
        return true;
      }),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], yupTranslate("confirm-password-validation-match"))
      .required(yupTranslate("confirm-password-validation-required")),
    email: Yup.string()
      .email(yupTranslate("email-validation-format"))
      .required(yupTranslate("email-validation-required")),
  });



  const onSubmit = (data) => {
    try {
      axios
        .post(`${API_URL}/auth/signup`, data)
        .then(() => {
          toast.success(t("signup-success"));
          history.push("/login");
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            toast.error(error.response.data.message);
          } else {
            toast.error("An error occurred");
          }
        });
    } catch (error) {
      console.log(error.response);
      toast.error("An error occurred");
    }
  };

  return (
    <Container className="container-sign p-0" id="container-sign">
      <Row className="">
        <Col md={6} xs={12} className="background p-5 col-left">
          <h1>{t("sign-in-text-1")}</h1>
          <p>{t("sign-in-text-2")}</p>
          <Image src={imgEggL} alt="SignupImg" rounded />
          <Link to="/login" className="a-button" id="signIn">
            {t("Log in")}
          </Link>
        </Col>
        <Col md={6} xs={12} className=" p-lg-5 p-sm-4 col-right">
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {(formik) => (
              <Form className="formContainer">
                <h1>{t("Create Account")}</h1>

                <div className="social-container"></div>
                <label>{t("Username")}: </label>
                <ErrorMessage
                  className="ml-1   text-color-red"
                  name="username"
                  component="span"
                />
                <Field
                  autoComplete="off"
                  id="inputCreateusername"
                  name="username"
                  placeholder="(Ex. Eggman007...)"
                />

                <label>{t("Email")}: </label>
                <ErrorMessage
                  className="ml-1   text-color-red"
                  name="email"
                  component="span"
                />
                <Field
                  autoComplete="off"
                  id="inputCreateEmail"
                  name="email"
                  placeholder="(Ex. Eggman007@egghead.com...)"
                />

                <label>{t("Password")}: </label>
                <ErrorMessage
                  className="ml-1   text-color-red"
                  name="password"
                  component="span"
                />
                <Field
                  autoComplete="off"
                  type="password"
                  id="inputCreatePassword"
                  name="password"
                  placeholder="Your Password..."
                />

                <label>{t("Confirm Password")}: </label>
                <ErrorMessage
                  className="ml-1 text-color-red"
                  name="confirmPassword"
                  component="span"
                />
                <Field
                  autoComplete="off"
                  type="password"
                  id="inputCreateConfirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Your Password..."
                />

                <Button type="submit" disabled={!formik.isValid}>
                  {" "}
                  {t("Sign up")}
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
}

export default Signup;
