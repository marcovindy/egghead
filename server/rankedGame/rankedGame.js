

const socketio = require('socket.io');
const server = require('http').createServer();
const io = socketio(server);

const { validateToken } = require("./middlewares/auth");

const rooms = {};

// Fronta čekajících hráčů
const queues = {
    geography: [],
    history: [],
    science: [],
    music: [],
    art: [],
};

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.use(validateToken);

    socket.on('joinQueue', (categories) => {
        joinQueue(categories, socket);
    });

    function joinQueue(categories, socket) {
        if (!Array.isArray(categories)) {
            categories = [categories];
        }
        for (const category of categories) {
            if (category in queues) {
                queues[category].push(socket.id);
                console.log(`Player ${socket.id} joined ${category} queue.`);
            } else {
                console.log(`Unknown category: ${category}`);
            }
        }
        const players = findPlayers();
        if (players !== null) {
            createRoom(players);
        } else {
            io.to(socket.id).emit('message', 'Waiting for other players...');
        }
    }

    function findPlayers() {
        for (const category in queues) {
            if (queues[category].length >= 4) {
                return queues[category].splice(0, 4);
            }
        }
        return null;
    }

    function createRoom(players) {
        const roomId = Math.random().toString(36).substr(2, 8);
        rooms[roomId] = {
            name: "Ranked Game",
            host: null,
            players,
            gameStarted: false,
            gameData: {},
            results: {},
            playersReady: [],
        };
        rooms[roomId].host = rooms[roomId].players[0];
        io.to(rooms[roomId].host).emit('roomCreated', roomId);
        io.to(roomId).emit('playerJoined', rooms[roomId].players);
        console.log(`New room created: ${roomId}`);

        startGame(roomId);
    }

    function startGame(roomId) {
        // implementace funkce startGame
    }


    socket.on('createRoom', (roomName) => {
        const roomId = Math.random().toString(36).substr(2, 8);
        rooms[roomId] = {
            name: roomName,
            host: socket.id,
            players: [socket.id],
            gameStarted: false,
            gameData: {},
            results: {},
            playersReady: [], // pole pro ukládání ID hráčů, kteří jsou připraveni hrát
        };
        socket.join(roomId);
        socket.emit('roomCreated', roomId);
        console.log(`New room created: ${roomId}`);
    });

    socket.on('joinRoom', (roomId) => {
        if (roomId in rooms) {
            const room = rooms[roomId];
            if (room.gameStarted) {
                socket.emit('errorMessage', 'Game already started.');
            } else if (room.players.includes(socket.id)) {
                console.log(`Player ${socket.id} is already in room ${roomId}`);
            } else {
                if (room.players.length < 4) {
                    room.players.push(socket.id);
                    socket.join(roomId);
                    console.log(`Player ${socket.id} joined room ${roomId}`);
                    io.to(roomId).emit('playerJoined', room.players);

                    if (room.players.length === 4 && !room.gameStarted) {
                        // Pokud máme dostatek hráčů pro spuštění hry a hra ještě nezačala, spustíme hru.
                        room.gameStarted = true;
                        startGameSpecific(roomId);
                    }
                } else {
                    socket.emit('errorMessage', 'Room is full.');
                }
            }
        } else {
            socket.emit('errorMessage', 'Room does not exist.');
        }
    });

    socket.on('playerReady', (roomId, playerId) => {
        const room = rooms[roomId];
        room.playersReady.push(playerId);
        io.to(roomId).emit('playerReady', playerId);

        if (room.playersReady.length === room.players.length) {
            // Pokud jsou všichni hráči připraveni, spustíme hru.
            room.gameStarted = true;
            startGameSpecific(roomId);
        }
    });

    function startGameSpecific(roomId) {
        // Nastavte herní logiku pro herní místnost.
        const room = rooms[roomId];
        // ...
        io.to(roomId).emit('gameStarted');
    }
});

module.exports = server;
