import React, { useEffect, useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { Container, Button, Table, Modal, Alert } from "react-bootstrap";
import { toast } from "react-toastify";

import t from "../../i18nProvider/translate";
import { AuthContext } from "../../helpers/AuthContext";

import "./EndGame.css";
import ListOfPlayers from "../ListOfPlayers/ListOfPlayers";
import Podium from "../Podium/Podium";
import {
  updateEarnings,
  getUserByUsername,
  updateUserLevel,
  saveQuizStats,
} from "../../services/api";

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
  const [areExpAdded, setAreExpAdded] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const [isHandlingExperienceAndLevel, setIsHandlingExperienceAndLevel] =
    useState(false);

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

    let prevScore = -1;
    let prevRank = -1;
    let prevPoints = -1;

    sortedPlayers.forEach((player, index) => {
      const rank = player.score === prevScore ? prevRank : index + 1;
      const points = totalPlayers - rank;

      if (index === 0) {
        rankPoints[player.username] = points + 6;
      } else if (index === totalPlayers - 1) {
        rankPoints[player.username] = points - 3;
      } else {
        rankPoints[player.username] = points;
      }

      if (player.score !== prevScore) {
        prevScore = player.score;
        prevRank = rank;
        prevPoints = points;
      }
    });

    return rankPoints;
  };

  const rankPoints = calculateRankPoints(); // Přesunuto za definicí funkce
  const playerScore = currentPlayer ? currentPlayer.score : 0;
  const baseEarnings = calculateEarnings(playerScore, isDraw); // Přesunuto za definicí funkce
  const adjustedEarnings = baseEarnings * gameModeMultiplier;

  const saveEarnings = async () => {
    try {
      const playerRankPoints = gameMode === "RankedGame" ? rankPoints[playerName] || 0 : 0;
      if (!areExpAdded && adjustedEarnings > 0) {
        await updateEarnings(
          playerName,
          adjustedEarnings,
          playerRankPoints,
          gameMode
        );
        setAreExpAdded(true);
        toast(`⭐ ${adjustedEarnings} Experience points added successfully!`);
      }
    } catch (error) {
      toast.error("Failed to save experience");
    }
  };

  const checkLevelUp = async () => {
    try {
      const user = await getUserByUsername(playerName);
      const currentExperience = user.experience;
      const currentLevel = user.level;
      const requiredExpForNextLevel = (100 * currentLevel) / 2;
      if (currentExperience >= requiredExpForNextLevel) {
        await updateUserLevel(playerName);
        toast("⬆️ Level up!");
        setLevelUp(true);
        console.log(currentExperience, " z ", requiredExpForNextLevel);
      }
      console.log(currentExperience, " >= ", requiredExpForNextLevel);
    } catch (error) {
      toast.error("Failed to check level up");
    }
  };




  useEffect(() => {
    const handleExperienceAndLevel = async () => {
      setIsHandlingExperienceAndLevel(true);
      await saveEarnings();
      await checkLevelUp();
      // await saveQuizStats(playerName, playerScore, adjustedEarnings, rounds, currentPlayer.time_spent, roomName, socket);
      setIsHandlingExperienceAndLevel(false);
    };
    if (
      authState &&
      authState.username &&
      adjustedEarnings &&
      !areExpAdded &&
      !isHandlingExperienceAndLevel
    ) {
      handleExperienceAndLevel();
    }
  }, [
    authState,
    adjustedEarnings,
    rankPoints,
    areExpAdded,
    isHandlingExperienceAndLevel,
  ]);

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
