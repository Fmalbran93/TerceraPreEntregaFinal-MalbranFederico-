import { productsModel } from "../../models/mongo/products.model.js";

export default class ProductManager {

  categories = async () => {
    try {
      const categories = await productsModel.distinct("category");
      return categories;
    } catch (err) {
      console.error(err);
    }
  };

  getProducts = async (filter, options) => {
    try {
      return await productsModel.paginate(filter, options);
    } catch (err) {
      console.error(err);
    }
  };

  getProductsView = async () => {
    try {
      return await productsModel.find().lean();
    } catch (err) {
      console.error(err);
    }
  };

  getProductById = async (id) => {
    try {
      return await productsModel.findById(id);
    } catch (err) {
      console.error(err);
    }
  };

  addProduct = async (product) => {
    try {
      await productsModel.create(product);
      return await productsModel.findOne({ title: product.title });
    } catch (err) {
      console.error(err);
    }
  };

  updateProduct = async (id, product) => {
    try {
      return await productsModel.findByIdAndUpdate(id,
        { $set: product }
      );
    } catch (err) {
      console.error(err);
    }
  };

  deleteProduct = async (id) => {
    try {
      return await productsModel.findByIdAndDelete(id);
    } catch (err) {
      console.error(err);
    }
  };
}
