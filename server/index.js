const express = require("express");
const app = express();
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const uuidv1 = require("uuid/v1");
const compression = require("compression");
require('dotenv').config();

const PORT = process.env.PORT;
const server = http.createServer(app);
const io = socketio(server, {
  pingInterval: 10000, // check how often
  pingTimeout: 80000, // until close connection
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
});

// Middleware to force HTTPS
const forceHttps = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  next();
};

// Use the forceHttps middleware
app.use(forceHttps);

app.use(compression());
app.use(express.json());
const whitelist = [
  "https://testing-egg.herokuapp.com",
  "http://testing-egg.herokuapp.com",
  "http://localhost:3000",
  "http://localhost:5000",
];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable");
      callback(null, true);
    } else {
      console.log("Origin rejected");
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

const db = require("./models");

// Routers
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
const statsRouter = require("./routes/Stats");
app.use("/stats", statsRouter);
const achievementsRouter = require("./routes/Achievements");
app.use("/achievements", achievementsRouter);

// Serve any static files
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const fetchRandomQuestionsFromVerifiedQuizzes = require("./fetch/FetchRandomQuestionsFromVerifiedQuizzes");

// SOCKET
const rooms = [];
const queues = {};

function joinRoom(socket, room, playerName, gameMode) {
  socket.join(room.id, () => {
    room.sockets.push(socket);
    socket.roomId = room.id;
    socket.roomName = room.name;
    socket.username = playerName;

    if (room.sockets.length !== 1 || gameMode === "CustomGame") {
      const player = { id: socket.id, username: playerName, score: 0 };
      room.players[playerName] = player;
    }

    socket.emit("message", {
      text: `Welcome ${playerName} to the game in ${room.name}.`,
    });
    socket.broadcast
      .to(room.id)
      .emit("message", { text: `${playerName} has joined the game!` });

    const allPlayersInRoom = Object.values(room.players);
    io.to(room.id).emit("playerData", allPlayersInRoom);
    sendActiveRoomsToAll();
  });
}
// Funkce pro odeslání seznamu aktivních místností
const sendActiveRoomsToAll = () => {
  const activeRooms = Object.values(rooms).map(
    ({ id, name, players, categories, round }) => ({
      id,
      name,
      players: Object.values(players),
      categories: categories || [],
      round: round || 0,
    })
  );
  io.emit("activeRooms", activeRooms);
};

const createNewRoom = async (
  roomName,
  masterName,
  socket,
  quizId,
  gameMode,
  category
) => {
  let quiz = {};
  let questions = {};
  let questionsLength = 1;

  if (rooms[roomName]) {
    return socket.emit("createRoomError", {
      message: "Error: Room already exists with that name, try another!",
    });
  }

  if (gameMode === "RankedGame") {
    questions = await fetchRandomQuestionsFromVerifiedQuizzes(category);
    questionsLength = questions.length;
  }
  const room = {
    id: uuidv1(),
    name: roomName,
    gameMode: gameMode,
    sockets: [],
    players: {},
    activated: false,
    quiz: quiz,
    categories: [],
    questions: questions,
    questionsLength: questionsLength,
    round: 0,
  };

  rooms[roomName] = room;
  joinRoom(socket, room, masterName, gameMode);

  sendActiveRoomsToAll();
};

const addCorrectAnswersRandomly = (gameOptionsArray, correctAnswers) => {
  const tempCorrectAnswers = [...correctAnswers];
  while (tempCorrectAnswers.length > 0) {
    const randomIndex = Math.floor(Math.random() * tempCorrectAnswers.length);
    const randomCorrectAnswer = tempCorrectAnswers.splice(randomIndex, 1)[0];
    const insertIndex = Math.floor(
      Math.random() * (gameOptionsArray.length + 1)
    );
    gameOptionsArray.splice(insertIndex, 0, randomCorrectAnswer);
  }
  return gameOptionsArray;
};

const nextQuestion = (socket, round, questions) => {
  const room = rooms[socket.roomName];
  if (room && room.questions && room.questions[round - 1].question) {
    const gameQuestion = room.questions[round - 1].question;
    const answers = room.questions[round - 1].answers;
    const correctAnswers = answers
      .filter((answer) => answer.isCorrect)
      .map((answer) => answer.text);

    const incorrectAnswers = answers.filter((answer) => !answer.isCorrect);
    const gameOptionsArray = [...incorrectAnswers.map((answer) => answer.text)];

    // Call the new function to add all correct answers to gameOptionsArray
    addCorrectAnswersRandomly(gameOptionsArray, correctAnswers);

    const gameRound = round;
    const totalQuestionsNum = room.questions.length;

    io.to(socket.roomId).emit(
      "currentRound",
      { question: `${gameQuestion}` },
      gameOptionsArray,
      gameRound,
      correctAnswers,
      totalQuestionsNum
    );

    // Update activeRooms list
    sendActiveRoomsToAll();
  }
};

const startTimerTest = (socket, questionLimit) => {
  const room = rooms[socket.roomName];
  if (room) {
    room.questionLimit = questionLimit;
    const questions = room.questions;
    let timeLeftTest = questionLimit;

    const timerInterval = setInterval(() => {
      res = Object.values(room.players);
      timeLeftTest--;
      room.timeLeft = timeLeftTest;
      for (const player of Object.values(room.players)) {
        io.to(player.id).emit("timerTick", timeLeftTest, questionLimit, player);
      }
      if (timeLeftTest === 0) {
        clearInterval(timerInterval);

        if (room.round < room.questionsLength) {
          room.round++;
          const round = room.round;
          timeLeftTest = questionLimit;
          nextQuestion(socket, round, questions);
          startTimerTest(socket, room.questions[round - 1].limit);
        } else {
          res = Object.values(room.players);
          io.to(socket.roomId).emit("gameEnded", res);
          gameEnded(socket);
        }
      }
    }, 1000);
  }
};

const updateScore = (socket, playerName) => {
  const room = rooms[socket.roomName];
  const remainingTime = room.timeLeft;
  const remainingPercentage = remainingTime / room.questionLimit;

  room.players[playerName].score += 1000 + 1000 * remainingPercentage;
  room.players[playerName].score = Math.round(room.players[playerName].score * 100) / 100;
  res = Object.values(room.players);
  socket.emit("getRoomPlayers", res);
  for (const client of res) {
    socket.to(client.id).emit("getRoomPlayers", res);
  }
};

const gameEnded = (socket) => {
  const room = rooms[socket.roomName];
  const gameMode = room.gameMode;
  const players = Object.values(room.players);
  const sortedPlayers = players.sort((a, b) => b.score - a.score);

  sortedPlayers.forEach((player, index) => {
    io.to(player.id).emit("finalRanking", {
      position: index + 1,
      rounds: room.questions.length,
      gameMode: gameMode,
    });
  });
};

// Create new room
io.on("connect", (socket) => {
  socket.emit("newConn", { msg: "welcome" });
  socket.on("showActiveRooms", sendActiveRoomsToAll);
  socket.on(
    "createRoom",
    ({ roomName, masterName, quizId, gameMode }, callback) => {
      category = undefined;
      createNewRoom(roomName, masterName, socket, quizId, gameMode, category);
    }
  );

  socket.on("joinRoom", ({ joinRoomName, playerName }, callback) => {
    const room = rooms[joinRoomName];
    if (!room) {
      return callback({ error: "No rooms created with that name" });
    }
    if (!playerName) {
      return callback({ error: "You have to fill out player name" });
    }
    if (room.players[playerName]) {
      return callback({
        error: "A player with that name is already in the room",
      });
    }
    joinRoom(socket, room, playerName);

    sendActiveRoomsToAll();
  });

  socket.on("ready", (callback) => {
    const room = rooms[socket.roomName];
    if (room.sockets.length > 0) {
      for (const client of room.sockets) {
        client.emit("initGame");
        callback({ res: "Game started - Question is being showed to players" });
      }
    } else {
      callback({
        res: "Not enough players to start game - needs at least 2 players",
      });
    }
  });

  socket.on("sendQuizInfo", (quizInfo) => {
    if (rooms && rooms[socket.roomName]) {
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
    } else {
      return socket.emit("createRoomError", {
        error: "Error: Room already exists with that name, try another!",
      });
    }
  });

  socket.on("sendQuestionsToServerTest", (questions, questionsLength) => {
    if (rooms && rooms[socket.roomName]) {
      const room = rooms[socket.roomName];
      const round = 0;
      room.questions = questions;
      room.questionsLength = questionsLength;
      room.round = round;
      room.activated = true;
      sendActiveRoomsToAll();
    } else {
      return socket.emit("createRoomError", {
        error: "Error: Room already exists with that name, try another!",
      });
    }
  });

  socket.on("startTimerTest", (questionLimit) => {
    console.log("startTimerTest", questionLimit);
    startTimerTest(socket, questionLimit);
  });

  socket.on(
    "playerChoice",
    ({ playerName, choice, gameRound }, correctAnswers) => {
      const room = rooms[socket.roomName];
      if (correctAnswers.includes(choice)) {
        updateScore(socket, playerName);
      }
    }
  );

  socket.on("playerBoard", () => {
    const room = rooms[socket.roomName];
    if (room.players) {
      res = Object.values(room.players);

      for (const client of res) {
        socket.to(client.id).emit("finalPlayerInfo", client);
      }
    }
  });

  socket.on("sendMessage", (message, callback) => {
    const room = rooms[socket.roomName];
    if (room) {
      io.to(socket.roomId).emit("newMessage", `${socket.username}: ${message}`);
    }
    callback();
  });

  socket.on("disconnect", () => {
    console.log("User left with socket id", socket.id);
    const room = rooms[socket.roomName];
    if (typeof room == "undefined") {
      console.log("Room does not exist, leave the room");
    } else {
      console.log(room.players[socket.username]);

      if (Object.keys(room.players).length !== 0) {
        const room = rooms[socket.roomName];
        if (room.players[socket.username]) {
          console.log(room.players[socket.username].username, "has left");
          socket.broadcast.to(socket.roomId).emit("message", {
            text: `${
              room.players[socket.username].username
            } has left the game!`,
          });
        }
        console.log(room.players[socket.username]);
        delete room.players[socket.username];
        // update room players array
        allPlayersInRoom = Object.values(room.players);
        io.to(room.id).emit("playerData", allPlayersInRoom);
      }
      if (Object.keys(room.players).length === 0 && room.activated) {
        socket.broadcast.to(socket.roomId).emit("message", {
          text: "The game has been cancelled due to lack of players",
        });
        socket.broadcast.to(socket.roomId).emit("stopTime");
        delete rooms[socket.roomName];
      }
    }
    // Update activeRooms list
    sendActiveRoomsToAll();
  });

  function updateQueueLengths() {
    const queueLengths = {};
    for (const category in queues) {
      queueLengths[category] = queues[category].length;
    }
    io.emit("queueUpdate.RankedGame", queueLengths);
  }

  socket.on(
    "joinQueue.RankedGame",
    (username, selectedCategories, callback) => {
      console.log(selectedCategories);
      for (const category of selectedCategories) {
        if (!queues[category]) {
          queues[category] = [];
        }
        const existingPlayer = queues[category].find(
          (player) => player.username === username
        );
        if (existingPlayer) {
          callback({ res: `Hráč ${username} již čeká ve frontě.` });
          return;
        }
        socket.username = username;
        queues[category].push(socket);
        updateQueueLengths();
      }

      for (const [category, queue] of Object.entries(queues)) {
        if (queue.length >= 2) {
          const players = queue.splice(0, 4);

          const existingRoom = Object.values(rooms).find(
            (room) =>
              room.category === category &&
              room.gameMode === "RankedGame" &&
              Object.keys(room.players).length < 2
          );

          let roomName;

          if (existingRoom) {
            roomName = existingRoom.name;
          } else {
            const uuid = uuidv1().replace(/-/g, "");
            roomName = category + uuid.substr(0, 6);
            createNewRoom(
              roomName,
              players[0].username,
              socket,
              "",
              "RankedGame",
              category
            );
          }

          players.forEach((player) => {
            const playerName = player.username;
            const playerSocket = player;
            playerSocket.emit("gameReady.RankedGame", roomName, playerName);
            removePlayerFromAllQueues(player.id);
          });
          callback({ res: `Hra nalezena.` });
          return;
        } else {
          callback({ res: `Hledám hru, prosím čekejte.` });
        }
      }
    }
  );

  function removePlayerFromAllQueues(playerId) {
    for (const category in queues) {
      const index = queues[category].findIndex(
        (player) => player.id === playerId
      );
      if (index !== -1) {
        queues[category].splice(index, 1);
        updateQueueLengths();
      }
    }
  }

  socket.on("leaveQueue.RankedGame", (username) => {
    let playerRemoved = false;

    for (const category in queues) {
      const index = queues[category].findIndex(
        (player) => player.id === socket.id
      );

      if (index !== -1) {
        queues[category].splice(index, 1);
        updateQueueLengths();
        playerRemoved = true;
      }
      io.emit("queueUpdate.RankedGame", queues[category].length);
    }

    if (playerRemoved) {
      console.log(`Hráč ${username} opustil frontu.`);
    } else {
      console.log(`Hráč ${username} nebyl nalezen ve frontách.`);
    }
  });

  socket.on("userLeftForServer.RankedGame", (nameOfRoom) => {
    io.emit("userLeft.RankedGame");
    delete rooms[nameOfRoom];
  });

  socket.on("start.RankedGame", (joinRoomName) => {
    if (rooms[joinRoomName] && !rooms[joinRoomName].activated) {
      rooms[joinRoomName].activated = true;
      startTimerTest(socket, 10);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
