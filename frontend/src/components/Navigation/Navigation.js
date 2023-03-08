import React from 'react';
import { Form, Container, Row, Col, Button, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

import './Navigation.css';
import Logo from '../../assets/images/trivia.png';

// // Translation imports
// import {FormattedMessage} from "react-intl";
// import { I18nPropvider, LOCALES } from '../../i18nProvider';
import t from "../../i18nProvider/translate";
// import Input from '../../input';


export default function Navigation(props) {

    // const chageLang = (option) =>  {
    //     localStorage.setItem('lang', option.target.value);
    //     window.location.reload();
    // }

    // const lang = localStorage.getItem('lang') || 'en';

    // const [locale, setLocale] = useState(LOCALES.ENGLISH);


    return (
        <header className="navBar-header">
            <Container className='p-0'>
                <Row className='p-0 m-0'>
                    <Col>
                        <Col className='navBar-items col-logo justify-content-start'>
                            <NavLink to='/'><img className='logo' src={Logo} alt='logo' /></NavLink>
                        </Col>
                    </Col>
                    <Col>
                        <Col className='navBar-items justify-content-end align-middle'>
                            Not translated part. {t('hello')}
                            <NavLink to='/'><span className="align-middle">Home</span></NavLink>
                            <NavLink to='/'><span className="align-middle">Lorem</span></NavLink>
                            <NavLink to='/'><span className="align-middle">Home</span></NavLink>
                            <NavLink to='/lobby'><span className="align-middle">Play</span></NavLink>

                        </Col>
                    </Col>
        


                </Row>
            </Container>
        </header>

    );
};