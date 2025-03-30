import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, location, email, password } = req.body;
    if (!name || !location || !email || !password) return res.status(400).json({ message: "Please fill in all fields" });
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        location,
        email,
        password: hashedPassword,
        preferences: { create: {} },  
      },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, userId: user.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get users list
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { id: req.params.id },
      include: { preferences: true, inventory: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user details
router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { preferences: true, inventory: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user preferences
router.put("/:id/preferences", async (req, res) => {
  try {
    const { dietary, allergies, cuisines } = req.body;
    const updatedPreferences = await prisma.userPreferences.upsert({
      where: { userId: req.params.id },
      update: { dietary, allergies, cuisines },
      create: { userId: req.params.id, dietary, allergies, cuisines },
    });
    res.json(updatedPreferences);
  } catch (error) {
    res.status(500).json({ error: "Failed to update preferences" });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});


export default router;
