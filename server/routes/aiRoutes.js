import express from "express";
import { protect } from "../middleware/authMiddleware.js"
import {
  enhanceProfessionalSummary,
  enhanceJD,
  enhanceProject,
  analyzeAts,
} from "../controller/aiController.js";

const aiRouter = express.Router();

// Protected routes
aiRouter.post("/enhance-summary", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-jd", protect, enhanceJD);
aiRouter.post("/enhance-project", protect, enhanceProject);
aiRouter.post("/analyze-ats", protect, analyzeAts);

export default aiRouter;
