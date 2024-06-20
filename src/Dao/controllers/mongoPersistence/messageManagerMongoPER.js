import messageModel from "../../models/mongo/messages.model.js";

export default class MessageManager {
  getMessages = async () => {
    try {
      return await messageModel.find().lean();
    } catch (err) {
      console.error(err);
    }
  };

  createMessage = async (message) => {
    if (message.user.trim() === "" || message.message.trim() === "") {
      return null;
    }
    try {
      return await messageModel.create(message);
    } catch (err) {
      console.error(err);
    }
  };

  deleteAllMessages = async () => {
    try {
      console.log("Borrando mensajes...");
      const result = await messageModel.deleteMany({});
      console.log("Mensajes eliminados:", result);
      return result;
    } catch (err) {
      console.error(err);
    }
  };
}
