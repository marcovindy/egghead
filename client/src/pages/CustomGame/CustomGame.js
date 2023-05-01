import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {  Row, Col, Button } from 'react-bootstrap';
import { PlayCircleFill } from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';
import io from "socket.io-client";
import { AuthContext } from "../../helpers/AuthContext";
import t from "../../i18nProvider/translate";
import '../../assets/styles/Cards/Cards.css';
import Dashboard from "../Dashboard";


const img = "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__340.jpg";

const CustomGame = () => {
  const IS_PROD = process.env.NODE_ENV === "production";
  const API_URL = IS_PROD ? "https://testing-egg.herokuapp.com" : "http://localhost:5000";
  const [activeRooms, setActiveRooms] = useState([]);
  const { authState } = useContext(AuthContext);
  const [isMounted, setIsMounted] = useState(true);


  let history = useHistory();
  
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      history.push("/login");
      return;
    }

    const socket = io(API_URL);

    socket.on("activeRooms", (rooms) => {
      setActiveRooms(rooms);
    });

    socket.emit("showActiveRooms");

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
      <Dashboard/>
    </div >
  );
}

export default CustomGame;