import express from "express";
import { connectDB } from "./config/db";
import inventoryRoutes from "./routes/inventoryRoutes";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

app.use(express.json());
app.use("/api", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
