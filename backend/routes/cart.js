const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
// Middleware to get user's cart
const getCart = async (req, res, next) => {
  console.log("testing ");
  try {
    const userId = req.userId;
    console.log(userId);

    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }
    req.cart = cart;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Get cart items
router.get("/", getCart, async (req, res) => {
  try {
    res.json(req.cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post("/add", getCart, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    console.log(productId, quantity);

    // Check if product exists
    const product = await Product.findById(productId);
    console.log(product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if item already exists in cart
    const existingItem = req.cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      req.cart.items.push({ product: productId, quantity });
    }

    await req.cart.save();
    res.json(req.cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

// Update cart item quantity
router.put("/update/:itemId", getCart, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const item = req.cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await req.cart.save();
    res.json(req.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove item from cart
router.delete("/remove/:itemId", getCart, async (req, res) => {
  try {
    const { itemId } = req.params;
    req.cart.items = req.cart.items.filter(
      (item) => item._id.toString() !== itemId
    );
    await req.cart.save();
    res.json(req.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Clear cart
router.delete("/clear", getCart, async (req, res) => {
  try {
    req.cart.items = [];
    await req.cart.save();
    res.json(req.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
