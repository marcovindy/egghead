import React, { useState, useContext } from "react";
import axios from "axios";
import { Container, Button, Image, Row, Col } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from "../../helpers/AuthContext";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

import imgEggR from '../../assets/images/egg2.png';

import t from "../../i18nProvider/translate";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  let history = useHistory();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required"),
    password: Yup.string()
      .required("Password is required")
  });

  const login = (data) => {
    const API_URL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : "https://testing-egg.herokuapp.com";

    axios.post(`${API_URL}/auth/login`, data)
      .then((response) => {
        toast.success(t("login-success"));
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          email: response.data.email,
          experience: response.data.experience,
          level: response.data.level,
          status: true,
        });
        history.push("/play");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(error.response.data.error);
          console.log(error.response.data.error);
        } else {
          toast.error("Error");
          console.log(error.response.data.error);
        }
      });
  };

  return (
    <Container className="container-sign p-0" id="container-sign">
      <Row className="">
        <Col md={6} xs={12} className="p-5">
          <Formik
            initialValues={initialValues}
            onSubmit={login}
            validationSchema={validationSchema}
          >
            {(formik) => (
              <Form className="formContainer">
                <h1>{t('Login')}</h1>

                <div className="-socialcontainer">
                </div>
                <label>{t('Username')}: </label>
                <ErrorMessage className="ml-1   text-color-red" name="username" component="span" />
                <Field
                  autoComplete="off"
                  id="inputCreatePost"
                  name="username"
                  placeholder="(Ex. Eggman007...)"
                />

                <label>{t('Password')}: </label>
                <ErrorMessage className="ml-1   text-color-red" name="password" component="span" />
                <Field
                  autoComplete="off"
                  type="password"
                  id="inputCreatePost"
                  name="password"
                  placeholder="Your Password..."
                />
                <Button type="submit" disabled={!formik.isValid}> {t('Log in')}</Button>
              </Form>
            )}
          </Formik>
        </Col>
        <Col md={6} xs={12} className="background p-5 col-right">
          <h1>{t('sign-up-text-1')}</h1>
          <p>{t('sign-up-text-2')}</p>
          <Image
            src=
            {imgEggR}
            rounded
          />
          <Link
            to='/signup'
            className="a-button"
            id="signUp"
          >{t('Sign up')}</Link>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
