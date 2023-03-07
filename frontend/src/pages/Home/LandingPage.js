import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './LandingPage.css';
import mainImage from '../../assets/images/MainImage.png'

import t from "../../i18nProvider/translate";

const LandingPage = () => {

    return (
        <div className="landing-page-background">
            <Container className='p-0'>
                <Row className="justify-content-md-center mt-5">
                    <Col>
                        <h1>{t("landingpage-title")}</h1>
                        <p className='landing-page-description'>{t("landingpage-description")}</p>
                        <Link className="mr-3" to="/">
                            <Button variant='dark' size="lg">
                                {t("Play")}
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button variant='dark' size="lg">
                                {t("Sign up")}
                            </Button>
                        </Link>
                    </Col>
                    <Col>
                        <img src={mainImage} alt="MainImage" />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LandingPage;

