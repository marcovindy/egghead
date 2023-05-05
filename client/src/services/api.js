// services/api.js
import axios from "axios";

const IS_PROD = process.env.NODE_ENV === "production";
const API_URL = IS_PROD
  ? "https://testing-egg.herokuapp.com"
  : "http://localhost:5000";

export const updateEarnings = async (playerName, adjustedEarnings, playerRankPoints, gameMode) => {
  await axios.post(`${API_URL}/auth/update/earnings`, {
    username: playerName,
    experience: adjustedEarnings,
    rank: playerRankPoints,
    gameMode: gameMode,
  });
};

export const getUserByUsername = async (playerName) => {
  const response = await axios.get(`${API_URL}/auth/user/byusername/${playerName}`);
  return response.data;
};

export const updateUserLevel = async (playerName) => {
  await axios.post(`${API_URL}/auth/update/level`, {
    username: playerName,
  });
};

export const saveQuizStats = async (playerName, playerScore, adjustedEarnings, rounds, timeSpend, roomName, socket) => {
  const user = await getUserByUsername(playerName);
  const userId = user.id;
  // await axios.post(`${API_URL}/stats/saveStats`, {
  //   userId: userId,
  //   quizId: socket.rooms[roomName].quizId,
  //   score: playerScore,
  //   experience: adjustedEarnings,
  //   questions: rounds,
  //   rank: 0,
  //   timeSpend: timeSpend,
  // });
};
