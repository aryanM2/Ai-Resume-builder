import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserById } from "../controllers/userController.js";

const userRouter = express.Router();

// Protected: get user by id
userRouter.get("/:id", protect, getUserById);

export default userRouter;

