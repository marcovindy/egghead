import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './LandingPage.css';
import mainImage from '../../assets/images/MainImage.png'
import egg3Image from '../../assets/images/egg3.png'
import { FaDiscord } from 'react-icons/fa';

import t from "../../i18nProvider/translate";
import { AuthContext } from '../../helpers/AuthContext';

import { PlayFill } from 'react-bootstrap-icons';


const LandingPage = () => {
    const { authState } = React.useContext(AuthContext);
    const currentUser = authState.status;

    return (
        <div className="landing-page-background">

            <Container className='p-0'>
                <div className='blob-container'>
                    <div className="shape-blob"></div>
                    <div className="shape-blob one"></div>
                    <div className="shape-blob two"></div>
                </div>
                <Row className="justify-content-md-center mt-5">

                    <Col md={6} xs={12} className="d-flex flex-column justify-content-center">
                        <h1>{t("landingpage-title")}</h1>
                        <p className='landing-page-description'>{t("landingpage-description")}</p>
                        <Link className="mr-3 d-flex justify-content-center" to="/play">
                            <button className="button-perspective" role="button">
                                {t("Play")} <PlayFill size={32} color="white" />
                            </button>
                        </Link>
                        {!currentUser && (
                            <Link className="m-2" to="/registration">
                                <Button variant='primary' size="lg">
                                    {t("Sign up")}
                                </Button>
                            </Link>
                        )}
                    </Col>
                    <Col md={6} xs={12}>
                        <img src={mainImage} alt="MainImage" />
                    </Col>
                </Row>
                <div className='blob-container'>
                    <div className="shape-blob three"></div>
                </div>
                <Row>
                    <Col md={6} xs={12}>
                        <img src={egg3Image} alt="egg3" />
                    </Col>
                    <Col md={6} xs={12} className="d-flex flex-column justify-content-center">
                        <p className='landing-page-description'>
                            Hrajte novou multiplayerovou hru plnou otázek a zábavy! Spojte se s naší komunitou a sdílejte své nápady, nahlášení chyb a tipy s ostatními hráči přes naši {''}
                            <Button target='_blank' rel='noopener noreferrer' variant="primary" href="https://discord.gg/eCXJTQ7EXQ">
                                <FaDiscord className='me-2' />
                                Discord
                            </Button> {' '}
                            komunitu. Přidejte se k nám a bavte se s námi!
                        </p>
                    </Col>
                </Row>

            </Container>
        </div>
    );
}

export default LandingPage;
