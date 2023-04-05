import io from "socket.io-client";
import { useEffect, useState, useContext } from "react";
import Card from 'react-bootstrap/Card';
import { Image, Row, Col, Button } from 'react-bootstrap';
import { PlayCircleFill, HeartFill, EyeFill } from 'react-bootstrap-icons';
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import '../assets/styles/Cards/Cards.css';

const img = "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__340.jpg";

const Dashboard = () => {
  const IS_PROD = process.env.NODE_ENV === "development";
  const URL = IS_PROD ? "http://localhost:5000" : "https://testing-egg.herokuapp.com";

  const [activeRooms, setActiveRooms] = useState([]);
  const [listOfQuizzes, setListOfQuizzes] = useState([]);
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  let history = useHistory();




  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    } else {

      axios
        .get(`${URL}/quizzes`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfQuizzes(response.data.quizzes);
        })
        .catch((error) => {
          console.log('Error:', error);
        });


      const socket = io(URL);
      socket.on("activeRooms", (rooms) => {
        setActiveRooms(rooms);
      });

    }
  }, []);

  return (
    <div>
      <Row>
        <h2>Active Rooms</h2>
        <Col span={8}>
          <Card title="Active Rooms">
            {activeRooms.map((room) => (
              <p key={room.id}>{room.name}</p>
            ))}
          </Card>
        </Col>
        <h2>Custom Game</h2>
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
                      <EyeFill
                        size={24}
                      />
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
                      <Link to={`/profile/${value.User.username}`}> {value.User.username} </Link>
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
  );
}

export default Dashboard;
