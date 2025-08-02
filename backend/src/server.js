import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"

import { connectDB } from "./lib/db.js";
import { getLocalIP } from "./helper/getip.js";

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();


// middlewares (functions before some routes or api)
// allow frontend to send cookies and make the request
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use(cookieParser())


// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/chat", chatRoutes)


// under the production go to the dist folder and get the index.html
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

const ip = getLocalIP();
app.listen(PORT, () => {
    console.log(`Server Up! @ http://${ip}:${PORT} (${process.env.NODE_ENV})`);
    connectDB();
})