import MessageManager from "../Dao/controllers/Mongo/messageManagerMongo.js";

const mm = new MessageManager();

const socketChat = (socketServer) => {
  try {
    socketServer.on("connection", async (socket) => {
      console.log("conectado usuario con id: ", socket.id);

      socket.on("mensaje", async (info) => {
        await mm.createMessage(info);
        socketServer.emit("chat", await mm.getMessages());
      });
      socket.on("clearchat", async () => {
        await mm.deleteAllMessages();
      });

      socket.on("nuevousuario", (usuario) => {
        socket.broadcast.emit("broadcast", usuario);
      });
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export default socketChat;
