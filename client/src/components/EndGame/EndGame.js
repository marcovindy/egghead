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

  const gameModeMultiplier = gameMode === "RankedGame" ? 2 : 1;
  const totalPlayers = players.length;
  const isDraw = new Set(players.map((player) => player.score)).size === 1;

  const calculateEarnings = (playerScore, isDraw) => {
    if (playerScore === 0) {
      return (rounds / position) * 0.5;
    }
    if (isDraw) {
      return rounds / totalPlayers;
    }
    return rounds / position;
  };

  const calculateRankPoints = () => {
    const rankPoints = {};
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    sortedPlayers.forEach((player, index) => {
      const rank = index + 1;
      const points = totalPlayers - rank;

      if (index === 0) {
        rankPoints[player.username] = points + 6;
      } else if (index === totalPlayers - 1) {
        rankPoints[player.username] = points - 3;
      } else {
        rankPoints[player.username] = points;
      }
    });

    return rankPoints;
  };

  const rankPoints = calculateRankPoints();

  const playerScore = currentPlayer ? currentPlayer.score : 0;
  const baseEarnings = calculateEarnings(playerScore, isDraw);
  const adjustedEarnings = baseEarnings * gameModeMultiplier;

  const saveExperience = async () => {
    try {
      const playerRankPoints = rankPoints[playerName] || 0;
      if (!areExpAdded && adjustedEarnings > 0) {
        await axios.post(`${API_URL}/auth/update/earnings`, {
          username: playerName,
          experience: adjustedEarnings,
          rank: playerRankPoints,
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
    authState &&
      authState.username &&
      adjustedEarnings &&
      handleExperienceAndLevel();
  }, [adjustedEarnings, rankPoints]);

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
