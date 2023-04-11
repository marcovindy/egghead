

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

});

module.exports = server;
