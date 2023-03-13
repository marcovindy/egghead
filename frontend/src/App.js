import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Form, Container, Row, Col, Button, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Select from "react-select";

import JoinGame from './components/JoinGame/JoinGame';
import GameMaster from './components/GameMaster/GameMaster';
import GamePlayer from './components/GamePlayer/GamePlayer';
import Leaderboard from './components/Leaderboard/Leaderboard';
// import Navigation from './components/Navigation/Navigation';
import LandingPage from './pages/Home/LandingPage';
import Registration from './pages/Register/Register';
import CreateUser from './pages/CreateUser/CreateUser';
import CreateUser2 from './pages/CreateUser/CrateUser2';

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

  const options = [
    { value: "en", label: "ENGLISH" },
    { value: "cs", label: "ČEŠTINA" },
    { value: "fr", label: "FRENCH" }
  ];

  const [locale, setLocale] = useState(LOCALES.ENGLISH);

  function handleChange(selectedOption) {
    console.log(selectedOption.value);
    if (selectedOption.value === "cs") {
      setLocale(LOCALES.CZECH);
    } else if (selectedOption.value === "en") {
      setLocale(LOCALES.ENGLISH);
    } else if (selectedOption.value === "fr") {
      setLocale(LOCALES.FRENCH);
    }
  };


  return (
    <I18nPropvider locale={locale}>
      <div className="App">
        <BrowserRouter>
          {/* To Component Start */}
          <header className="navBar-header">

            <Navbar collapseOnSelect expand="sm" className='p-0 m-0'>
              <Container className='p-0'>
                <Navbar.Toggle aria-controls='navbarScroll' data-bs-formTarget='#navbarScroll' />
                <Navbar.Collapse id='navbarScroll' className='justify-content-between'>
                  <Nav className='justify-start'>
                    <NavLink className='navlink-logo' to='/'><img className='logo h-100' src={Logo} alt='logo' /></NavLink>
                  </Nav>
                  <Nav className='justify-end'>
                    <NavLink to='/'><span className="p-3 align-middle">{t('Home')}</span></NavLink>
                    <NavLink to='/lobby'><span className="p-3 align-middle">{t('Play')}</span></NavLink>
                    <NavLink to='/registration'><span className="p-3 align-middle">{t('Sign up')}</span></NavLink>
                    <NavLink to='/'><span className="p-3 align-middle">{t('Log in')}</span></NavLink>
                    <Select placeholder="EN" options={options} onChange={handleChange} />
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </header>
          {/* To Component End */}
          <main>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/registration" component={CreateUser2} />
              <Route path="/lobby" exact component={JoinGame} />
              <Route path="/gamemaster" component={GameMaster} />
              <Route path="/createuser" component={CreateUser} />
              <Route path="/gameplayer" component={GamePlayer} />
              <Route path="/leaderboard" component={Leaderboard} />
              <Route path="/" component={LandingPage} />
            </Switch>
          </main>
        </BrowserRouter>
      </div >
    </I18nPropvider >
  );
};

export default App;