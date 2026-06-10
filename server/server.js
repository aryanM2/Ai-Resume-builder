import { configDotenv } from "dotenv";
configDotenv();

import express from "express";
import cors from "cors";
import connectmongodb from "./config/db.js";
import aiRouter from "./routes/aiRoutes.js";
import authRouter from "./routes/authRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import passport, { configureGoogleAuth } from "./config/googleAuth.js";

await connectmongodb();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
configureGoogleAuth();
app.use(passport.initialize());
const PORT = process.env.PORT || 3000

app.use("/api/ai", aiRouter);
app.use("/api/users",authRouter)
app.use("/api/resume",resumeRouter)


app.get('/',(req,res)=>{
    res.send("started server")
})

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})


