const express = require("express");
const multer = require("multer");
const { handleErrors, requireAuth } = require("./middlewares")
const productsRepo = require("../../repository/products");
const { requireTitle, requirePrice } = require("./validator");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products/new", requireAuth, (req, res) => {
  const errormsg = null;
  res.render("./admin/products/new", { errormsg });
});

router.post(
  "/admin/products/new",
  requireAuth,
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors("./admin/products/new"),
  async (req, res) => {

    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });


    res.redirect("/admin/products");
  }
);

router.get("/admin/products", requireAuth, async (req, res) => {
  const products = await productsRepo.getAll();
  res.render("./admin/products/show.ejs", { products })
})

router.get("/admin/products/:id/edit", requireAuth, async (req, res) => {
  const product = await productsRepo.getOne(req.params.id);
  if (!product) {
    return res.send("Product not found")
  }
  const errormsg = null
  res.render("./admin/products/edit", { product, errormsg })
})

router.post("/admin/products/:id/edit", requireAuth,
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors("./admin/products/edit",
    async (req) => {
      const product = await productsRepo.getOne(req.params.id);
      return { product };
    }

  ), async (req, res) => {
    const changes = req.body;
    if (req.file) {
      changes.image = req.file.buffer.toString("base64")
    }
    try {
      await productsRepo.update(req.params.id, changes)

    }
    catch (err) {
      return res.send("Could not fine item")
    }
    res.redirect("/admin/products")
  })

router.delete("/admin/products/:id/delete", requireAuth, async (req, res) => {
  await productsRepo.delete(req.params.id);
  res.redirect("/admin/products");

})

module.exports = router;
