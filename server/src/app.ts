import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import playlistRoutes from "./routes/playlistGenerationRoutes"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/playlist", playlistRoutes)

app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
