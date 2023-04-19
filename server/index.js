const express = require('express');
const app = express();
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const uuidv1 = require('uuid/v1');

questionDuration = 10;

const PORT = process.env.PORT || 5000;

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
const rooms = [];

function joinRoom(socket, room, playerName) {
  socket.join(room.id, () => {
    room.sockets.push(socket);
    socket.roomId = room.id;
    socket.roomName = room.name;
    socket.username = playerName;

    if (room.sockets.length !== 1) {
      const player = { id: socket.id, username: playerName, score: 0 };
      room.players[playerName] = player;
    }

    socket.emit('message', { text: `Welcome ${playerName} to the game in ${room.name}.` });
    socket.broadcast.to(room.id).emit('message', { text: `${playerName} has joined the game!` });

    const allPlayersInRoom = Object.values(room.players);
    io.to(room.id).emit('playerData', allPlayersInRoom);

    // Update activeRooms list
    sendActiveRoomsToAll();
  });
}
// Funkce pro odeslání seznamu aktivních místností
const sendActiveRoomsToAll = () => {
  console.log('rooms', Object.values(rooms))
  const activeRooms = Object.values(rooms).map(({ id, name, players, categories, round }) => ({
    id,
    name,
    players: Object.values(players),
    categories: categories || [], // sets categories to an empty array if it's undefined
    round: round || 0,
  }));
   io.emit('activeRooms', activeRooms);
};

const createNewRoom = (roomName, masterName, socket) => {
  if (rooms[roomName]) {
    return socket.emit('createRoomError', { message: 'Error: Room already exists with that name, try another!' });
  }

  const room = {
    id: uuidv1(),
    name: roomName,
    sockets: [],
    players: {}
  };

  rooms[roomName] = room;

  joinRoom(socket, room, masterName);

  // Update activeRooms list
  sendActiveRoomsToAll();
};

const nextQuestion = (socket, round, questions) => {
  const room = rooms[socket.roomName];
  console.log("round: ", round);
  const gameQuestion = room.questions[round - 1].question;
  const answers = room.questions[round - 1].answers;
  const correctAnswer = answers.find(answer => answer.isCorrect).text;
  const incorrectAnswers = answers.filter(answer => !answer.isCorrect);
  const gameOptionsArray = [
    ...incorrectAnswers.map(answer => answer.text)
  ];
  const randomNumber = Math.random() * 3;
  const position = Math.floor(randomNumber) + 1;
  gameOptionsArray.splice(position - 1, 0, correctAnswer);
  const gameRound = round;
  // socket.emit('showQuestion', { gameQuestion, gameOptionsArray, gameRound, correctAnswer });
  socket.broadcast.to(socket.roomId).emit('currentRound', { question: `${gameQuestion}` }, gameOptionsArray, gameRound, correctAnswer);
  console.log(gameQuestion, gameOptionsArray, gameRound, correctAnswer);
     // Update activeRooms list
     sendActiveRoomsToAll();
};

const startTimerTest = (socket) => {
  const room = rooms[socket.roomName];
  const players = Object.values(room.players);
  const questions = room.questions;
  var timeLeftTest = questionDuration;
  console.log(timeLeftTest);

  const timerInterval = setInterval(() => {
    res = Object.values(room.players);
    timeLeftTest--;
    room.timeLeft = timeLeftTest;
    for (const player of players) {
      socket.to(player.id).emit('timerTick', timeLeftTest, questionDuration, player);
    }
    if (timeLeftTest === 0) {
      clearInterval(timerInterval);

      if (room.round < 3) {
        room.round++;
        const round = room.round;
        timeLeftTest = questionDuration;
        nextQuestion(socket, round, questions);
        startTimerTest(socket);
      } else {
        console.log("Game Ended! (Timer)")
      }
    }
  }, 1000);
}

const updateScore = (socket, playerName) => {
  const room = rooms[socket.roomName];
  const remainingTime = room.timeLeft;
  const remainingPercentage = remainingTime / 20;
  room.players[playerName].score += 1000 + 1000 * remainingPercentage;
  res = Object.values(room.players);
  console.log("res: ", res);
  socket.emit('getRoomPlayers', res);
  for (const client of res) {
    socket.to(client.id).emit('getRoomPlayers', res);
  };
  console.log("Points: ", room.players[playerName].score, " Name: ", room.players[playerName].username);
}

// Create new room
io.on('connect', (socket) => {
  console.log('new connection', socket.id);

  socket.emit('newConn', { msg: 'welcome' });

  socket.on('showActiveRooms', (sendActiveRoomsToAll));

  socket.on('createRoom', ({ roomName, masterName }, callback) => {
    createNewRoom(roomName, masterName, socket);
  });

  // Join existing room
  socket.on('joinRoom', ({ joinRoomName, playerName }, callback) => {
    const room = rooms[joinRoomName];
    if (!room) {
      return callback({ error: "No rooms created with that name" });
    };
    if (!playerName) {
      return callback({ error: "You have to fill out player name" });
    };
    if (room.players[playerName]) {
      return callback({ error: "A player with that name is already in the room" });
    };
    joinRoom(socket, room, playerName);

    // Send updated list of active rooms to all clients
    sendActiveRoomsToAll();
  });

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

  // socket.on('showQuestion', ({ gameQuestion, gameOptionsArray, gameRound }) => {
  //   socket.broadcast.to(socket.roomId).emit('currentRound', { question: `${gameQuestion}` }, gameOptionsArray, gameRound);
  // });

  socket.on('sendQuizInfo', (quizInfo) => {
    const room = rooms[socket.roomName];
    if (quizInfo && quizInfo.Categories) {
      const categories = quizInfo.Categories.map((category) => {
        return {
          id: category.id,
          name: category.name,
        };
      });
      room.categories = categories;
    }
    // Update activeRooms list
    sendActiveRoomsToAll();
  });

  socket.on('sendQuestionsToServerTest', (questions) => {
    const room = rooms[socket.roomName];
    const round = 0;
    room.questions = questions;
    room.round = round;

    // Update activeRooms list
    sendActiveRoomsToAll();
  });

  socket.on('startTimerTest', () => {
    startTimerTest(socket);
    console.log("startTimerTest");
  });

  socket.on('playerChoice', ({ playerName, choice, gameRound }, correctAnswer) => {
    const room = rooms[socket.roomName];
    room.sockets[0].emit('playerChoice', playerName, choice, gameRound, correctAnswer); // first socket is game master
    if (choice === correctAnswer) {
      updateScore(socket, playerName);
    }
    // res = Object.values(room.players);
  });

  // socket.on('updateScore', (playerName) => {
  //   const room = rooms[socket.roomName];
  //   const remainingTime = room.timeLeft;
  //   const remainingPercentage = remainingTime / 20;
  //   room.players[playerName].score += 1000 + 1000 * remainingPercentage;
  //   for (const client of res) {
  //     socket.to(client.id).emit('getRoomPlayers', Object.values(room.players));
  //   };
  // });

  // socket.on('correctAnswer', (correctAnswer, playerName) => {
  //   const room = rooms[socket.roomName];
  //   socket.to(room.players[playerName].id).emit('correctAnswer', correctAnswer);
  //   console.log('correctAnswer', correctAnswer);
  // });

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
    if (room.players) {
      res = Object.values(room.players); // send array with keys that has objects as values

      // send individual score to each client
      for (const client of res) {
        socket.to(client.id).emit('finalPlayerInfo', client);
      };
    }
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

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
