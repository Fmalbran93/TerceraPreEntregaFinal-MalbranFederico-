import { cartsModel } from "../../models/mongo/carts.model.js";

class CartManager {

  getCarts = async () => {
    try {
      return await cartsModel.find();
    } catch (err) {
      console.error(err);
    }
  };

  getCartById = async (cartId) => {
    try {
      return await cartsModel.findOne(
        { _id: cartId }).lean().populate("products._id");
    } catch (err) {
      console.error(err);
    }
  };

  async addCart() {
    try {
      const newCart = new cartsModel(
        { products: [] }
      );
      await newCart.save();
      return newCart;
    } catch (err) {
      console.error(err);
    }
  }

  addProductInCart = async (cid, productFromBody) => {
    try {
      const cart = await cartsModel.findOne(
        { _id: cid }
      );
      const findProduct = cart.products.some((product) => product._id.toString() === productFromBody._id);
      if (findProduct) {
        await cartsModel.updateOne(
          { _id: cid, "products._id": productFromBody._id },
          { $inc: { "products.$.quantity": productFromBody.quantity } }
        );
        return await cartsModel.findOne({ _id: cid });
      }
      await cartsModel.updateOne(
        { _id: cid },
        {
          $push: {
            products: {
              _id: productFromBody._id,
              quantity: productFromBody.quantity,
              price: productFromBody.price,
              thumbnail: productFromBody.thumbnail
            }
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  updateProductsInCart = async (cid, products) => {
    try {
      return await cartsModel.findOneAndUpdate(
        { _id: cid },
        { products },
        { new: true });
    } catch (err) {
      console.error(err);
    }
  };

  updateOneProduct = async (cid, products) => {
    try {
      await cartsModel.updateOne(
        { _id: cid },
        { products });
      return await cartsModel.findOne({ _id: cid });
    } catch (err) {
      console.error(err);
    }
  };
}

export default CartManager;
