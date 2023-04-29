import { BrowserRouter as Router, Route, Switch, Link, NavLink } from "react-router-dom";
import { Navbar, Container, Nav, Row, Col } from "react-bootstrap";
import Select from "react-select";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Signin/Login";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Profile from "./pages/Profile/Profile";
import ChangePassword from "./pages/ChangePassword";
import Signup from "./pages/Signup/Signup";
import LandingPage from './pages/Home/LandingPage';
import RankedGame from './pages/RankedGame/RankedGame';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import Quiz from './pages/Quiz/Quiz';
import Play from './pages/Play/Play';
import JoinGame from './components/JoinGame/JoinGame';
import CreateQuiz from './components/CreateQuiz/CreateQuiz';
import Footer from './components/Footer/Footer';
import GameMaster from './components/GameMaster/GameMaster';
import GamePlayer from './components/GamePlayer/GamePlayer';

import Logo from "./assets/images/trivia.png";

import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './assets/styles/Navigation/Navigation.css';
import './assets/styles/Progress/Progress.css';
import './assets/styles/Forms/Forms.css';

import { I18nPropvider, LOCALES } from './i18nProvider';
import t from "./i18nProvider/translate";

function App() {


  // Inicializace stavu autentizace se výchozími hodnotami
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  // Získání stavu autentizace při načtení komponenty
  useEffect(() => {
    // Zavolání API pro ověření stavu autentizace
    axios.get(
      process.env.NODE_ENV === "production"
        ? "https://testing-egg.herokuapp.com/auth/auth"
        : "http://localhost:5000/auth/auth",
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }
    )
      .then((response) => {
        // Pokud dojde k chybě, nastaví se stav autentizace na false
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        }
        // V opačném případě se nastaví stav autentizace na základě odpovědi
        else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  // Funkce pro odhlášení uživatele
  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    toast.success(t("logout-success"));
  };

  // Dostupné možnosti jazyků
  const options = [
    { value: "en", label: "ENGLISH" },
    { value: "cs", label: "ČEŠTINA" },
    { value: "fr", label: "FRENCH" },
    { value: "es", label: "SPANISH" },
    { value: "ru", label: "RUSSIAN" },
    { value: "uk", label: "UKRAINIAN" }
  ];

  // Inicializace stavu jazyka s výchozí hodnotou
  const [locale, setLocale] = useState(LOCALES.ENGLISH);

  // Funkce pro změnu vybraného jazyka
  function handleChange(selectedOption) {
    // Nastavení jazyka na základě vybrané možnosti
    if (selectedOption.value === "cs") {
      setLocale(LOCALES.CZECH);
    } else if (selectedOption.value === "en") {
      setLocale(LOCALES.ENGLISH);
    } else if (selectedOption.value === "es") {
      setLocale(LOCALES.SPANISH);
    } else if (selectedOption.value === "ru") {
      setLocale(LOCALES.RUSSIAN);
    } else if (selectedOption.value === "uk") {
      setLocale(LOCALES.UKRAINIAN);
    }
  };



  return (
    <div className="App">
      <I18nPropvider locale={locale}>
        <AuthContext.Provider value={{ authState, setAuthState }}>
          <Router>
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
                      <NavLink className='px-3 navlink' to='/play'><span className="align-middle">{t('Play')}</span></NavLink>
                      {!authState.status && (
                        <>
                          <NavLink className='px-3 navlink' to='/signup'><span className="align-middle">{t('Sign up')}</span></NavLink>
                          <NavLink className='px-3 navlink' to='/login'><span className="align-middle">{t('Log in')}</span></NavLink>
                        </>
                      )}
                      <div className="loggedInContainer">
                        <Row className='p-0 m-0'>
                          {authState.status && (
                            <>
                              <Col>
                                <DropdownButton id="dropdown-basic-button" title={`${authState.username}`}>
                                  <Dropdown.Item>
                                    <NavLink className='navlink' to={`/profile/${authState.username}`}>
                                      <span className="align-middle">{t("Profile")} </span>
                                    </NavLink>
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    <NavLink className='navlink' to={`/leaderboard`}>
                                      <span className="align-middle">Leaderboard</span>
                                    </NavLink>
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={logout} href="#">{t("Logout")}</Dropdown.Item>
                                </DropdownButton>
                              </Col>
                            </>
                          )}
                        </Row>
                      </div>
                      <Select className='lang-select' placeholder="EN" options={options} onChange={handleChange} />
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>

            </header>
            <Switch>
              <Route path="/" exact component={LandingPage} />
              <Route path="/createquiz" exact component={CreateQuiz} />
              <Route path="/customgame" exact component={Dashboard} />
              <Route path="/rankedgame" exact component={RankedGame} />
              <Route path="/lobby" exact component={JoinGame} />
              <Route path="/createpost" exact component={CreatePost} />
              <Route path="/post/:id" exact component={Post} />
              <Route path="/signup" exact component={Signup} />
              <Route path="/login" exact component={Login} />
              <Route path="/leaderboard" exact component={Leaderboard} />
              <Route path="/profile/:username" exact component={Profile} />
              <Route path="/quiz/:id" exact component={Quiz} />
              <Route path="/changepassword" exact component={ChangePassword} />
              <Route path="/gamemaster" component={GameMaster} />
              <Route path="/gameplayer" component={GamePlayer} />
              <Route path="/play" component={Play} />
              <Route path="*" exact component={PageNotFound} />
            </Switch>
          </Router>
          <ToastContainer

          />
          <Footer />

        </AuthContext.Provider>
      </I18nPropvider>
    </div>
  );
}

export default App;
