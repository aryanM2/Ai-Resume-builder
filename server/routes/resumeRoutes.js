import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";
import {
  createResume,
  getUserResumes,
  deleteResume,
  getPublicResumeById,
  updateResume,
  trackResumeDownload,
} from "../controller/resumeController.js";

const resumeRouter = express.Router();

// Public routes
resumeRouter.get("/public/:id", getPublicResumeById);

// Protected routes
resumeRouter.post("/", protect, createResume);
resumeRouter.get("/user/:userId", getUserResumes);
resumeRouter.delete("/:id", protect, deleteResume);
resumeRouter.put("/update", protect, upload.single('image'), updateResume);
resumeRouter.post("/track-download", protect, trackResumeDownload);

export default resumeRouter;

