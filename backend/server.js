const WebSocket = require('ws');
const Room = require('./room.js');

const wss = new WebSocket.Server({ port: 8080 });
console.log('Server started on port 8080');

const rooms = new Map();

function findOrCreateRoom(roomId = '') {
    let room = null;

    if (roomId && rooms.has(roomId)) {
        const potentialRoom = rooms.get(roomId);
        if (potentialRoom.lobbyState.status === 'waiting' && potentialRoom.lobbyState.players.length < 4) {
            room = potentialRoom;
        } else {
            // Room is full or in-game, so we can't join. Return null.
            return null;
        }
    } else {
        // Find any available room if no specific one is requested or found
        for (const r of rooms.values()) {
            if (r.lobbyState.status === 'waiting' && r.lobbyState.players.length < 4) {
                room = r;
                break;
            }
        }
    }

    // If no room is found, create a new one, but only if no specific roomId was requested
    if (!room && !roomId) {
        const newRoomId = `room-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        room = new Room(newRoomId);
        rooms.set(newRoomId, room);
        console.log(`Created new room: ${newRoomId}`);
    }

    return room;
}


wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (rawMessage) => {
        try {
            const data = JSON.parse(rawMessage);

            if (data.type === 'JOIN_GAME') {
                const { nickname, roomId } = data.payload;
                const room = findOrCreateRoom(roomId);

                if (room) {
                    room.addPlayer(ws, nickname);
                } else {
                    // Send an error message back to the client
                    ws.send(JSON.stringify({ type: 'ERROR', payload: `Room ${roomId} is full, does not exist, or game is in progress.` }));
                }
            } else {
                // For existing players, their messages are handled by their room.
                const roomId = ws.roomId;
                const room = rooms.get(roomId);
                if (room) {
                    room.handleMessage(ws, data);
                } else {
                    console.log(`Message from player in non-existent room ${roomId}`);
                }
            }
        } catch (error) {
            console.error('Failed to parse message or handle client request:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        const roomId = ws.roomId;
        if (roomId) {
            const room = rooms.get(roomId);
            if (room) {
                room.removePlayer(ws);
                // If the room becomes empty, we can choose to remove it.
                if (room.lobbyState.players.length === 0) {
                    rooms.delete(roomId);
                    console.log(`Room ${roomId} is empty and has been removed.`);
                }
            }
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});