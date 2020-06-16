const express = require("express");
const userRepo = require("../../repository/users");
const router = express.Router();
const signUpTemplate = require("../../views/admin/auth/signup");
const signInTemplate = require("../../views/admin/auth/signin");

router.get("/signup", (req, res) => {
  res.send(signUpTemplate({ req }));
});

router.post("/signup", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  const existigUser = await userRepo.getOneBy({ email: email });
  if (existigUser) {
    return res.send("Email in use");
  }
  if (password !== passwordConfirmation) {
    return res.send("password do not match");
  }
  const user = await userRepo.create({ email, password });
  req.session.userId = user.id;
  res.send("account created");
});

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("your are logged out");
});
router.get("/signin", (req, res) => {
  res.send(signInTemplate());
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const existigUser = await userRepo.getOneBy({ email: email });
  if (!existigUser) {
    return res.send("Email Not found");
  }
  const validPassword = await userRepo.comparePassword(
    existigUser.password,
    password
  );
  if (!validPassword) {
    return res.send("Invalid User");
  }

  req.session.userId = existigUser.id;
  res.send("Ypu are signed in");
});

module.exports = router;
