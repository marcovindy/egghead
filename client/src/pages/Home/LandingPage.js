import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './LandingPage.css';
import mainImage from '../../assets/images/MainImage.png'

import t from "../../i18nProvider/translate";
import { AuthContext } from '../../helpers/AuthContext';

const LandingPage = () => {
    const { authState } = React.useContext(AuthContext);
    const currentUser = authState.status;

    return (
        <div className="landing-page-background">

            <Container className='p-0'>
                <Row className="justify-content-md-center mt-5">
                    <Col md={6} xs={12} className="d-flex flex-column justify-content-center">
                        <h1>{t("landingpage-title")}</h1>
                        <p className='landing-page-description'>{t("landingpage-description")}</p>
                        <Link className="mr-3" to="/lobby">
                            <Button variant='dark' size="lg">
                                {t("Play")}
                            </Button>
                        </Link>
                        {!currentUser && (
                            <Link to="/registration">
                                <Button variant='dark' size="lg">
                                    {t("Sign up")}
                                </Button>
                            </Link>
                        )}
                    </Col>
                    <Col md={6} xs={12}>
                        <img src={mainImage} alt="MainImage" />
                    </Col>
                </Row>
                <div>
                    <div class="shape-blob"></div>
                    <div class="shape-blob one"></div>
                    <div class="shape-blob two"></div>
                </div>
            </Container>
        </div>
    );
}

export default LandingPage;
