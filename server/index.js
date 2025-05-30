import express from "express";
import cors from "cors";
import "dotenv/config";
import { ConnectDB } from "./config/mongodb.js";
import UserRoutes from "./routes/UserRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
ConnectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.use("/api", UserRoutes);

app.listen(4000, () => {
  console.log("Server Start");
});
