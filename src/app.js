import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import docRoutes from "./routes/docRoutes.js";
import askRoutes from "./routes/askRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import { logAsk } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(logAsk); 

app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/docs", docRoutes);
app.use("/api/ask", askRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;