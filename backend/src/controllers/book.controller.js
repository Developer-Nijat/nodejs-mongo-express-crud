const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.get("/", async (req, res) => {
  try {
    const bookList = await Book.find();
    res.json(bookList);
  } catch (error) {
    console.log("Book GET error: ", error);
    res.status(500).json({ error });
  }
});

router.post("/", async (req, res) => {
  try {
    const book = new Book(req.body);
    const response = await book.save();
    res.json(response);
  } catch (error) {
    console.log("Book POST error:", error);
    res.status(500).json({ error });
  }
});

module.exports = router;
