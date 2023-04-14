const express = require("express");
const app = express();
const cors = require("cors");

const socketio = require('socket.io');
const http = require('http');
const PORT = 5000;
const path = require('path');

questionDuration = 20;

const server = http.createServer(app);
const io = socketio(server, {
  pingInterval: 10000, // check how often
  pingTimeout: 60000, // until close connection
  cookie: false,
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
});


app.use(express.json());
const whitelist = ['https://testing-egg.herokuapp.com', 'https://testing-egg.herokuapp.com/auth', 'http://localhost:5000/auth', 'http://localhost:3000', 'http://localhost:5000', 'http://localhost:5000', 'http://localhost:5000/auth/auth']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))

const db = require("./models");

// Routers
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);
const categoriesRouter = require("./routes/Categories");
app.use("/categories", categoriesRouter);
const quizzesRouter = require("./routes/Quizzes");
app.use("/quizzes", quizzesRouter);
const questionsRouter = require("./routes/Questions");
app.use("/questions", questionsRouter);

// Serve any static files
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// SOCKET
const uuidv1 = require('uuid/v1');
rooms = [];

// Create new room
io.on('connect', (socket) => {
  console.log('new connection', socket.id);

  socket.emit('newConn', { msg: 'welcome' });

  // Send list of active rooms to client whenever a new room is created or a player joins a room
  const sendActiveRooms = () => {
    const activeRooms = Object.values(rooms).map(room => {
      return { id: room.id, name: room.name, players: Object.values(room.players) }
    });
    console.log(activeRooms);
    io.emit('activeRooms', activeRooms);
  }

  socket.on('showActiveRooms', (sendActiveRooms));

  socket.on('createRoom', ({ roomName, masterName }, callback) => {
    if (rooms[roomName]) {
      return callback({ error: "Room already exists with that name, try another!" });
    };
    const room = {
      id: uuidv1(),
      name: roomName,
      sockets: [],
      players: []
    };
    rooms[roomName] = room;

    joinRoom(socket, room, masterName);

    // Send updated list of active rooms to all clients
    sendActiveRooms();
  });

  // Join existing room
  socket.on('joinRoom', ({ joinRoomName, playerName }, callback) => {
    const room = rooms[joinRoomName];
    if (typeof room === 'undefined') {
      return callback({ error: "No rooms created with that name" });
    };
    if (playerName === '') {
      return callback({ error: "You have to fill out player name" });
    };
    if (room.players[playerName]) {
      return callback({ error: "A player with that name is already in the room" });
    };
    joinRoom(socket, room, playerName);

    // Send updated list of active rooms to all clients
    sendActiveRooms();
  });

  // Join existing room
  const joinRoom = (socket, room, playerName) => {
    socket.join(room.id, () => {
      room.sockets.push(socket);
      socket.roomId = room.id;
      socket.roomName = room.name;
      socket.username = playerName;

      if (room.sockets.length !== 1) {
        const player = { id: socket.id, username: playerName, score: 0 }
        rooms[socket.roomName].players[playerName] = player;
      };

      socket.emit('message', { text: `Welcome ${playerName} to the game in ${room.name}.` });
      socket.broadcast.to(room.id).emit('message', { text: `${playerName} has joined the game!` });

      allPlayersInRoom = Object.values(room.players); // send key/value obj in socket
      io.to(room.id).emit('playerData', allPlayersInRoom); // io, to everyone including sender
    });
  };

  socket.on('ready', (callback) => {
    const room = rooms[socket.roomName]; 
    if (room.sockets.length > 2) {
      for (const client of room.sockets) {
        client.emit('initGame');
        callback({ res: "Game started - Question is being showed to players" });
      }
    } else {
      callback({ res: "Not enough players to start game - needs at least 2 players" });
    }
  });

  socket.on('showQuestion', ({ gameQuestion, gameOptionsArray, gameRound }) => {
    socket.broadcast.to(socket.roomId).emit('currentRound', { question: `${gameQuestion}` }, gameOptionsArray, gameRound);
    const room = rooms[socket.roomName];
    res = Object.values(room.players);
  });

  socket.on('playerChoice', ({ playerName, choice, gameRound }) => {
    const room = rooms[socket.roomName];
    room.sockets[0].emit('playerChoice', playerName, choice, gameRound); // first socket is game master
  });

  socket.on('updateScore', (playerName) => {
    const room = rooms[socket.roomName];
    const remainingTime = room.timeLeft;
    const remainingPercentage = remainingTime  / 20;
    room.players[playerName].score += 1000 + 1000 * remainingPercentage;
    for (const client of res) {
      socket.to(client.id).emit('getRoomPlayers', Object.values(room.players));
    };
    console.log("Points: ", room.players[playerName].score, " Name: ", room.players[playerName].username);
  });

  socket.on('correctAnswer', (correctAnswer, playerName) => {
    const room = rooms[socket.roomName];
    socket.to(room.players[playerName].id).emit('correctAnswer', correctAnswer);
    console.log('correctAnswer', correctAnswer);
  });

  socket.on('endGame', () => {
    const room = rooms[socket.roomName];
    res = Object.values(room.players); // send array with keys that has objects as values
    io.to(room.id).emit('scores', res);
    socket.broadcast.to(socket.roomId).emit('stopTime');

    // send individual score to each client
    for (const client of res) {
      socket.to(client.id).emit('finalPlayerInfo', client);
    };
  });

  socket.on('playerBoard', () => {
    const room = rooms[socket.roomName];
    res = Object.values(room.players); // send array with keys that has objects as values

    // send individual score to each client
    for (const client of res) {
      socket.to(client.id).emit('finalPlayerInfo', client);
    };
  });

  socket.on('startTimer', () => {
    const room = rooms[socket.roomName];
    const players = Object.values(room.players);
    let timeLeft = questionDuration;
    console.log('Start timer', timeLeft);
    const timerInterval = setInterval(() => {
      timeLeft--;
      rooms[socket.roomName].timeLeft--;
      // console.log('Start timer', timeLeft);

      if (timeLeft === 0) {
        clearInterval(timerInterval);
      }

      rooms[socket.roomName].timeLeft = timeLeft;

      for (const player of players) {
        socket.to(player.id).emit('timer', timeLeft, player);
      }
    }, 1000);
  });


  socket.on('disconnect', () => {
    console.log('User left with socket id', socket.id);
    const room = rooms[socket.roomName];
    // if room has been deleted when master leaving the game
    if (typeof room == 'undefined') {
      console.log('Room does not exist, leave the room');
    } else {
      const room = rooms[socket.roomName];
      // if room exists, delete player from players array in that room
      if (room.sockets[0].id !== socket.id) {
        console.log(room.players[socket.username].username, 'has left');
        socket.broadcast.to(socket.roomId).emit('message', { text: `${room.players[socket.username].username} has left the game!` });
        delete room.players[socket.username];

        // update room players array
        allPlayersInRoom = Object.values(room.players);
        io.to(room.id).emit('playerData', allPlayersInRoom);
      } else {
        // delete room if gamemaster left
        const room = rooms[socket.roomName];
        console.log(room.sockets[0].username, 'has left');
        socket.broadcast.to(socket.roomId).emit('message', { text: `The gamemaster ${room.sockets[0].username} has left the game! Please leave the room.` });
        socket.broadcast.to(socket.roomId).emit('stopTime');
        delete rooms[room.name];
      };
    };
  });
});

server.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
