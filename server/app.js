const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const PORT = 5000;
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    pingInterval: 10000, // check how often
    pingTimeout: 60000, // until close connection
    cookie: false
});

// MIDDLEWARE
// app.use(cors());
app.use(express.json());
const scores = require('./routes/scores');
app.use('/scores', scores);

const whitelist = ['https://egghead-quiz.herokuapp.com/', 'http://localhost:3000', 'http://localhost:5000']
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

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .catch((err) => {
        console.log(err);
    });

// SOCKET
const uuidv1 = require('uuid/v1');
rooms = [];

io.on('connect', (socket) => {
    console.log('new connection', socket.id);

    socket.emit('newConn', { msg: 'welcome' });

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
    });

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
    });

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
    });

    socket.on('playerChoice', ({ playerName, choice, gameRound }) => {
        const room = rooms[socket.roomName];
        room.sockets[0].emit('playerChoice', playerName, choice, gameRound); // first socket is game master
    });

    socket.on('updateScore', (playerName) => {
        const room = rooms[socket.roomName];
        room.players[playerName].score += 1;
        socket.to(room.players[playerName].id).emit('getRoomPlayers', Object.values(room.players), room.players[playerName].username, room.players[playerName].score);
        console.log("Points", room.players[playerName].score, " Name: ", room.players[playerName].username);

        // Jen tady se zachytává počet bodů
    });

    socket.on('correctAnswer', (correctAnswer, playerName) => {
        const room = rooms[socket.roomName];
        socket.to(room.players[playerName].id).emit('correctAnswer', correctAnswer);
    });

    socket.on('endGame', () => {
        const room = rooms[socket.roomName];
        res = Object.values(room.players); // send array with keys that has objects as values
        io.to(room.id).emit('scores', res);

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
                delete rooms[room.name];
            };
        };
    });
});

server.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


