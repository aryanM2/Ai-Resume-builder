import express from "express";
import { registerUser, LoginUser, forgotPassword, googleAuth, googleAuthCallback } from "../controller/userController.js";
import passport from "../config/googleAuth.js";

const authRouter = express.Router();


authRouter.post("/register", registerUser);
authRouter.post("/login", LoginUser);
authRouter.put("/forgot-password", forgotPassword);
authRouter.get("/google", googleAuth);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login?error=auth_failed",
  }),
  googleAuthCallback
);

export default authRouter;
