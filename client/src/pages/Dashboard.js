import { useEffect, useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { Image, Row, Col, Button } from 'react-bootstrap';
import { PlayCircleFill, HeartFill, EyeFill } from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';
import axios from "axios";
import io from "socket.io-client";
import { toast } from 'react-toastify';
import { AuthContext } from "../helpers/AuthContext";
import t from "../i18nProvider/translate";
import { uuid } from 'short-uuid';
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


  const createRoomName = (quizTitle) => {
    const uniqueId = uuid();
    const shortId = uuid().slice(0, 6);
    return `${quizTitle}-${shortId}`;
  }

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

      socket.emit("showActiveRooms");
      return () => {
        socket.disconnect();
      }
    }
  }, []);

  return (
    <div>
      <Row>
        <h2>Active Rooms</h2>
        <Col span={8}>
          <Card title="Active Rooms">
            {activeRooms.map((room) => (
              <div className="d-flex">
                <Button className="m-2"
                  onClick={() => {
                    const roomName = room.name;
                    const playerName = authState.username;
                    // socket.emit('joinRoom', { roomName, playerName }, (error) => {
                    //   if (error) {
                    //     console.log(error);
                    //   } else {
                    //     console.log('Joined room successfully!');
                    //   }
                    // });
                    history.push(`/gameplayer?joinRoomName=${roomName}&playerName=${playerName}`);
                  }}
                >
                  <PlayCircleFill size={24} />
                </Button>
                <h3 className="m-2" key={room.id}>{room.name}</h3>
              </div>
            ))}
          </Card>
        </Col>
        <h2>Custom Game</h2>
        {listOfQuizzes.map((value, key) => {
          return (
            <Col className="card-col" key={key}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Img className="cursor-pointer"
                    onClick={() => {
                      history.push(`/quiz/${value.id}`);
                    }}
                    variant="top" src={img} />
                  <div className="card-buttons">
                    <Button
                      onClick={() => {
                        toast.warning(t('featureInDevelopment'));
                      }}
                    >
                      <HeartFill
                        size={24}
                      />
                    </Button>
                    <Button

                      onClick={() => {
                        const quizTitle = value.title;
                        const roomName = createRoomName(quizTitle); // Generate random room name
                        const masterName = value.User.username;
                        history.push(`/gamemaster?roomName=${roomName}&masterName=${masterName}`);
                      }}
                    >
                      <PlayCircleFill
                        size={24}
                      />
                    </Button>
                  </div>
                  <Card.Title className="cursor-pointer"
                    onClick={() => {
                      history.push(`/quiz/${value.id}`);
                    }}
                  >{value.title} </Card.Title>
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
    </div >
  );
}

export default Dashboard;
