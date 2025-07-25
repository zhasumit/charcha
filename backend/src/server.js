import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;


// middlewares (functions before some routes or api)
// allow frontend to send cookies and make the request
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use(cookieParser())


// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/chat", chatRoutes)


app.listen(PORT, () => {
    console.log(`Server Up! @http://localhost:${PORT}`);
    connectDB();
})