import io from 'socket.io-client';

const IS_PROD = process.env.NODE_ENV === "development";
const API_URL = IS_PROD ? "http://localhost:5000" : "https://testing-egg.herokuapp.com";
const socket = io(API_URL);

socket.on("connect", (socket) => {
    console.log("Connected to Socket.IO server");
    console.log(socket);
});

console.log(socket);

export default socket;
