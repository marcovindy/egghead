import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, Router } from 'react-router-dom';
import { Form, Container, Row, Col, Button, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import JoinGame from './components/JoinGame/JoinGame';
import GameMaster from './components/GameMaster/GameMaster';
import GamePlayer from './components/GamePlayer/GamePlayer';
import Leaderboard from './components/Leaderboard/Leaderboard';
// import Navigation from './components/Navigation/Navigation';
import LandingPage from './pages/Home/LandingPage';
import Registration from './pages/Register/Register';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Translation imports
// import { FormattedMessage } from "react-intl";
import { I18nPropvider, LOCALES } from './i18nProvider';
import t from "./i18nProvider/translate";
// import Input from './input';

/* To Component Start */
import './components/Navigation/Navigation.css';
import Logo from './assets/images/trivia.png';
import Login from './pages/Login/Login';
/* To Component End */

function App() {

  const [locale, setLocale] = useState(LOCALES.ENGLISH);

  function handleChange(e) {
    console.log(e.target.value);
    if (e.target.value == "cs") {
      setLocale(LOCALES.CZECH);
      console.log("cs")
    }
  };





  return (
    <I18nPropvider locale={locale}>
       
      <div className="App">
        <BrowserRouter>
          {/* To Component Start */}
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
                    <NavLink to='/'><span className="align-middle">{t('Home')}</span></NavLink>
                    <NavLink to='/lobby'><span className="align-middle">{t('Play')}</span></NavLink>
                    <NavLink to='/registration'><span className="align-middle">{t('Sign up')}</span></NavLink>
                    <NavLink to='/'><span className="align-middle">{t('Log in')}</span></NavLink>
                    <select onChange={handleChange} value={locale}>
                      <option value="cs">Čeština</option>
                      <option value="en">English</option>
                      <option value="fr">French</option>
                    </select>

                  </Col>
                </Col>
                <Col>
                  <button onClick={() => setLocale(LOCALES.CZECH)}>Čeština</button>
                  <button onClick={() => setLocale(LOCALES.ENGLISH)}>English</button>
                  <button onClick={() => setLocale(LOCALES.FRENCH)}>French</button>
                  <button onClick={() => setLocale(LOCALES.GERMAN)}>German</button>
                </Col>


              </Row>
            </Container>
          </header>
          {/* To Component End */}
          <main>
       
            <Routes>
              <Route path="/login" element={<Login/>} />
              <Route path="/registration" element={<Registration/>} />
              <Route path="/lobby" element={<JoinGame/>} />
              <Route path="/gamemaster" element={<GameMaster />} />
              <Route path="/gameplayer" element={<GamePlayer/>} />
              <Route path="/leaderboard" element={<Leaderboard/>} />
              <Route path="/" exact element={<LandingPage/>} />
            </Routes>  
          
          </main>
        </BrowserRouter>
      </div >
    </I18nPropvider>
  );
};

export default App;