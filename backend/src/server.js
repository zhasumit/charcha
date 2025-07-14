import express from "express";
import "dotenv/config";

import authRoutes from "./routes/auth.route.js"

const app = express();
const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server Up! @http://localhost:${PORT}`);
})