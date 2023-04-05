import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";

import Card from 'react-bootstrap/Card';
import { PlayCircleFill, HeartFill } from 'react-bootstrap-icons';

import imgUrl from "../../assets/images/egg2.png";

const img = "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__340.jpg";

function Profile() {
  const IS_PROD = process.env.NODE_ENV === "development";
  const URL1 = IS_PROD ? "http://localhost:5000/auth/basicinfo/" : "https://testing-egg.herokuapp.com/auth/basicinfo/";
  const URL2 = IS_PROD ? "http://localhost:5000/posts/byuserId/" : "https://testing-egg.herokuapp.com/posts/byuserId/";
  const URL3 = IS_PROD ? "http://localhost:5000/quizzes/byuserId/" : "https://testing-egg.herokuapp.com/quizzes/byuserId/";

  let { id } = useParams();
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [listOfQuizzes, setListOfQuizzes] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`${URL1}${id}`).then((response) => {
      setUsername(response.data.username);
    });

    axios.get(`${URL2}${id}`).then((response) => {
      setListOfPosts(response.data);
    });

    axios.get(`${URL3}${id}`).then((response) => {
      setListOfQuizzes(response.data.quizzes);
    });
  }, []);

  return (
    <Container>
      <div className="profilePageContainer">
        <Row className="justify-content-center">

          <Col>
            <div className="avatarBox">
              <Image width='300px' src={imgUrl}></Image>
            </div>
          </Col>
          <Col>

            <div className="infoBox">
              {" "}
              <h1> Username: {username} </h1>
              {authState.username === username && (
                <button
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
          <h2>My Quizzes</h2>
          <button className="a-button"
                  onClick={() => {
                    history.push("/createquiz");
                  }}
                >
                  {" "}
                  Add Quiz
                </button>
        <Row>
    
          
       

          {listOfQuizzes.map((value, key) => {
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
      </div>

    </Container >
  );
}

export default Profile;
