const express = require("express");
const router = express.Router();
const cartsRepo = require("./../repository/carts");
const productsRepo = require("./../repository/products");

//Recieve a post request to add item to card
router.post("/cart/products", async (req, res) => {
  let cart;

  if (!req.session.cartId) {
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    cart = await cartsRepo.getOne(req.session.cartId);
  }
  console.log(cart);
  const existingItem = cart.items.find((item) => item.id == req.body.productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  await cartsRepo.update(cart.id, {
    items: cart.items,
  });
  res.redirect("/cart");
});
//Recieve a get request to show item from the card
router.get("/cart", async (req, res) => {
  if (!req.session.cartId) {
    res.redirect("/");
  }

  const cart = await cartsRepo.getOne(req.session.cartId);
  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  }
  res.render("./carts/show", { items: cart.items });
});
//recieve a delete request to delete item from the cart
router.delete("/cart/products/:id/delete", async (req, res) => {
  console.log(req.session.cartId);
  const itemId = req.params.id;
  const cart = await cartsRepo.getOne(req.session.cartId);
  const items = cart.items.filter((item) => item.id !== itemId);
  await cartsRepo.update(req.session.cartId, { items });
  res.redirect("/cart");
});

module.exports = router;
