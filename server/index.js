import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(
    cors({
        origin: [process.env.ORIGIN], // request origin
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true, // allow cookies
    })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);

const server = app.listen(port, () => {
    console.log(`Server Up! http://localhost:${port}`);
});

mongoose
    .connect(databaseURL)
    .then(() => console.log("DB connected successfully"))
    .catch((err) => console.log(err.message));
