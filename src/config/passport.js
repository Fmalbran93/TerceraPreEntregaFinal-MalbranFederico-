import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import GoogleStrategy from "passport-google-oauth2";

import userModel from "../Dao/models/mongo/user.model.js";
import CartManager from "../Dao/controllers/Mongo/cartManagerMongo.js";

import { createHash, isValidPassword } from "./hash.js";
import configObject from "./envConfig.js";

const cm = new CartManager();
const localStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, userName, password, done) => {
        const { name, surName, email, age } = req.body;
        try {
          let user = await userModel.findOne({ email });
          if (user) return done(null, false);
          const cart = await cm.addCart();
          let newUser = {
            name,
            surName,
            email,
            age,
            cart,
            password: createHash(password),
          };
          let result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          let user = await userModel.findOne({ email });
          if (!user) {
            console.log("EL usuario no existe");
            return done(null, false);
          }
          if (!isValidPassword(password, user)) {
            return done(null, false);
          }
          console.log(user);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: configObject.auth_github.github_client_id,
        clientSecret: configObject.auth_github.github_secret_client,
        callbackURL: configObject.auth_github.github_callback,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Profile", profile);
        try {
          let user = await userModel.findOne({ email: profile._json.email });
          const cart = await cm.addCart();
          if (!user) {
            let newUser = {
              name: profile._json.name,
              surName: "",
              age: 36,
              email: profile._json.email,
              password: "",
              cart,
            };
            let result = await userModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: configObject.auth_google.google_client_id,
        clientSecret: configObject.auth_google.google_secret_client,
        callbackURL: configObject.auth_google.google_callback,
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        console.log("Profile", profile);
        try {
          let user = await userModel.findOne({ email: profile._json.email });
          const cart = await cm.addCart();
          if (!user) {
            let newUser = {
              name: profile._json.name,
              surname: "",
              age: 36,
              email: profile._json.email,
              password: "",
              cart,
            };
            let result = await userModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    try {
      done(null, user);
    } catch (error) {
      console.log(error);
    }
  });

  passport.deserializeUser((user, done) => {
    try {
      done(null, user);
    } catch (error) {
      console.log(error);
    }
  });
};

export default initializePassport;
