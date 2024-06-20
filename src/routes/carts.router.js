import { Router } from "express";

//import CartManager from "../Dao/controllers/Mongo/cartManagerMongo.js";
//import ProductManager from "../Dao/controllers/Mongo/productManagerMongo.js";

import CartManager from "../Dao/controllers/mongoPersistence/cartManagerMongoPER.js";
import ProductManager from "../Dao/controllers/mongoPersistence/productManagerMongoPER.js";

const routerC = Router();
const cm = new CartManager();
const pm = new ProductManager();

routerC.get("/", async (req, res) => {
  try {
    const result = await cm.getCarts();
    return res.status(200).json({ status: "success", carts: result });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

routerC.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cm.getCartById(cid);
    if (result === null || typeof result === "string")
      return res
        .status(404)
        .json({ status: "error", message: "Cart Not found" });
    return res.status(200).json({ status: success, cart: result });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

routerC.post("/:cid/products/:pid", async (req, res) => {
  try {
    let { cid, pid } = req.params;
    const { quantity } = req.body;

    if (quantity < 1)
      return res
        .status(400)
        .json({
          status: "error",
          payload: null,
          message: "la cantidad debe ser mayor a 0",
        });

    const checkIdProduct = await pm.getProductById(pid);
    if (checkIdProduct === null || typeof checkIdProduct === "string")
      return res
        .status(404)
        .json({
          status: "error",
          message: `El producto con el ID: ${pid} no ha sido encontrado`,
        });

    const checkIdCart = await cm.getCartById(cid);
    if (checkIdCart === null || typeof checkIdCart === "string")
      return res
        .status(404)
        .json({
          status: "error",
          message: `El carrito con el ID: ${cid} no ha sido encontrado`,
        });

    const result = await cm.addProductInCart(cid, { _id: pid, quantity });
    return res
      .status(200)
      .json({
        status: "success",
        message: `El producto con el ID: ${pid}, ha sido agregado al carrito: ${cid}`,
        cart: result,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

routerC.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const results = await Promise.all(
      products.map(async (product) => {
        const checkId = await pm.getProductById(product._id);
        if (checkId === null || typeof checkId === "string")
          return res
            .status(404)
            .json({
              status: "error",
              message: `El producto con el ID: ${product._id} no ha sido encontrado`,
            });
      })
    );

    const check = results.find((value) => value !== undefined);
    if (check) return res.status(404).json({ check });

    const checkIdCart = await cm.getCartById(cid);
    if (checkIdCart === null || typeof checkIdCart === "string")
      return res
        .status(404)
        .json({
          status: "error",
          message: `El carrito con el ID: ${cid} no ha sido encontrado`,
        });

    const cart = await cm.updateProductsInCart(cid, products);
    return res.status(200).send({ status: "success", cart: cart });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

export default routerC;
