import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useHistory, Link } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import {
  PlayCircleFill,
  HeartFill,
  EyeFill,
  Heart,
} from "react-bootstrap-icons";
import { CSSTransition } from "react-transition-group";
import Card from "react-bootstrap/Card";
import axios from "axios";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { AuthContext } from "../helpers/AuthContext";
import t from "../i18nProvider/translate";
import { uuid } from "short-uuid";
import "../assets/styles/Cards/Cards.css";
import FilterBox from "../components/FilterBox/FilterBox";

const img =
  "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__340.jpg";

const Dashboard = ({ userId }) => {
  const MemoizedFilterBox = React.memo(FilterBox);
  const ref = useRef(null);
  const isMounted = useRef(true);

  const IS_PROD = process.env.NODE_ENV === "production";
  const API_URL = IS_PROD
    ? "https://testing-egg.herokuapp.com"
    : "http://localhost:5000";
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [listOfQuizzes, setListOfQuizzes] = useState([]);
  const { authState } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([
    { value: "English", label: "English" },
    { value: "Czech", label: "Czech" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
  ]);

  const [defaultCategories, setDefaultCategories] = useState([]);

  let history = useHistory();
  const [filterValues, setFilterValues] = useState({
    language: "",
    categories: [],
    length: [0, 100],
    date: "",
  });

  const [likedQuizzes, setLikedQuizzes] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    getLikeCounts();
    getLikedQuizzes();
  }, [filteredQuizzes]);

  const getLikedQuizzes = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/likes/user/${authState.id}`,
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
      const likedQuizIds = new Set(
        response.data.likes.map((like) => like.quizId)
      );
      setLikedQuizzes(likedQuizIds);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const getLikeCounts = async () => {
    const likeCountsData = await Promise.all(
      filteredQuizzes.map(async (quiz) => {
        const response = await axios.get(`${API_URL}/likes/count/${quiz.id}`);
        return { quizId: quiz.id, count: response.data.count };
      })
    );

    setLikeCounts(
      likeCountsData.reduce((acc, curr) => {
        acc[curr.quizId] = curr.count;
        return acc;
      }, {})
    );
  };

  const toggleLike = (quizId) => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .post(
        `${API_URL}/likes`,
        { userId: authState.id, quizId },
        {
          headers: { accessToken },
        }
      )
      .then((response) => {
        if (response.data.message === "Unliked") {
          console.log(response.data);
          setLikedQuizzes((prevLikedQuizzes) => {
            const newLikedQuizzes = new Set(prevLikedQuizzes);
            newLikedQuizzes.delete(quizId);
            return newLikedQuizzes;
          });
          // Decrease the like count by 1 for the unliked quiz
          setLikeCounts((prevLikeCounts) => ({
            ...prevLikeCounts,
            [quizId]: prevLikeCounts[quizId] - 1,
          }));
        } else {
          console.log(response.data);
          setLikedQuizzes((prevLikedQuizzes) => {
            const newLikedQuizzes = new Set(prevLikedQuizzes);
            newLikedQuizzes.add(quizId);
            return newLikedQuizzes;
          });
          // Increase the like count by 1 for the liked quiz
          setLikeCounts((prevLikeCounts) => ({
            ...prevLikeCounts,
            [quizId]: prevLikeCounts[quizId] + 1,
          }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (categories && categories.length > 0) {
      const categoryNames = categories.map((c) => c.name);
      setDefaultCategories(categoryNames);
    }
  }, [categories]);

  const createRoomName = useMemo(() => {
    const shortId = uuid().slice(0, 6);
    return (quizTitle, quizId) => `${quizTitle}-${quizId}-${shortId}`;
  }, []);

  const onFilterApply = useCallback(
    (filterValues) => {
      let appliedFilters = filterValues;
      if (filterValues.categories.length === 0) {
        appliedFilters = { ...filterValues, categories: defaultCategories };
      }
      // Filter the quizzes based on the filter values
      const newQuizzes = listOfQuizzes?.filter((quiz) => {
        // Filter by language
        if (filterValues.language && quiz.language !== filterValues.language) {
          return false;
        }
        // Filter by categories
        if (filterValues.categories && filterValues.categories.length > 0) {
          const quizCategories = quiz.Categories.map((c) => c.name);
          if (
            !filterValues.categories.some((c) => quizCategories.includes(c))
          ) {
            return false;
          }
        }

        // Filter by number of questions
        if (filterValues && filterValues.length !== undefined) {
          const [min = 0, max = 100] = filterValues.length;
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
              dateLimit = new Date(
                currentDate.setDate(currentDate.getDate() - 1)
              );
              break;
            case "week":
              dateLimit = new Date(
                currentDate.setDate(currentDate.getDate() - 7)
              );
              break;
            case "month":
              dateLimit = new Date(
                currentDate.setMonth(currentDate.getMonth() - 1)
              );
              break;
            case "year":
              dateLimit = new Date(
                currentDate.setFullYear(currentDate.getFullYear() - 1)
              );
              break;
            case "older":
              dateLimit = new Date(
                currentDate.setFullYear(currentDate.getFullYear() - 1)
              );
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
    },
    [listOfQuizzes, isMounted, defaultCategories]
  );

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
      messageParts.push(`categories: ${categoryNames.join(", ")}`);
    }

    if (length) {
      const [minLength, maxLength] = length;
      if (minLength > 0 || maxLength < 100) {
        const lengthMessage = `${minLength} - ${maxLength} questions`;
        messageParts.push(`length: ${lengthMessage}`);
      }
    }

    if (messageParts.length > 0) {
      return `Applid Filters: ${messageParts.join("; ")}`;
    } else {
      return "";
    }
  };

  const resetFilters = () => {
    setFilteredQuizzes(listOfQuizzes);
    setFilterValues({ language: "", categories: [], length: "" });
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      history.push("/login");
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories/all`, {
          headers: { accessToken },
        });
        setCategories(response.data.categories);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    const fetchQuizzes = async () => {
      try {
        let response;
        if (userId) {
          response = await axios.get(`${API_URL}/quizzes/byuserId/${userId}`, {
            headers: { accessToken },
          });
        } else {
          response = await axios.get(`${API_URL}/quizzes`, {
            headers: { accessToken },
          });
        }
        setListOfQuizzes(response.data.quizzes);
        setFilteredQuizzes(response.data.quizzes);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    const socket = io(API_URL);
    fetchCategories();
    fetchQuizzes();

    return () => {
      isMounted.current = false;
      socket.disconnect();
    };
  }, [userId, history, API_URL]);

  return (
    <div>
      <Row>
        <h2 className="mt-4">{t("customGameTitle")}</h2>

        <Card className="my-4 p-3">
          <div className="d-flex col-12 flex-wrap-reverse justify-content-between align-items-center">
            <Col
              xs={12}
              lg={6}
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <h5 className="mb-0">
                {createFilterMessage()
                  ? createFilterMessage()
                  : t("No filter has been applied.")}
              </h5>
            </Col>
            <Col
              xs={12}
              lg={6}
              className="d-flex flex-column  flex-lg-row justify-content-end z-index-1"
            >
              {createFilterMessage() ? (
                <Button
                  className="m-2"
                  variant="primary"
                  onClick={resetFilters}
                >
                  {" "}
                  {t("Reset Filters")}{" "}
                </Button>
              ) : (
                ""
              )}
              <Button className="m-2" variant="primary" onClick={toggleFilter}>
                {isFilterOpen ? "Close" : "Open"} {t("Filters")}
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
                  {console.log(categories)}
                  <MemoizedFilterBox
                    categories={categories ? categories : []}
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
          <Button className="a-button" href="/createquiz">
            {t("Add Quiz")}
          </Button>
        </div>
        {filteredQuizzes &&
          filteredQuizzes.map((value, key) => {
            return (
              <Col className="card-col" key={key}>
                <Card className="h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="thumb-card">
                      {value.Questions ? value.Questions.length : 0} Questions
                    </div>
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
                        variant={
                          likedQuizzes.has(value.id) ? "danger" : "primary"
                        }
                        onClick={() => toggleLike(value.id)}
                      >
                        {likedQuizzes.has(value.id) ? (
                          <>
                            <HeartFill size={24} />
                            <span className="ml-05">{likeCounts[value.id] || 0}</span>
                          </>
                        ) : (
                          <>
                            <Heart size={24} />
                            <span className="ml-05">{likeCounts[value.id] || 0}</span>
                          </>
                        )}
                      </Button>

                      <Button
                        disabled={value.Questions.length <= 0}
                        onClick={() => {
                          const quizId = value.id;
                          const quizTitle = value.title;
                          const roomName = createRoomName(quizTitle, quizId); // Generate random room name
                          const masterName = authState.username;
                          history.push(
                            `/gamemaster?roomName=${roomName}&masterName=${masterName}&gameMode=CustomGame`
                          );
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
                      {value.title}{" "}
                    </Card.Title>
                    <div className="body">
                      <div className="username">
                        <Link to={`/profile/${value.User.username}`}>
                          {" "}
                          {value.User.username}{" "}
                        </Link>
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
                      <Col lg={6}>
                        {value.updatedAt.slice(0, 19).replace("T", " ")}
                      </Col>
                      <Col lg={6}>{t("unlockedText")}</Col>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
      </Row>
    </div>
  );
};

export default Dashboard;
