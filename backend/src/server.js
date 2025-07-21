import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;


// middlewares (functions before some routes or api)
app.use(express.json())
app.use(cookieParser())


// routes
app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
    console.log(`Server Up! @http://localhost:${PORT}`);
    connectDB();
})