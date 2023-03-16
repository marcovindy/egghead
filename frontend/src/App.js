import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Form, Container, Row, Col, Button, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Select from "react-select";

import axios from "axios";

import { AuthContext } from "./helpers/AuthContext";

import JoinGame from './components/JoinGame/JoinGame';
import GameMaster from './components/GameMaster/GameMaster';
import GamePlayer from './components/GamePlayer/GamePlayer';
import Leaderboard from './components/Leaderboard/Leaderboard';
import LandingPage from './pages/Home/LandingPage';
import Registration from './pages/Register/Register';
import Login from './pages/Login/Login';
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
/* To Component End */

function App() {
  /* AUTH */
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
  };
  /* END AUTH */




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
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <div className="App">
          <BrowserRouter>
            {/* To Component Start */}
            <header className="navBar-header">
              <Navbar collapseOnSelect expand="lg" variant="dark">
                <Container className='justify-content-between'>
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="responsive-navbar-nav justify-content-end">

                    <Navbar.Brand className=' d-none d-lg-block'>
                      <NavLink className='px-3 navlink' to='/'>
                        <img className='hm-50px' src={Logo} />
                      </NavLink>
                    </Navbar.Brand>
                    <Nav className='justify-content-end'>
                      <NavLink className='px-3 navlink' to='/'><span className="align-middle">{t('Home')}</span></NavLink>
                      <NavLink className='px-3 navlink' to='/lobby'><span className="align-middle">{t('Play')}</span></NavLink>

                      {!authState.status && (
                        <>
                          <NavLink className='px-3 navlink' to='/registration'><span className="align-middle">{t('Sign up')}</span></NavLink>
                          <NavLink className='px-3 navlink' to='/login'><span className="align-middle">{t('Log in')}</span></NavLink>
                        </>
                      )}

                      <div className="loggedInContainer">
                        <h1>{authState.username} </h1>
                        {authState.status && <button onClick={logout}> Logout</button>}
                      </div>
                      {authState.status && <h1>True</h1>}
                      {!authState.status && <h1>False</h1>}
                      <Select className='lang-select' placeholder="EN" options={options} onChange={handleChange} />
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
                <Route path="/gameplayer" component={GamePlayer} />
                <Route path="/leaderboard" component={Leaderboard} />
                <Route path="/" component={LandingPage} />
              </Switch>
            </main>
          </BrowserRouter>
        </div >
      </AuthContext.Provider>
    </I18nPropvider >
  );
};

export default App;