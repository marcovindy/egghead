const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const PORT = 5000;
const cors = require('cors');
const path = require('path');
const mysql = require('mysql')
// const db = require('./config/db')




const app = express();
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

// MIDDLEWARE
// app.use(cors());
app.use(express.json());
const scores = require('./routes/scores');
app.use('/scores', scores);

const whitelist = ['https://testing-egg.herokuapp.com/', 'http://localhost:3000', 'http://localhost:5000']
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

// Serve any static files
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
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
    console.log(`Server running on port ${process.env.PORT}`);
});










// DB
const db_config = {
    host: "us-cdbr-east-06.cleardb.net",
    user: "b88095e6f76c5d",
    password: "b95f0a62",
    database: "heroku_6c2d5eee42a52cf"
};
const db = mysql.createConnection(db_config); 


// function handleDisconnect() {
//     const db = mysql.createConnection(db_config); // Recreate the connection, since
//     // the old one cannot be reused.

//     db.connect(function (err) {              // The server is either down
//         if (err) {                                     // or restarting (takes a while sometimes).
//             console.log('error when connecting to db:', err);
//             setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//         }                                     // to avoid a hot loop, and to allow our node script to
//     });                                     // process asynchronous requests in the meantime.
//     // If you're also serving http, display a 503 error.
//     db.on('error', function (err) {
//         console.log('db error', err);
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//             handleDisconnect();                         // lost due to either server restart, or a
//         } else {                                      // connnection idle timeout (the wait_timeout
//             throw err;                                  // server variable configures this)
//         }
//     });
// }

// handleDisconnect();


db.connect(function (err) {
    // if (err) throw err;
    // console.log("Connected!");
    // var sql = "INSERT INTO user (username, email, password) VALUES ('test', 'test@test.test', 'password')";
    // db.query(sql, function (err, result) {
    //     if (err) throw err;
    //     console.log("1 record inserted");
    // });

    if (err) throw err;
    db.query("SELECT * FROM user", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });

});


// API

// Route to get all users
app.get("/api/get", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) {
            console.log(err)
        }
        res.send(result)
    });
});

// Route to get one user
app.get("/api/getFromId/:id", (req, res) => {

    const id = req.params.id;
    db.query("SELECT * FROM user WHERE id = ?", id,
        (err, result) => {
            if (err) {
                console.log(err)
            }
            res.send(result)
        });
});

// Route for creating the user
app.post('/api/create', (req, res) => {

    const username = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;

    db.query("INSERT INTO user (username, email, password) VALUES (?,?,?)", [username, email, password], (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result)
    });
})







