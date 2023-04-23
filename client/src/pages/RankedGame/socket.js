import io from 'socket.io-client';

const IS_PROD = process.env.NODE_ENV === "production";
const API_URL = IS_PROD ? "https://testing-egg.herokuapp.com" : "http://localhost:5000";
const socket = io(API_URL);

socket.on("connect", (socket) => {
    console.log("Connected to Socket.IO server");
    console.log(socket);
});

console.log(socket);

export default socket;
