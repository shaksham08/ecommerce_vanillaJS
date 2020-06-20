const userRepo = require("../../repository/users");

const { check, validationResult } = require("express-validator");

module.exports = {
  requireEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const existingUser = await userRepo.getOneBy({ email: email });
      if (existingUser) {
        throw new Error("Email in use");
      }
    }),
  requirePassword: check("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Must be between 4 and 20 characters"),
  requirePasswordConformation: check("passwordConfirmation")
    .trim()
    .custom(async (passwordConfirmation, { req }) => {
      if (req.body.password !== passwordConfirmation) {
        throw new Error("Password must match");
      }
    }),
  requireEmailExist: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const existingUser = await userRepo.getOneBy({ email: email });
      if (!existingUser) {
        throw new Error("Email not found");
      }
    }),
  requireValidPasswordForUser: check("password")
    .trim()
    .custom(async (password, { req }) => {
      const existingUser = await userRepo.getOneBy({ email: req.body.email });
      if (!existingUser) {
        throw new Error("Invalid Password");
      }
      const validPassword = await userRepo.comparePassword(
        existingUser.password,
        password
      );
      if (!validPassword) {
        throw new Error("Invalid Password");
      }
    }),
  requireTitle: check("title")
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage("Must Be between 5 and 40 characters"),
  requirePrice: check("price")
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("Must be a valid price"),
};
