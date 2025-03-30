import express from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get User Inventory
router.get("/", authMiddleware, async (req, res) => {
  try {
    const inventory = await prisma.ingredient.findMany({ where: { userId: req.user } });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add Ingredient to Inventory
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, quantity, expiryDate, imageKey } = req.body;

    // check if ingredient already exists increase quantity
    const existingIngredient = await prisma.ingredient.findFirst({
      where: { name, userId: req.user },
    });

    if (existingIngredient) {
      const updatedIngredient = await prisma.ingredient.update({
        where: { id: existingIngredient.id },
        data: { quantity: existingIngredient.quantity + quantity },
      });
      return res.status(201).json(updatedIngredient);
    }

    const ingredient = await prisma.ingredient.create({
      data: {
        name,
        quantity,
        expiryDate,
        imageKey,
        userId: req.user,
      },
    });
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update Ingredient in Inventory
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    const updateResult = await prisma.ingredient.updateMany({
      where: { id, userId: req.user },
      data: { quantity },
    });
    
    if (updateResult.count === 0) {
      return res.status(404).json({ message: "Ingredient not found or unauthorized" });
    }

    res.json({ message: "Ingredient updated" });
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete Ingredient from Inventory
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await prisma.ingredient.delete({ where: { id: req.params.id, userId: req.user } });
    res.json({ message: "Ingredient deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete All Ingredients from Inventory
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await prisma.ingredient.deleteMany({ where: { userId: req.user } });
    res.json({ message: "All ingredients deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
