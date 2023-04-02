import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Navbar, Container, Nav, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { NavLink } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Signin/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile/Profile";
import ChangePassword from "./pages/ChangePassword";
import Signup from "./pages/Signup/Signup";
import LandingPage from './pages/Home/LandingPage';
import Quiz from './pages/Quiz/Quiz';
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
import './assets/styles/navigation.css';

import { I18nPropvider, LOCALES } from './i18nProvider';
import t from "./i18nProvider/translate";

import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {



  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });



  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      axios
        .get("http://localhost:5000/auth/auth", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          console.log(response);
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
    } else {
      axios
        .get("https://testing-egg.herokuapp.com/auth/auth", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          console.log(response);
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
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    toast.success(t("logout-success"));
  };



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
                      <NavLink className='px-3 navlink' to='/lobby'><span className="align-middle">{t('Play')}</span></NavLink>
                      <NavLink className='px-3 navlink' to='/dashboard'><span className="align-middle">{t('Dashboard')}</span></NavLink>

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
                                  <Dropdown.Item href={`/profile/${authState.id}`}>Profile</Dropdown.Item>
                                  <Dropdown.Item onClick={logout} href="#/action-2">Logout</Dropdown.Item>
                                  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                </DropdownButton>
                                {/* <h1>{authState.username} </h1> */}
                                <Link to={`/profile/${authState.id}`}>  </Link>
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
              <Route path="/dashboard" exact component={Dashboard} />
              <Route path="/lobby" exact component={JoinGame} />
              <Route path="/createpost" exact component={CreatePost} />
              <Route path="/post/:id" exact component={Post} />
              <Route path="/signup" exact component={Signup} />
              <Route path="/login" exact component={Login} />
              <Route path="/profile/:id" exact component={Profile} />
              <Route path="/quiz/:id" exact component={Quiz} />
              <Route path="/changepassword" exact component={ChangePassword} />
              <Route path="/gamemaster" component={GameMaster} />
              <Route path="/gameplayer" component={GamePlayer} />
              <Route path="*" exact component={PageNotFound} />
            </Switch>
          </Router>
          <ToastContainer />
          <Footer />

        </AuthContext.Provider>
      </I18nPropvider>
    </div>
  );
}

export default App;
