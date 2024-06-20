import { Router } from "express";
import { __dirname } from "../utils.js";

//import ProductManager from "../Dao/controllers/Mongo/productManagerMongo.js";
import ProductManager from "../Dao/controllers/mongoPersistence/productManagerMongoPER.js";

const pm = new ProductManager();
const routerP = Router();

routerP.get("/", async (req, res) => {
  try {
    let { limit, page, sort, category } = req.query;

    console.log(req.originalUrl);

    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: { price: Number(sort) },
    };

    if (!(options.sort.price === -1 || options.sort.price === 1)) {
      delete options.sort;
    }

    const links = (products) => {
      let prevLink, nextLink;

      if (req.originalUrl.includes("page")) {
        prevLink = products.hasPrevPage
          ? req.originalUrl.replace(
              `page=${products.page}`,
              `page=${products.prevPage}`
            )
          : null;

        nextLink = products.hasNextPage
          ? req.originalUrl.replace(
              `page=${products.page}`,
              `page=${products.nextPage}`
            )
          : null;

        return { prevLink, nextLink };
      }

      if (!req.originalUrl.includes("?")) {
        prevLink = products.hasPrevPage
          ? req.originalUrl.concat(`?page=${products.prevPage}`)
          : null;

        nextLink = products.hasNextPage
          ? req.originalUrl.concat(`?page=${products.nextPage}`)
          : null;

        return { prevLink, nextLink };
      }

      prevLink = products.hasPrevPage
        ? req.originalUrl.concat(`&page=${products.prevPage}`)
        : null;

      nextLink = products.hasNextPage
        ? req.originalUrl.concat(`&page=${products.nextPage}`)
        : null;

      return { prevLink, nextLink };
    };

    const categories = await pm.categories();

    const result = categories.some((categ) => categ === category);
    if (result) {
      const products = await pm.getProducts({ category }, options);
      console.log(products);

      const { prevLink, nextLink } = links(products);
      const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } =
        products;

      return res.status(200).json({
        status: "success",
        payload: docs,
        totalPages,
        prevPage,
        nextPage,
        hasNextPage,
        hasPrevPage,
        prevLink,
        nextLink,
      });
    }

    const products = await pm.getProducts({}, options);

    const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } =
      products;
    const { prevLink, nextLink } = links(products);

    if (page > totalPages) return res.status(400).json("page not found");

    return res.status(200).json({
      status: "success",
      payload: docs,
      totalPages,
      prevPage,
      nextPage,
      hasNextPage,
      hasPrevPage,
      prevLink,
      nextLink,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

routerP.get("/:pid", async (req, res) => {
  try {
    const productfind = await pm.getProductById(req.params);
    res.status(200).json({
      status: "success",
      product: productfind,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

routerP.post("/", async (req, res) => {
  try {
    const newproduct = await pm.addProduct(req.body);
    res.status(200).json({
      status: "success",
      product: newproduct,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

routerP.put("/:pid", async (req, res) => {
  try {
    const updatedproduct = await pm.updateProduct(req.params, req.body);
    res.status(200).json({
      status: "success",
      product: updatedproduct,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

routerP.delete("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const deleteproduct = await pm.deleteProduct(id);
    res.status(200).json({
      status: "success",
      product: deleteproduct,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

export default routerP;
