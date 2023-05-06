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

export const getUserByUsername = async (playerName, cancelToken) => {
  const response = await axios.get(
    `${API_URL}/auth/user/byusername/${playerName}`,
    { cancelToken: cancelToken }
  );
  console.log(response);

  if (response.status === 200) {
    return response;
  } else {
    return null;
  }
};

export const checkUserExists = (newName) => {
  return axios.get(`${API_URL}/auth/user/byusername/${newName}`);
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

export const getQuizzesByUserId = (id, cancelToken) => {
  return axios.get(`${API_URL}/quizzes/byuserId/${id}`, {
    cancelToken: cancelToken.token,
  });
};

export const changeUserName = (newName, accessToken) => {
  return axios.put(
    `${API_URL}/auth/changename`,
    { newUsername: newName },
    { headers: { accessToken: accessToken } }
  );
};

export const updateUserDescription = async (
  userId,
  newDescription,
  accessToken
) => {
  const response = await axios.put(
    `${API_URL}/auth/user/byuserId/${userId}/description`,
    { description: newDescription },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  return response.data;
};
