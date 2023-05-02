import React, { useEffect, useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { Container, Button, Table, Modal, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

import t from "../../i18nProvider/translate";
import { AuthContext } from "../../helpers/AuthContext";

import "./EndGame.css";
import ListOfPlayers from "../ListOfPlayers/ListOfPlayers";
import Podium from "../Podium/Podium";

const EndGame = ({
  socket,
  players,
  playerName,
  position,
  rounds,
  earnings,
  gameMode,
  roomName,
}) => {
  const { authState } = useContext(AuthContext);
  const IS_PROD = process.env.NODE_ENV === "production";
  const API_URL = IS_PROD
    ? "https://testing-egg.herokuapp.com"
    : "http://localhost:5000";
  const [areExpAdded, setAreExpAdded] = useState(false);
  const [levelUp, setLevelUp] = useState(false);

  const currentPlayer = players.find(
    (player) => player.username === playerName
  );

  const playerScore = currentPlayer ? currentPlayer.score : 0;

  const gameModeMultiplier = gameMode === "RankedGame" ? 2 : players.length === 1 ? 0 : 1;
  const adjustedEarnings = earnings * gameModeMultiplier;

  const saveExperience = async () => {
    try {
      if (!areExpAdded && adjustedEarnings > 0) {
        await axios.post(`${API_URL}/auth/update/experience`, {
          username: playerName,
          experience: adjustedEarnings,
          gameMode: gameMode,
        });
        setAreExpAdded(true);
        toast(`⭐ ${adjustedEarnings} Experience points added successfully!`);
      }
    } catch (error) {
      toast.error("Failed to save experience");
    }
  };

  const checkLevelUp = async () => {
    try {
      const user = await axios.get(
        `${API_URL}/auth/user/byusername/${playerName}`
      );
      const currentExperience = user.data.experience;
      const currentLevel = user.data.level;
      const requiredExpForNextLevel = (100 * currentLevel) / 2;
      if (currentExperience >= requiredExpForNextLevel) {
        await axios.post(`${API_URL}/auth/update/level`, {
          username: playerName,
        });
        toast("⬆️ Level up!");
        setLevelUp(true);
        console.log(currentExperience, " z ", requiredExpForNextLevel);
      }
      console.log(currentExperience, " >= ", requiredExpForNextLevel);
    } catch (error) {
      console.error("Failed to check level up:", error);
      toast.error("Failed to check level up");
    }
  };

  const saveQuizStats = async () => {
    const userIdResponse = await axios.get(
      `${API_URL}/auth/user/byusername/${playerName}`
    );
    const userId = userIdResponse.data.id;
    console.log("userId: ", userId, "room", socket);
    try {
      // await axios.post(`${API_URL}/stats/saveStats`, {
      //     userId: userId,
      //     quizId: socket.rooms[roomName].quizId,
      //     score: playerScore,
      //     experience: adjustedEarnings,
      //     questions: rounds,
      //     rank: 0,
      //     timeSpend: currentPlayer.time_spent,
      // });
      // console.log('Quiz stats saved successfully!');
    } catch (error) {
      console.error("Failed to save quiz stats:", error);
      toast.error("Failed to save quiz stats");
    }
  };

  useEffect(() => {
    const handleExperienceAndLevel = async () => {
      await saveExperience();
      await checkLevelUp();
      await saveQuizStats();
    };
    if (authState && authState.username) handleExperienceAndLevel();
  }, [adjustedEarnings]);

  return (
    <Container>
      {authState && authState.username && (
        <>
          {levelUp && (
            <Alert variant="success">
              {t("Gratulujeme! Dosáhl jste nové úrovně!")}
            </Alert>
          )}
          {earnings > 0 && (
            <Alert variant="success">
              {t("You got")}: {adjustedEarnings} {t("experience points")} ⭐
            </Alert>
          )}
        </>
      )}

      <div>
        <h2>{t("The game has ended")}!</h2>
        <h3>
          {t("Your position")}: {position}
        </h3>
        <h4>
          {t("Your score")}: {playerScore}
        </h4>
        <Podium winners={players}></Podium>
        <div className="score-container">
          <h3>{t("Game scores")}</h3>
          <ListOfPlayers playersInRoom={players} />
        </div>
        <Link to="/customgame">
          <Button>{t("Leave room")}</Button>
        </Link>
      </div>
    </Container>
  );
};

export default EndGame;
