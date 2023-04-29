import React, { useEffect, useState, useContext, useMemo, useRef, useCallback } from "react";
import { useHistory, Link } from "react-router-dom";
import { Image, Row, Col, Button } from 'react-bootstrap';
import { PlayCircleFill, HeartFill, EyeFill } from 'react-bootstrap-icons';
import { CSSTransition } from 'react-transition-group';
import Card from 'react-bootstrap/Card';
import axios from "axios";
import io from "socket.io-client";
import { toast } from 'react-toastify';
import { AuthContext } from "../helpers/AuthContext";
import t from "../i18nProvider/translate";
import { uuid } from 'short-uuid';
import '../assets/styles/Cards/Cards.css';
import FilterBox from '../components/FilterBox/FilterBox';


const img = "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__340.jpg";

const Dashboard = () => {
  const MemoizedFilterBox = React.memo(FilterBox);
  const ref = useRef(null);

  const IS_PROD = process.env.NODE_ENV === "production";
  const API_URL = IS_PROD ? "https://testing-egg.herokuapp.com" : "http://localhost:5000";
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [activeRooms, setActiveRooms] = useState([]);
  const [listOfQuizzes, setListOfQuizzes] = useState([]);
  const { authState } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [languageOptions, setLanguageOptions] = useState(
    [{ value: 'English', label: 'English' },
    { value: 'Czech', label: 'Czech' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    ]
  );
  const [isMounted, setIsMounted] = useState(true);


  let history = useHistory();
  const [filterValues, setFilterValues] = useState({
    language: '',
    categories: [],
    length: '',
  });

  const createRoomName = useMemo(() => {
    const shortId = uuid().slice(0, 6);
    return (quizTitle, quizId) => `${quizTitle}-${quizId}-${shortId}`;
  }, []);

  const onFilterApply = useCallback((filterValues) => {
    if (filterValues.categories.length === 0) {
      const categoryNames = categories.map((c) => c.name);
      setFilterValues({ ...filterValues, categories: categoryNames });
    } else {
      setFilterValues(filterValues);
    }

    // Filter the quizzes based on the filter values
    const newQuizzes = listOfQuizzes.filter((quiz) => {
      // Filter by language
      if (filterValues.language && quiz.language !== filterValues.language) {
        return false;
      }
      // Filter by categories
      if (filterValues.categories.length > 0) {
        const quizCategories = quiz.Categories.map((c) => c.name);
        if (!filterValues.categories.some((c) => quizCategories.includes(c))) {
          return false;
        }
      }
      // Filter by number of questions
      if (filterValues.length) {
        const [min, max] = filterValues.length;
        if (quiz.Questions.length < min || quiz.Questions.length > max) {
          return false;
        }
      }

      // Filter by date
      if (filterValues.date) {
        const quizDate = new Date(quiz.createdAt);
        const currentDate = new Date();
        let dateLimit;

        switch (filterValues.date) {
          case "day":
            dateLimit = new Date(currentDate.setDate(currentDate.getDate() - 1));
            break;
          case "week":
            dateLimit = new Date(currentDate.setDate(currentDate.getDate() - 7));
            break;
          case "month":
            dateLimit = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
            break;
          case "year":
            dateLimit = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
            break;
          case "older":
            dateLimit = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
            if (quizDate > dateLimit) {
              return false;
            }
            break;
          default:
            break;
        }

        if (filterValues.date !== "older" && quizDate < dateLimit) {
          return false;
        }
      }


      return true;
    });
    if (isMounted) {
      setFilteredQuizzes(newQuizzes);
    }
  }, [listOfQuizzes, isMounted]);

  useEffect(() => {
    onFilterApply(filterValues);
  }, [filterValues, onFilterApply]);
  

  const createFilterMessage = () => {
    const { language, categories, length, date } = filterValues;
    const messageParts = [];

    if (language) {
      messageParts.push(`language: ${language}`);
    }

    if (date) {
      messageParts.push(`date: ${date}`);
    }

    if (categories && categories.length > 0) {
      const categoryNames = categories.map((category) => category);
      messageParts.push(`categories: ${categoryNames.join(', ')}`);
    }


    if (length) {
      const [minLength, maxLength] = length;
      if (minLength > 0 || maxLength < 100) {
        const lengthMessage = `${minLength} - ${maxLength} questions`;
        messageParts.push(`length: ${lengthMessage}`);
      }
    }

    if (messageParts.length > 0) {
      return `Applid Filters: ${messageParts.join('; ')}`;
    } else {
      return '';
    }
  };

  const resetFilters = () => {
    setFilteredQuizzes(listOfQuizzes);
    setFilterValues({ language: '', categories: [], length: '' });
  };


  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      history.push("/login");
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`, {
          headers: { accessToken },
        });
        setCategories(response.data.listOfCategories);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${API_URL}/quizzes`, {
          headers: { accessToken },
        });
        setListOfQuizzes(response.data.quizzes);
        setFilteredQuizzes(response.data.quizzes);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    const socket = io(API_URL);

    socket.on("activeRooms", (rooms) => {
      console.log('activeRooms', rooms);
      setActiveRooms(rooms);
    });

    socket.emit("showActiveRooms");

    fetchQuizzes();
    fetchCategories();

    return () => {
      setIsMounted(false);
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <Row>
        <h2>{t('activeRoomsTitle')}</h2>
        <Col span={8} className="card-col">
          <Card title={t('activeRoomsTitle')}>
            {activeRooms.length > 0 ? (
              activeRooms.map((room, index) => (
                room.round === 0 ? (


                  <div key={index} className="d-flex justify-content-between">
                    <Button
                      className="m-2"
                      onClick={() => {
                        const roomName = room.name;
                        const playerName = authState.username;

                        history.push(`/gameplayer?joinRoomName=${roomName}&playerName=${playerName}&gameMode=CustomGame`);
                      }}
                    >
                      <PlayCircleFill size={24} />
                    </Button>
                    <h3 className="m-2" key={room.id}>
                      {room.name}
                    </h3>
                    <ul>
                      {room.categories && room.categories.map((category, index) => (
                        <li key={index} className="d-flex flex-column justify-content-center">
                          <span>
                            {category.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  ""
                )

              ))
            ) : (
              <div className="text-center p-5">
                <h5>{t('noActiveRooms')}</h5>
              </div>
            )}
          </Card>
        </Col>
      </Row>
      <Row>

        <h2 className="mt-4">{t('customGameTitle')}</h2>

        <Card className="my-4 p-3">
          <div className="d-flex col-12 flex-wrap-reverse justify-content-between align-items-center">
            <Col xs={12} lg={6} className="d-flex flex-column justify-content-center align-items-center">
              <h5 className="mb-0">
                {createFilterMessage() ? (
                  createFilterMessage()
                ) : (
                  t("No filter has been applied.")
                )}
              </h5>
            </Col>
            <Col xs={12} lg={6} className="d-flex flex-column  flex-lg-row justify-content-end z-index-1">
              {createFilterMessage() ? (
                <Button className="m-2" variant="primary" onClick={resetFilters}> {t('Reset Filters')} </Button>
              ) : (
                ""
              )}
              <Button className="m-2" variant="primary" onClick={toggleFilter}>
                {isFilterOpen ? 'Close' : 'Open'} {t('Filters')}
              </Button>
            </Col>
          </div>
          <Col xs={12}>
            <CSSTransition
              in={isFilterOpen}
              timeout={300}
              classNames="filter-box"
              unmountOnExit
              nodeRef={ref}
            >
              {(status) => (
                <div ref={ref} className={`transition ${status}`}>
                  <MemoizedFilterBox
                    categories={categories}
                    languageOptions={languageOptions}
                    filterValues={filterValues}
                    onFilterApply={onFilterApply}
                  />
                </div>
              )}

            </CSSTransition>
          </Col>
        </Card>
        <div className="d-flex justify-content-center">
          <Button className="a-button" href="/createquiz">{t('Add Quiz')}</Button>
        </div>
        {filteredQuizzes.map((value, key) => {
          return (
            <Col className="card-col" key={key}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="thumb-card">{value.Questions.length} Questions</div>
                  <Card.Img
                    className="cursor-pointer"
                    onClick={() => {
                      history.push(`/quiz/${value.id}`);
                    }}
                    variant="top"
                    src={img}
                  />
                  <div className="card-buttons">
                    <Button
                      onClick={() => {
                        toast.warning(t('featureInDevelopment'));
                      }}
                    >
                      <HeartFill size={24} />
                    </Button>
                    <Button
                      disabled={value.Questions.length <= 0}
                      onClick={() => {
                        const quizId = value.id;
                        const quizTitle = value.title;
                        const roomName = createRoomName(quizTitle, quizId); // Generate random room name
                        const masterName = authState.username;
                        history.push(`/gamemaster?roomName=${roomName}&masterName=${masterName}&gameMode=CustomGame`);
                      }}
                    >
                      <PlayCircleFill size={24} />
                    </Button>
                  </div>
                  <Card.Title
                    className="cursor-pointer"
                    onClick={() => {
                      history.push(`/quiz/${value.id}`);
                    }}
                  >
                    {value.title}{' '}
                  </Card.Title>
                  <div className="body">
                    <div className="username">
                      <Link to={`/profile/${value.User.username}`}> {value.User.username} </Link>
                    </div>
                    <div
                      className="quizDesc cursor-pointer"
                      onClick={() => {
                        history.push(`/quiz/${value.id}`);
                      }}
                    >
                      {value.description}
                    </div>
                    <ul>
                      {value.Categories.map((category) => (
                        <li key={category.id}>{category.name}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="footer mt-auto">
                    <Col lg={6}>{value.updatedAt.slice(0, 19).replace('T', ' ')}</Col>
                    <Col lg={6}>{t('unlockedText')}</Col>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div >
  );
}

export default Dashboard;