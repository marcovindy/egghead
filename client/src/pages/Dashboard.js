import React, { useEffect, useState, useContext, useMemo, useRef } from "react";
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

  const IS_PROD = process.env.NODE_ENV === "development";
  const API_URL = IS_PROD ? "http://localhost:5000" : "https://testing-egg.herokuapp.com";
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


  let history = useHistory();
  const [filterValues, setFilterValues] = useState({
    language: '',
    categories: [],
    length: '',
  });

  const createRoomName = useMemo(() => {
    const uniqueId = uuid();
    const shortId = uuid().slice(0, 6);
    return (quizTitle) => `${quizTitle}-${shortId}`;
  }, []);

  const onFilterApply = (filterValues) => {
    if (filterValues.categories.length === 0) {
      const categoryNames = categories.map((c) => c.name);
      setFilterValues({ ...filterValues, categories: categoryNames });
    } else {
      setFilterValues(filterValues);
    }

    // Filter the quizzes based on the filter values
    const newQuizzes = listOfQuizzes.filter((quiz) => {
      // Filter by language
      if (filterValues.language && quiz.language !== filterValues.language.value) {
        return false;
      }

      // Filter by categories
      if (filterValues.categories.length > 0) {
        const quizCategories = quiz.Categories.map((c) => c.name);
        if (!filterValues.categories.some((c) => quizCategories.includes(c))) {
          return false;
        }
      }

      // // Filter by length
      // if (filterValues.length && quiz.questions.length !== filterValues.length.value) {
      //   return false;
      // }

      return true;
    });

    setFilteredQuizzes(newQuizzes);
  };

  const createFilterMessage = () => {
    const { language, categories, length } = filterValues;
    const messageParts = [];

    if (language) {
      // console.log(language);
      messageParts.push(`language: ${language}`);
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

  // useEffect(() => {
  //   console.log("Applying filter Final: ", filterValues);
  // }, [filterValues]);

  // useEffect(() => {
  //   useDebugValue(filteredQuizzes);
  //   useDebugValue(listOfQuizzes);

  // }, [filteredQuizzes, listOfQuizzes]);

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
        console.log("categories response.data: ", response.data.listOfCategories);
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
      setActiveRooms(rooms);
    });

    socket.emit("showActiveRooms");

    fetchCategories();
    fetchQuizzes();

    return () => {
      socket.disconnect();
    };
  }, []);



  return (
    <div>
      <Row>
        <h2>{t('activeRoomsTitle')}</h2>
        <Col span={8}>
          <Card title={t('activeRoomsTitle')}>
            {activeRooms.length > 0 ? (
              activeRooms.map((room, index) => (
                <div key={index} className="d-flex">
                  <Button
                    className="m-2"
                    onClick={() => {
                      const roomName = room.name;
                      const playerName = authState.username;
                      history.push(`/gameplayer?joinRoomName=${roomName}&playerName=${playerName}`);
                    }}
                  >
                    <PlayCircleFill size={24} />
                  </Button>
                  <h3 className="m-2" key={room.id}>
                    {room.name}
                  </h3>
                </div>
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
                {isFilterOpen ? 'Close' : 'Open'} Filters
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
          <Button className="a-button" href="/createquiz">Create Quiz</Button>
        </div>
        {filteredQuizzes.map((value, key) => {
          return (
            <Col className="card-col" key={key}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
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
                      onClick={() => {
                        const quizTitle = value.title;
                        const roomName = createRoomName(quizTitle); // Generate random room name
                        const masterName = value.User.username;
                        history.push(`/gamemaster?roomName=${roomName}&masterName=${masterName}`);
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