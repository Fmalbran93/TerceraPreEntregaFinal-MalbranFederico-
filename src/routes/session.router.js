import { Router } from "express";
import passport from "passport";

const sessionRouter = Router();

sessionRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/failLogin",
  }),
  async (req, res) => {
    try {
      if (!req.user)
        return res.status(400).json({
          status: "error",
          message: "User not exists",
        });

      req.session.user = {
        name: req.user.name,
        surName: req.user.surName,
        age: req.user.age,
        email: req.user.email,
        roles: req.user.roles,
        cart: req.session.cart,
      };
      req.session.login = true;
      res.redirect("/profile");
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Internal error server",
      });
    }
  }
);

sessionRouter.get("/failLogin", async (req, res) => {
  try {
    res.status(401).json({
      status: "Error",
      message: "failed to login, try again",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

sessionRouter.get("/logout", (req, res) => {
  try {
    if (req.session.login) req.session.destroy();
    res.redirect("/login");
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal error server",
    });
  }
});

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] })
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      req.session.user = req.user;
      req.session.login = true;
      res.redirect("/profile");
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Internal error server",
      });
    }
  }
);

sessionRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

sessionRouter.get(
  "/googlecallback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      req.session.email = req.email;
      req.session.login = true;
      res.redirect("/profile");
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Internal error server",
      });
    }
  }
);

export default sessionRouter;
