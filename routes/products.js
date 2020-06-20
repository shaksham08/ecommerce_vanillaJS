const express = require("express");
const router = express.Router();
const productsRepo = require("./../repository/products");

router.get("/", async (req, res) => {
  const products = await productsRepo.getAll();
  res.render("./products/index", { products });
});

module.exports = router;
