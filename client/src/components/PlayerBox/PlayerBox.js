import React, { useContext, useEffect, useState } from "react";
import { Card, Button, ProgressBar, Col, Image, Row } from "react-bootstrap";
import { Progress } from "rsuite";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./PlayerBox.css";
import Achievements from "../Achievements/Achievements";
import Badge from "../Badge/Badge";
import { toast } from "react-toastify";
import { AuthContext } from "../../helpers/AuthContext";

const PlayerBox = ({ name, level, avatar, experience }) => {
  const IS_PROD = process.env.NODE_ENV === "production";
  const API_URL = IS_PROD
    ? "https://testing-egg.herokuapp.com"
    : "http://localhost:5000";

  const history = useHistory();

  const [id, setId] = useState(0);
  const [user, setUser] = useState({});
  const maxExperience = (100 * level) / 2;
  const experiencePercentage = (experience / maxExperience) * 100;
  const { authState } = useContext(AuthContext);
  const [isAuthStateLoaded, setIsAuthStateLoaded] = useState(false);

  useEffect(() => {
    if (authState && authState.username) {
      setIsAuthStateLoaded(true);
    }
  }, [authState]);

  const handleClick = () => {
    history.push(`/profile/${name}`);
  };

  const showExperienceInformation = () => {
    const text = `Do levelu ${level + 1}, vám zbývá ${maxExperience - experience
      } bodů zkušeností`;
    toast.info(text);
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (name && isAuthStateLoaded) {
      axios
        .get(`${API_URL}/auth/user/byusername/${name}`, {
          cancelToken: source.token,
        })
        .then((response) => {
          if (response.data) {
            setId(response.data.id);
            setUser(response.data);
          } else {
            console.log("User not found or no data received");
          }
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
    }
  }, [name, isAuthStateLoaded]);


  return (
    <div className="w-100 mb-4 player-box">
      <div className="player-box-avatar justify-content-between">
        <div className="player-box-avatar-x position-relative">
          <div className="player-box-avatar-content">
            {avatar && (
              <Image
                src={require(`../../assets/images/userAvatars/${avatar}`)}
                alt={avatar}
                width="100px"
              />
            )}
          </div>
          <Progress.Circle
            style={{ width: "105px", height: "100px", top: "5%", zIndex: "1" }}
            percent={experiencePercentage}
            strokeColor="#3FC7FA"
            strokeWidth={6}
            trailColor="#D9D9D9"
            className="position-absolute cursor-pointer progress-cicrle"
            showInfo={false}
            onClick={showExperienceInformation}
          />
          <Badge onClick={showExperienceInformation} level={level} />
        </div>
        <div>
          <h3 className="mb-0 mt-1">{name}</h3>
        </div>
        <div>
          <Button variant="primary" onClick={handleClick}>
            Profile
          </Button>
        </div>
      </div>
      <Achievements preview={true} userId={id} />
    </div>
  );
};

export default PlayerBox;
