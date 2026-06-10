import express from "express";
import { protect } from "../middleware/authMiddleware.js"
import {
  enhanceProfessionalSummary,
  enhanceJD,
  enhanceProject,
  uploadResume,
} from "../controller/aiController.js";

const aiRouter = express.Router();

// Protected routes
aiRouter.post("/enhance-summary", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-jd", protect, enhanceJD);
aiRouter.post("/enhance-project", protect, enhanceProject);
aiRouter.post("/upload-resume", protect, uploadResume);

export default aiRouter;
