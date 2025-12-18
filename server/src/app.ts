import dotenv from "dotenv";
// import 
import express from "express";
import cors from "cors";
import playlistRoutes from "./routes/playlistGenerationRoutes";
import { initRedis } from "./lib/redis";

dotenv.config();
console.log("Loaded env vars:", process.env);
// require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/playlist", playlistRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await initRedis();
  } catch (err) {
    console.error('Redis initialization failed, exiting', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
