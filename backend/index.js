import env from "dotenv";
env.config();

const PORT = process.env.PORT || 5000;
import cors from "cors";
import express from "express";
const app = express();


app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Api is running");
});

import userRoutes from "./routes/UserRoutes.js";
import inventoryRoutes from "./routes/InventoryRoutes.js";
import recipeRoutes from "./routes/RecipeRoutes.js";

app.use("/api/inventory", inventoryRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/auth", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});