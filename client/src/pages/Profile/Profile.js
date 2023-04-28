import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Image, Button, ProgressBar } from "react-bootstrap";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";
import Achievements from "../../components/Achievements/Achievements";
import Card from 'react-bootstrap/Card';
import { PlayCircleFill, HeartFill } from 'react-bootstrap-icons';
import Badge from "../../components/Badge/Badge";

import './Profile.css';

const img = "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__340.jpg";

const initialUserState = {
  id: "",
  avatar: "default-avatar.png",
  username: "",
  email: "",
  experience: 0,
  level: 1,
};

function Profile() {
  const IS_PROD = process.env.NODE_ENV === "production";
  const API_URL = IS_PROD ? "https://testing-egg.herokuapp.com" : "http://localhost:5000";

  const [user, setUser] = useState(initialUserState);
  const { authState } = useContext(AuthContext);
  let { username } = useParams();
  let history = useHistory();
  const [id, setId] = useState("");
  const [listOfQuizzes, setListOfQuizzes] = useState([]);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const source = axios.CancelToken.source();
    axios.get(`${API_URL}/auth/user/byusername/${username}`, { cancelToken: source.token })
      .then((response) => {
        setId(response.data.id);
        console.log(response.data);
        setUser(response.data);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled by cleanup:", error.message);
        } else {
          throw error;
        }
      });
    return () => {
      source.cancel("Request canceled by cleanup");
    };
  }, [username]);

  useEffect(() => {
    const maxExperience = ((100 * user.level) / 2);
    const experiencePercentage = (user.experience / maxExperience) * 100;
    setProgress(experiencePercentage);
  }, [user.experience, user.level]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    axios.get(`${API_URL}/quizzes/byuserId/${id}`, { cancelToken: source.token })
      .then((response) => {
        setListOfQuizzes(response.data.quizzes);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled by cleanup:", error.message);
        } else {
          throw error;
        }
      });
    return () => {
      source.cancel("Request canceled by cleanup");
    };
  }, [id]);


  return (
    <Container>
      <div className="profile-page-container">
        <Row className="justify-content-center">

          <Col lg={6} md={12}>
            <div className="avatarBox">
              {console.log(user.avatar)}
              <Image src={require(`../../assets/images/userAvatars/${user.avatar}`)} alt={user.avatar} width='200px' />
              <div className="d-flex p-3">
              <Badge level={user.level}/>
              <ProgressBar now={progress} label={`${progress} %`}/>
              </div>
              
            </div>
          </Col>
          <Col lg={6} md={12}>

            <div className="infoBox">
              {" "}
              <h1> Username: {username} </h1>
              {authState.username === username && (
                <button className="a-button"
                  onClick={() => {
                    history.push("/changepassword");
                  }}
                >
                  {" "}
                  Change My Password
                </button>
              )}
            </div>
          </Col>
        </Row>

        {authState.username !== username ? (
          <>
            <h2>Quizzes</h2>
          </>
        ) : (
          <>
            <h2>My Quizzes</h2>
            <button className="a-button"
              onClick={() => {
                history.push("/createquiz");
              }}
            >
              Add Quiz
            </button>
          </>
        )}
        <Row>




          {listOfQuizzes && listOfQuizzes.map((value, key) => {
            return (
              <Col className="card-col" key={key}>
                <Card>
                  <Card.Body>
                    <Card.Img variant="top" src={img} />
                    <div className="card-buttons">
                      <Button
                        onClick={() => {
                          history.push(`/quiz/${value.id}`);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => {
                          history.push(`/quiz/${value.id}`);
                        }}
                      >
                        <HeartFill
                          size={24}
                        />
                      </Button>
                      <Button

                        onClick={() => {
                          history.push(`/gamemaster?roomName=${value.title}&masterName=${value.User.username}`);
                        }}
                      >
                        <PlayCircleFill
                          size={24}
                        />
                      </Button>
                    </div>
                    <Card.Title>{value.title} </Card.Title>
                    <div className="body">
                      <div className="username">
                        <Link to={`/profile/${value.userId}`}> {value.User.username} </Link>
                      </div>
                      <div
                        className="quizDesc"
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
                    <div className="footer">
                      <Col lg={6}>
                        {value.updatedAt.slice(0, 19).replace('T', ' ')}
                      </Col>
                      <Col lg={6}>
                        Unlocked
                      </Col>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
        <Row>
          <Achievements preview={false} userId={id} />
        </Row>
      </div>

    </Container >
  );
}

export default Profile;
