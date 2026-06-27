import { configDotenv } from "dotenv";
configDotenv();

// Validate essential environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("FATAL ERROR: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be defined in your .env file.");
    process.exit(1);
}


import express from "express";
import cors from "cors";
import connectmongodb from "./config/db.js";
import aiRouter from "./routes/aiRoutes.js";
import authRouter from "./routes/authRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import passport, { configureGoogleAuth } from "./config/googleAuth.js";

await connectmongodb();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Enhanced CORS configuration for frontend and external services
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
configureGoogleAuth();
app.use(passport.initialize());
const PORT = process.env.PORT || 3000

app.use("/api/ai", aiRouter);
app.use("/api/users",authRouter)
app.use("/api/resume",resumeRouter)
app.use("/api/payment", paymentRouter);


app.get('/',(req,res)=>{
    res.send("started server")
})

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
