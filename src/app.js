import express from "express";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

import "./configServer.js";
import { Server } from "socket.io";
import socketChat from "./listeners/socketChat.js";
import socketProducts from "./listeners/socketproducts.js";
import initializePassport from "./config/passport.js";
import configObject from "./config/envConfig.js";

import routerP from "./routes/products.router.js";
import routerV from "./routes/views.router.js";
import routerC from "./routes/carts.router.js";
import sessionRouter from "./routes/session.router.js";
import authRouter from "./routes/auth.router.js";
import OrderV from "./routes/order.router.js";

const app = express();

const PORT = configObject.server.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: configObject.server.secret,
    resave: true,
    saveUninitialized: true,
    cookie: { path: "/", httpOnly: true, maxAge: 600000 },
    name: "Skate And Destroy",
    rolling: true,
    store: MongoStore.create({
      mongoUrl: configObject.server.mongo_url,
      ttl: 100,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
initializePassport();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use((req, res, next) => {
  app.locals.user = req.user;
  next();
});

app.use("/api/products", routerP);
app.use("/api/carts", routerC);
app.use("/api/sessions", sessionRouter);
app.use("/api/users", authRouter);
app.use("/api/orders", OrderV);
app.use("/", routerV);

const httpServer = app.listen(PORT, () => {
  try {
    console.log(`Listening on the port http://localhost:${PORT}`);
  } catch (err) {
    console.error(err);
  }
});

const socketServer = new Server(httpServer);

socketProducts(socketServer);
socketChat(socketServer);
