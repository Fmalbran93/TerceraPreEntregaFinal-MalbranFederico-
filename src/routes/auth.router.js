import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.post(
  "/",
  passport.authenticate("register", { failureRedirect: "/register" }),
  async (req, res) => {
    try {
      if (!req.user)
        return res.status(400).json({
          status: "success",
          message: "user not exists",
        });
      req.session.user = {
        name: req.user.name,
        surName: req.user.surName,
        age: req.user.age,
        role: req.user.roles,
        cart: req.user.cart,
        email: req.user.email,
      };
      req.session.login = true;
      res.redirect("/profile");
    } catch (err) {
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
);

export default authRouter;
