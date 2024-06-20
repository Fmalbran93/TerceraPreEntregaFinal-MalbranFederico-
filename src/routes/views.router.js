import { Router } from "express";
import { __dirname } from "../utils.js";

//import ProductManager from "../Dao/controllers/Mongo/productManagerMongo.js";
//import CartManager from "../Dao/controllers/Mongo/cartManagerMongo.js";
//import OrderManager from "../Dao/controllers/Mongo/orderManagerMongo.js";
import ProductManager from "../Dao/controllers/mongoPersistence/productManagerMongoPER.js";
import CartManager from "../Dao/controllers/mongoPersistence/cartManagerMongoPER.js";
import OrderManager from "../Dao/controllers/mongoPersistence/orderManagerMongoPER.js";

const pm = new ProductManager();
const cm = new CartManager();
const or = new OrderManager();
const routerV = Router();
let cart = [];

routerV.get("/", async (req, res) => {
  try {
    if (!req.session.login) {
      res.render("login");
    } else {
      res.render("home");
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

routerV.get("/products", async (req, res) => {
  try {
    let { limit, page, sort, category } = req.query;

    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 6,
      sort: { price: Number(sort) },
      lean: true,
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
      const { prevLink, nextLink } = links(products);
      const {
        totalPages,
        prevPage,
        nextPage,
        hasNextPage,
        hasPrevPage,
        docs,
        page,
      } = products;

      if (page > totalPages)
        return res.render("notFound", { pageNotFound: "/products" });
      if (req.user.roles !== "user") {
        return res.status(401).json({
          status: "error",
          message: "Your no authorized",
        });
      } else
        return res.render("products", {
          products: docs,
          totalPages,
          prevPage,
          nextPage,
          hasNextPage,
          hasPrevPage,
          prevLink,
          nextLink,
          page,
          cart: cart.length,
        });
    }

    const products = await pm.getProducts({}, options);

    const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } =
      products;
    const { prevLink, nextLink } = links(products);

    if (page > totalPages)
      return res.render("notFound", { pageNotFound: "/products" });
    if (req.user.roles !== "user") {
      return res.status(401).json({
        status: "error",
        message: "Your no authorized",
      });
    } else
      return res.render("products", {
        products: docs,
        totalPages,
        prevPage,
        nextPage,
        hasNextPage,
        hasPrevPage,
        prevLink,
        nextLink,
        page,
        cart: cart.length,
      });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

routerV.get("/products/inCart", async (req, res) => {
  try {
    const productsInCart = await Promise.all(
      cart.map(async (product) => {
        const productDB = await pm.getProductById(product._id);
        console.log(productDB);
        return {
          title: productDB.title,
          quantity: product.quantity,
          price: productDB.price,
          thumbnail: productDB.thumbnail,
        };
      })
    );
    return res.send({
      cartLength: cart.length,
      productsInCart,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

routerV.post("/products", async (req, res) => {
  try {
    const { product, finishBuy } = req.body;
    if (product) {
      if (product.quantity > 0) {
        const findId = cart.findIndex(
          (productCart) => productCart._id === product._id
        );
        findId !== -1
          ? (cart[findId].quantity += product.quantity)
          : cart.push(product);
      } else {
        return res.render("products", {
          message: "Quantity must be greater than 0",
        });
      }
    }
    if (finishBuy) {
      if(req.user){
        const email = req.user.email;
        const name = req.user.name;
        console.log(`El email de ${name} es ${email}`);
        await or.addOrder();
        cart.splice(0, cart.length);
      }
      }
    
    return res.redirect("products");
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

routerV.get("/realtimeproducts", (req, res) => {
  try {
    if (req.user.roles !== "admin") {
      res.status(401).json({
        status: "error",
        messagr: "Your no authorized",
      });
    } else res.render("realtimeproducts");
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

routerV.get("/chat", (req, res) => {
  try {
    if (req.user.roles !== "user") {
      return res.status(401).json({
        status: "error",
        message: "Your no authorized",
      });
    } else {
      res.render("chat");
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

routerV.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cm.getCartById(cid);
    if (result === null || typeof result === "string")
      return res.render("notFound", { result: false, message: "ID not found" });
    if (req.user.roles !== "user") {
      return res.status(401).json({
        status: "error",
        message: "Your no authorized",
      });
    } else return res.render("cart", { result });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

routerV.get("/products/:pid", async (req, res) => {
  try {
    if (req.user.roles !== "user") {
      return res.status(401).json({
        status: "error",
        message: "Your no authorized",
      });
    } else {
      const { pid } = req.params;
      const produ = await pm.getProductById(pid);
      return res.render("ProductDetail", { produ });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

routerV.get("/login", (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

routerV.get("/register", (req, res) => {
  try {
    res.render("register");
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

routerV.get("/profile", (req, res) => {
  try {
    if (!req.session.login) {
      return res.redirect("/profile");
    } else {
      res.render("profile");
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

export default routerV;
