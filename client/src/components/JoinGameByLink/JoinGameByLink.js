import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import t from "../../i18nProvider/translate";
import queryString from "query-string";
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from "../../helpers/AuthContext";

const JoinGameByLink = ({ location }) => {
    const [joinRoomName, setJoinRoomName] = useState("");
    const [playerName, setPlayerName] = useState("");

    const { authState } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        const { roomName } = queryString.parse(location.search);
        setJoinRoomName(roomName);
        if (authState && authState.username) {
            setPlayerName(authState.username)
            console.log(authState.username);
        }
    }, [location, authState]);

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col>
                    <h1>{t("Join Game")}</h1>
                </Col>
            </Row>
            {authState && authState.username ? (
                <div>
                    <p>
                        {t("You are logged in as")} {authState.username}
                    </p>
                    <Link to={`/gameplayer?joinRoomName=${joinRoomName}&playerName=${playerName}&gameMode=CustomGame`}>
                        <Button>{t("Join Game")}</Button>
                    </Link>
                </div>
            ) : (
                <Formik
                    initialValues={{
                        playerName: "",
                    }}
                    validationSchema={Yup.object({
                        playerName: Yup.string()
                            .min(3, "Must be at least 3 characters")
                            .max(20, "Must be less than 20 characters")
                            .required("Required"),
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                        setPlayerName(values.playerName);
                        setSubmitting(false);
                        history.push(`/gameplayer?joinRoomName=${joinRoomName}&playerName=${values.playerName}&gameMode=CustomGame`);
                    }}
                >
                    {({ isSubmitting, isValid }) => (
                        <FormikForm>
                            <Form.Group controlId="playerName">
                                <Form.Label>{t("Your name")}</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    name="playerName"
                                    autoComplete="off"
                                    placeholder={"Enter your name"}
                                />
                                <ErrorMessage
                                    component="div"
                                    name="playerName"
                                    className="text-danger"
                                />
                            </Form.Group>
                            <Button type="submit" disabled={isSubmitting || !isValid}>
                                {t("Join Game")}
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            )}
        </Container>
    );
};

export default JoinGameByLink;
