import { Server as SocketIOServer } from "socket.io";
export const initSocketServer = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("A user connected with ID:", socket.id);
        socket.on("notification", (data) => {
            console.log("Notification received:", data);
            io.emit("newNotification", data);
        });
        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });
    });
    console.log("Socket.IO server initialized");
};
