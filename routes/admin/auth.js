const express = require("express");
const userRepo = require("../../repository/users");
const router = express.Router();
const { handleErrors, requireAuth } = require("./middlewares")

const {
  requireEmail,
  requirePassword,
  requirePasswordConformation,
  requireEmailExist,
  requireValidPasswordForUser
} = require("./validator");

router.get("/signup", (req, res) => {
  const errormsg = null
  res.render("./admin/auth/signup", { errormsg });

});

router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConformation],
  handleErrors("./admin/auth/signup"),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await userRepo.create({ email, password });
    req.session.userId = user.id;
    res.redirect("/admin/products");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.redirect("./signin");
});
router.get("/signin", (req, res) => {
  const errormsg = null
  res.render("./admin/auth/signin", { errormsg });
});

router.post("/signin", [
  requireEmailExist,
  requireValidPasswordForUser
],
  handleErrors("./admin/auth/signin"),
  async (req, res) => {
    const { email } = req.body;

    const existigUser = await userRepo.getOneBy({ email: email });
    req.session.userId = existigUser.id;
    res.redirect("/admin/products");
  });

module.exports = router;
