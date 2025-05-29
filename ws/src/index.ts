import  WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({port: 8080});

let allSockets : {[key: string] : WebSocket[]} = {};

wss.on("connection", (socket) => {

    socket.on("message", (message) =>{
        const parsedMsg = JSON.parse(message.toString());
        if(parsedMsg.type == "join"){
            const { roomId } = parsedMsg.payload;
            if (!allSockets[roomId]) {
                allSockets[roomId] = [];
            }
            allSockets[roomId].push(socket as unknown as WebSocket);
        }


        if(parsedMsg.type == "chat"){
            const { roomId, message } = parsedMsg.payload;
            const room = allSockets[roomId] || [];
            room.forEach((s) => {
                s.send(message);
            });
        }
    })

    socket.on('close', () => {
    // Remove socket from all rooms
    for (const roomId in allSockets) {
      allSockets[roomId] = allSockets[roomId].filter((s: WebSocket) => s !== socket);
      if (allSockets[roomId].length === 0) {
        delete allSockets[roomId];
      }
    }
  });
})

