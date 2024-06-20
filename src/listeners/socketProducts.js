import ProductManager from "../Dao/controllers/Mongo/productManagerMongo.js";
import { __dirname } from "../utils.js";

const pm = new ProductManager();

const socketProducts = (socketServer) => {
  try {
    socketServer.on("connection", async (socket) => {
      console.log("client connected con ID:", socket.id);
      const listadeproductos = await pm.getProductsView();
      socketServer.emit("enviodeproducts", listadeproductos);

      socket.on("addProduct", async (obj) => {
        await pm.addProduct(obj);
        const listadeproductos = await pm.getProductsView();
        socketServer.emit("enviodeproducts", listadeproductos);
      });

      socket.on("deleteProduct", async (id) => {
        await pm.deleteProduct(id);
        const listadeproductos = await pm.getProductsView();
        socketServer.emit("enviodeproducts", listadeproductos);
      });
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export default socketProducts;
