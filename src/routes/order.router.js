import { Router } from "express";

//import Orders from "../Dao/controllers/Mongo/orderManagerMongo.js";
import Orders from "../Dao/controllers/mongoPersistence/orderManagerMongoPER.js";

const or = new Orders();
const OrderV = Router();

OrderV.get("/", async (req, res) => {
  try {
    const result = await or.getOrders();
    return res.status(200).json({
      status: "success",
      order: result,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

OrderV.post("/", async (req, res) => {
  try {
    const newOrder = await or.addOrder(req.body);
    return res.status(200).json({
      status: "success",
      order: newOrder,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear orden de compra",
    });
  }
});

OrderV.get("/:oid", async (req, res) => {
  try {
    const { oid } = req.params;
    const orderFind = await or.getOrderById(oid);
    res.status(200).json({
      status: "success",
      order: orderFind,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal serve error",
    });
  }
});

OrderV.put("/:oid", async (req, res) => {
  try {
    const { oid } = req.params;
    await or.updateOrder(oid, req.body);
    return res.status(200).json({
      status: "success",
      message: "Orden actualizada",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al Actualizar orden",
    });
  }
});

OrderV.delete("/:oid", async (req, res) => {
  try {
    const { oid } = req.params;
    await or.deleteOrder(oid);
    res.status(200).json({
      status: "success",
      message: "Orden Eliminada",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar orden",
    });
  }
});

export default OrderV;
