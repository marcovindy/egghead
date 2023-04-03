import React, { useState, useContext } from "react";
import axios from "axios";
import { Container, Button, Image, Row, Col } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from "../../helpers/AuthContext";

import imgEggR from '../../assets/images/egg2.png';

import { toast } from 'react-toastify';

import t from "../../i18nProvider/translate";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  let history = useHistory();

  const login = () => {
    const data = { username, password };
    const API_URL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : "https://testing-egg.herokuapp.com";
  
    axios.post(`${API_URL}/auth/login`, data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        toast.success(t("login-success"));
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        history.push("/");
      }
    });
  };
  
  
  return (
    <Container className="container-sign p-0" id="container-sign">
      <Row className="">
        <Col md={6} xs={12} className="p-5">
          <div className="align-middle">
            <h1>Login</h1>
            <label>Username:</label>
            <input
              type="text"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <label>Password:</label>
            <input
              type="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />

            <button onClick={login}> {t('Log in')}</button>
          </div>
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
