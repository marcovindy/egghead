// services/api.js
import axios from "axios";

const IS_PROD = process.env.NODE_ENV === "production";
const API_URL = IS_PROD
  ? "https://testing-egg.herokuapp.com"
  : "http://localhost:5000";

export const updateEarnings = async (
  playerName,
  adjustedEarnings,
  playerRankPoints,
  gameMode
) => {
  await axios.post(`${API_URL}/auth/update/earnings`, {
    username: playerName,
    experience: adjustedEarnings,
    rank: playerRankPoints,
    gameMode: gameMode,
  });
};

export const getUserByUsername = async (playerName) => {
  const response = await axios.get(
    `${API_URL}/auth/user/byusername/${playerName}`
  );
  return response.data;
};

export const updateUserLevel = async (playerName) => {
  await axios.post(`${API_URL}/auth/update/level`, {
    username: playerName,
  });
};

export const updateQuizDescription = async (quizId, newDescription) => {
  await axios.put(
    `${API_URL}/quizzes/byquizId/${quizId}/description`,
    {
      description: newDescription,
    },
    { headers: { accessToken: localStorage.getItem("accessToken") } }
  );
};
