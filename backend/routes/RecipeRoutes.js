import express from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middleware/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

// Fetch suggested recipes
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Get user inventory
    const ingredients = await prisma.ingredient.findMany({
      where: { userId: req.user },
      orderBy: { expiryDate: "asc" }, // Prioritize near-expiry ingredients
    });
    
    if (!ingredients.length) {
      return res.status(400).json({ message: "No ingredients found in inventory." });
    }

    // Get user preferences
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: req.user },
    });

    // Query parameters for Spoonacular API format
    const ingredientList = ingredients.map((ingredient) => ingredient.name).join(",");
    const cuisine = preferences?.cuisines ? preferences.cuisines.join(",") : "";
    const diet = preferences?.dietary ? preferences.dietary.join(",") : "";
    const intolerances = preferences?.allergies ? preferences.allergies.join(",") : "";

    // Fetch recipes from Spoonacular
    const { data } = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
      params: {
        includeIngredients: ingredientList,  // Ingredients in inventory
        cuisine,   // Preferences for cuisine
        diet, // Preferences for dietary restrictions
        intolerances, // Preferences for allergies
        fillIngredients: true,  // Fill missing ingredients
        addRecipeInformation: true, // Include recipe information
        addRecipeInstructions: true, // Include recipe instructions
        addRecipeNutrition: true,  // Include nutrition information
        instructionsRequired: true,  // Include instructions
        number: 10,  /// Number of recipes to fetch
        ignorePantry: true,   // Ignore pantry ingredients like salt, pepper, etc.
        apiKey: SPOONACULAR_API_KEY,
      },
    });
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes", error: error.message });
  }
});

export default router;
